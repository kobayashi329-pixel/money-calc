import { describe, it, expect } from "vitest";
import { calculateTaishoku, retirementDeduction } from "./calculate";

describe("退職所得控除（国税庁 No.1420）", () => {
  it("勤続20年以下は40万円×年数（最低80万円）", () => {
    expect(retirementDeduction(1)).toBe(800_000); // 40万だが最低80万
    expect(retirementDeduction(10)).toBe(4_000_000);
    expect(retirementDeduction(20)).toBe(8_000_000);
  });
  it("勤続20年超は800万＋70万×(年数−20)", () => {
    expect(retirementDeduction(38)).toBe(20_600_000);
    expect(retirementDeduction(30)).toBe(15_000_000);
  });
  it("勤続年数は1年未満を切り上げる", () => {
    expect(retirementDeduction(20.1)).toBe(retirementDeduction(21));
  });
});

describe("総合計算（原則: 1/2課税）", () => {
  it("退職金2,500万・勤続38年 → 所得税125,000・住民税220,000・手取り24,655,000", () => {
    const r = calculateTaishoku({ severance: 25_000_000, years: 38 });
    expect(r.retirementDeduction).toBe(20_600_000);
    expect(r.taxableIncome).toBe(2_200_000); // (2500万−2060万)÷2
    expect(r.halfApplied).toBe("full");
    expect(r.incomeTax).toBe(125_000);
    expect(r.residentTax).toBe(220_000);
    expect(r.takeHome).toBe(24_655_000);
  });

  it("控除以下なら非課税（2,000万・勤続38年は退職所得控除2,060万円以下）", () => {
    const r = calculateTaishoku({ severance: 20_000_000, years: 38 });
    expect(r.taxableIncome).toBe(0);
    expect(r.totalTax).toBe(0);
    expect(r.takeHome).toBe(20_000_000);
  });

  it("退職金1,000万・勤続10年 → 課税退職所得300万・手取り9,493,300", () => {
    const r = calculateTaishoku({ severance: 10_000_000, years: 10 });
    expect(r.taxableIncome).toBe(3_000_000);
    expect(r.incomeTax).toBe(206_700);
    expect(r.residentTax).toBe(300_000);
    expect(r.takeHome).toBe(9_493_300);
  });
});

describe("勤続5年以下の特例", () => {
  it("短期退職手当等（非役員5年以下）: 控除後300万超の部分は1/2しない", () => {
    const r = calculateTaishoku({ severance: 6_000_000, years: 3 });
    // 控除120万 → 控除後480万 → 課税 = 150万 + (480万−300万) = 330万
    expect(r.halfApplied).toBe("partial");
    expect(r.taxableIncome).toBe(3_300_000);
    expect(r.incomeTax).toBe(237_300);
    expect(r.residentTax).toBe(330_000);
  });

  it("特定役員（役員5年以下）: 1/2課税なしで全額課税 → 非役員より重い", () => {
    const officer = calculateTaishoku({ severance: 6_000_000, years: 3, isOfficer: true });
    const normal = calculateTaishoku({ severance: 6_000_000, years: 3 });
    expect(officer.halfApplied).toBe("none");
    expect(officer.taxableIncome).toBe(4_800_000); // 控除後480万を全額
    expect(officer.totalTax).toBeGreaterThan(normal.totalTax);
  });

  it("控除後300万以下なら5年以下でも1/2が効く", () => {
    // 退職金350万・勤続3年: 控除120万 → 控除後230万(≤300万) → 課税115万
    const r = calculateTaishoku({ severance: 3_500_000, years: 3 });
    expect(r.halfApplied).toBe("full");
    expect(r.taxableIncome).toBe(1_150_000);
  });
});

describe("不変条件", () => {
  it("手取り＋税金 ＝ 退職金", () => {
    for (const s of [3_000_000, 10_000_000, 25_000_000, 50_000_000]) {
      const r = calculateTaishoku({ severance: s, years: 30 });
      expect(r.takeHome + r.totalTax).toBe(s);
    }
  });
  it("退職金が増えるほど手取りも増える", () => {
    const a = calculateTaishoku({ severance: 20_000_000, years: 30 });
    const b = calculateTaishoku({ severance: 40_000_000, years: 30 });
    expect(b.takeHome).toBeGreaterThan(a.takeHome);
  });
});
