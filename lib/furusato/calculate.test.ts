import { describe, it, expect } from "vitest";
import {
  calculateFurusato,
  marginalIncomeTaxRate,
  SELF_PAY,
} from "./calculate";
import type { FurusatoInput } from "./types";

const base: Omit<FurusatoInput, "annualIncome"> = {
  age: 30,
  hasSpouse: false,
  dependents: 0,
};

describe("所得税の限界税率（国税庁 No.2260）", () => {
  it("課税所得195万以下は5%", () => {
    expect(marginalIncomeTaxRate(1_949_000)).toBe(0.05);
  });
  it("課税所得330万以下は10%", () => {
    expect(marginalIncomeTaxRate(2_000_000)).toBe(0.1);
    expect(marginalIncomeTaxRate(3_299_000)).toBe(0.1);
  });
  it("課税所得695万以下は20%、それ超は23%", () => {
    expect(marginalIncomeTaxRate(6_949_000)).toBe(0.2);
    expect(marginalIncomeTaxRate(6_950_000)).toBe(0.23);
  });
  it("最高は45%", () => {
    expect(marginalIncomeTaxRate(50_000_000)).toBe(0.45);
  });
});

// ---- 既知の上限額レンジとの照合 ----
//   総務省・各社シミュレータで広く知られた「独身・共働き」の目安：
//     年収300万 ≒ 2.8万 / 500万 ≒ 6.1万 / 700万 ≒ 10.8万
describe("上限額: 独身（扶養なし）— 公知の目安レンジと一致", () => {
  it("年収300万 → 約28,000円", () => {
    const r = calculateFurusato({ ...base, annualIncome: 3_000_000 });
    expect(r.limit).toBe(28_000);
  });
  it("年収500万 → 約61,000円", () => {
    const r = calculateFurusato({ ...base, annualIncome: 5_000_000 });
    expect(r.limit).toBe(61_000);
  });
  it("年収700万 → 約108,000円", () => {
    const r = calculateFurusato({ ...base, annualIncome: 7_000_000 });
    expect(r.limit).toBe(108_000);
  });
});

describe("配偶者控除がある場合は上限額が下がる", () => {
  it("年収500万・配偶者控除ありは独身より少ない（控除で所得割が減るため）", () => {
    const single = calculateFurusato({ ...base, annualIncome: 5_000_000 });
    const married = calculateFurusato({
      ...base,
      annualIncome: 5_000_000,
      hasSpouse: true,
    });
    expect(married.limit).toBeLessThan(single.limit);
    // 公知の「年収500万・夫婦」目安(約4.9万)に近い水準
    expect(married.limit).toBeGreaterThan(45_000);
    expect(married.limit).toBeLessThan(55_000);
  });
  it("扶養人数が増えるほど上限額は下がる", () => {
    const d0 = calculateFurusato({ ...base, annualIncome: 7_000_000, dependents: 0 });
    const d2 = calculateFurusato({ ...base, annualIncome: 7_000_000, dependents: 2 });
    expect(d2.limit).toBeLessThan(d0.limit);
  });
});

describe("不変条件", () => {
  it("上限額まで寄付すれば自己負担はちょうど2,000円", () => {
    for (const income of [3_000_000, 5_000_000, 7_000_000, 12_000_000, 20_000_000]) {
      const r = calculateFurusato({ ...base, annualIncome: income });
      expect(r.breakdown.selfPay).toBe(SELF_PAY);
    }
  });

  it("控除内訳の合計は『寄付額 − 2,000円』に一致する", () => {
    const r = calculateFurusato({ ...base, annualIncome: 6_000_000 });
    expect(r.breakdown.totalDeduction).toBe(r.limit - SELF_PAY);
  });

  it("特例分の控除は住民税所得割の20%を超えない", () => {
    for (const income of [3_000_000, 5_000_000, 8_000_000, 15_000_000]) {
      const r = calculateFurusato({ ...base, annualIncome: income });
      const cap = r.residentTaxIncomeLevy * 0.2;
      expect(r.breakdown.residentSpecialDeduction).toBeLessThanOrEqual(cap);
    }
  });

  it("年収が上がるほど上限額は増える（単調増加）", () => {
    const incomes = [3_000_000, 5_000_000, 7_000_000, 10_000_000, 20_000_000];
    const limits = incomes.map(
      (annualIncome) => calculateFurusato({ ...base, annualIncome }).limit,
    );
    for (let i = 1; i < limits.length; i++) {
      expect(limits[i]).toBeGreaterThan(limits[i - 1]);
    }
  });

  it("住民税の所得割が生じない低収入では上限額0（メリットなし）", () => {
    const r = calculateFurusato({ ...base, annualIncome: 1_000_000 });
    expect(r.residentTaxIncomeLevy).toBe(0);
    expect(r.limit).toBe(0);
    expect(r.breakdown.totalDeduction).toBe(0);
  });

  it("都道府県を変えても上限額は常識的レンジ内（社保差はわずか）", () => {
    const tokyo = calculateFurusato({ ...base, annualIncome: 5_000_000, prefecture: "13" });
    const saga = calculateFurusato({ ...base, annualIncome: 5_000_000, prefecture: "41" });
    // 社会保険料が高い県は課税所得が下がり上限も僅かに下がる
    expect(saga.limit).toBeLessThanOrEqual(tokyo.limit);
    expect(Math.abs(tokyo.limit - saga.limit)).toBeLessThan(3_000);
  });
});
