import { describe, it, expect } from "vitest";
import { calculateSozoku, bracketTax } from "./calculate";

describe("速算表（国税庁 No.4155）", () => {
  it("1,000万円以下は10%", () => {
    expect(bracketTax(10_000_000)).toBe(1_000_000);
  });
  it("3,000万円は15%−50万＝400万円", () => {
    expect(bracketTax(30_000_000)).toBe(4_000_000);
  });
  it("1億円は30%−700万＝2,300万円", () => {
    expect(bracketTax(100_000_000)).toBe(23_000_000);
  });
});

describe("基礎控除（3000万＋600万×法定相続人数）", () => {
  it("配偶者＋子2人（3人）→ 4,800万円", () => {
    const r = calculateSozoku({ taxableEstate: 100_000_000, hasSpouse: true, children: 2 });
    expect(r.heirCount).toBe(3);
    expect(r.basicExemption).toBe(48_000_000);
  });
  it("遺産が基礎控除以下なら相続税はかからない", () => {
    const r = calculateSozoku({ taxableEstate: 40_000_000, hasSpouse: true, children: 2 });
    expect(r.isTaxable).toBe(false);
    expect(r.payableTax).toBe(0);
    expect(r.taxableEstateAfterExemption).toBe(0);
  });
});

// ---- 既知の正解値との照合（国税庁の計算例・各種公開資料の早見表）----
describe("相続税の総額・配偶者軽減後の納税額", () => {
  it("遺産1億円・配偶者＋子2人 → 総額630万円、配偶者軽減後315万円", () => {
    const r = calculateSozoku({ taxableEstate: 100_000_000, hasSpouse: true, children: 2 });
    expect(r.totalTax).toBe(6_300_000);
    expect(r.payableTax).toBe(3_150_000);
    // 配偶者の納税は税額軽減でゼロ
    const spouse = r.heirs.find((h) => h.kind === "spouse")!;
    expect(spouse.payable).toBe(0);
  });

  it("遺産2億円・配偶者＋子2人 → 総額2,700万円、軽減後1,350万円", () => {
    const r = calculateSozoku({ taxableEstate: 200_000_000, hasSpouse: true, children: 2 });
    expect(r.totalTax).toBe(27_000_000);
    expect(r.payableTax).toBe(13_500_000);
  });

  it("遺産1億円・配偶者なし・子2人 → 770万円（配偶者軽減なし）", () => {
    const r = calculateSozoku({ taxableEstate: 100_000_000, hasSpouse: false, children: 2 });
    expect(r.heirCount).toBe(2);
    expect(r.basicExemption).toBe(42_000_000);
    expect(r.totalTax).toBe(7_700_000);
    expect(r.payableTax).toBe(7_700_000);
  });
});

describe("不変条件", () => {
  it("配偶者がいると税額軽減で納税額は配偶者なしより小さい", () => {
    const withSpouse = calculateSozoku({ taxableEstate: 150_000_000, hasSpouse: true, children: 2 });
    const without = calculateSozoku({ taxableEstate: 150_000_000, hasSpouse: false, children: 2 });
    expect(withSpouse.payableTax).toBeLessThan(without.payableTax);
  });

  it("法定相続人が多いほど基礎控除が増え、納税額は減る", () => {
    const kids1 = calculateSozoku({ taxableEstate: 200_000_000, hasSpouse: true, children: 1 });
    const kids3 = calculateSozoku({ taxableEstate: 200_000_000, hasSpouse: true, children: 3 });
    expect(kids3.basicExemption).toBeGreaterThan(kids1.basicExemption);
    expect(kids3.payableTax).toBeLessThan(kids1.payableTax);
  });

  it("遺産が大きいほど納税額は増える", () => {
    const a = calculateSozoku({ taxableEstate: 100_000_000, hasSpouse: true, children: 2 });
    const b = calculateSozoku({ taxableEstate: 300_000_000, hasSpouse: true, children: 2 });
    expect(b.payableTax).toBeGreaterThan(a.payableTax);
  });

  it("相続人ごとの内訳の合計は納税額に一致する", () => {
    const r = calculateSozoku({ taxableEstate: 250_000_000, hasSpouse: true, children: 3 });
    const sum = r.heirs.reduce((s, h) => s + h.payable, 0);
    expect(sum).toBe(r.payableTax);
  });
});
