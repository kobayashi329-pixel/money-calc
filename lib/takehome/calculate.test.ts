import { describe, it, expect } from "vitest";
import {
  calculateTakeHome,
  salaryIncomeDeduction,
  employmentIncome,
  calcSocialInsurance,
} from "./calculate";
import type { TakeHomeInput } from "./types";

const base: Omit<TakeHomeInput, "annualIncome"> = {
  age: 30,
  dependents: 0,
  insuranceType: "kenkohoken",
};

describe("給与所得控除（令和7年分・国税庁 No.1410）", () => {
  it("最低保障65万円（収入190万円以下）", () => {
    expect(salaryIncomeDeduction(1_000_000)).toBe(650_000);
    expect(salaryIncomeDeduction(1_900_000)).toBe(650_000);
  });
  it("190万円の境界で連続している", () => {
    // 30%＋8万 の式は 190万でちょうど65万になる
    expect(salaryIncomeDeduction(1_900_001)).toBeCloseTo(650_000, 0);
  });
  it("上限195万円（収入850万円超は定額）", () => {
    expect(salaryIncomeDeduction(8_500_000)).toBe(1_950_000);
    expect(salaryIncomeDeduction(20_000_000)).toBe(1_950_000);
  });
  it("中間の区分（年収500万）は20%＋44万", () => {
    expect(salaryIncomeDeduction(5_000_000)).toBe(1_440_000);
  });
});

describe("給与所得", () => {
  it("年収500万 → 給与所得356万", () => {
    expect(employmentIncome(5_000_000)).toBe(3_560_000);
  });
});

describe("社会保険料（令和7年度・協会けんぽ東京）", () => {
  it("40歳未満は介護保険料なし", () => {
    const s = calcSocialInsurance(5_000_000, 30);
    expect(s.longTermCare).toBe(0);
  });
  it("40〜64歳は介護保険料が上乗せされる", () => {
    const s = calcSocialInsurance(5_000_000, 45);
    expect(s.longTermCare).toBeGreaterThan(0);
    // 介護分は健康保険分よりかなり小さい
    expect(s.longTermCare).toBeLessThan(s.health);
  });
  it("65歳は介護保険第2号被保険者ではない（給与天引きなし）", () => {
    const s = calcSocialInsurance(5_000_000, 65);
    expect(s.longTermCare).toBe(0);
  });
  it("厚生年金は標準報酬月額65万円で頭打ちになる", () => {
    const low = calcSocialInsurance(7_800_000, 30); // 月65万ちょうど
    const high = calcSocialInsurance(20_000_000, 30); // 月上限超
    expect(high.pension).toBe(low.pension);
  });
});

// ---- 既知の手取り値との照合（手計算 + 公開計算機の概算レンジ）----
describe("総合計算: 年収500万・30歳・扶養0", () => {
  const r = calculateTakeHome({ ...base, annualIncome: 5_000_000 });

  it("社会保険料 ≒ 73.3万円", () => {
    expect(r.socialInsurance.total).toBe(732_750);
  });
  it("所得税（復興込）＝119,600円", () => {
    expect(r.incomeTax.total).toBe(119_600);
  });
  it("住民税＝242,200円", () => {
    expect(r.residentTax.total).toBe(242_200);
  });
  it("手取り年収＝3,905,450円（公開計算機の約390万と一致）", () => {
    expect(r.takeHomeAnnual).toBe(3_905_450);
  });
  it("手取り率は78〜80%の常識的レンジに収まる", () => {
    expect(r.takeHomeRate).toBeGreaterThan(0.78);
    expect(r.takeHomeRate).toBeLessThan(0.8);
  });
});

describe("総合計算: 年収300万・30歳・扶養0", () => {
  const r = calculateTakeHome({ ...base, annualIncome: 3_000_000 });
  it("手取り年収＝2,407,150円（公開計算機の約240万と一致）", () => {
    expect(r.takeHomeAnnual).toBe(2_407_150);
  });
  it("手取り率は約80%", () => {
    expect(r.takeHomeRate).toBeGreaterThan(0.79);
    expect(r.takeHomeRate).toBeLessThan(0.81);
  });
});

describe("不変条件・境界値", () => {
  it("内訳の合計は必ず額面年収に一致する（取りこぼしなし）", () => {
    for (const income of [1_000_000, 3_000_000, 5_000_000, 8_000_000, 12_000_000]) {
      const r = calculateTakeHome({ ...base, annualIncome: income });
      const sum =
        r.takeHomeAnnual +
        r.socialInsurance.total +
        r.incomeTax.total +
        r.residentTax.total;
      expect(sum).toBe(income);
    }
  });

  it("年収0なら全て0、手取りも0", () => {
    const r = calculateTakeHome({ ...base, annualIncome: 0 });
    expect(r.socialInsurance.total).toBe(0);
    expect(r.incomeTax.total).toBe(0);
    expect(r.residentTax.total).toBe(0);
    expect(r.takeHomeAnnual).toBe(0);
  });

  it("年収が上がるほど手取り額は増えるが手取り率は下がる（累進性）", () => {
    const incomes = [3_000_000, 5_000_000, 8_000_000, 12_000_000, 20_000_000];
    const results = incomes.map((annualIncome) =>
      calculateTakeHome({ ...base, annualIncome }),
    );
    for (let i = 1; i < results.length; i++) {
      expect(results[i].takeHomeAnnual).toBeGreaterThan(results[i - 1].takeHomeAnnual);
      expect(results[i].takeHomeRate).toBeLessThan(results[i - 1].takeHomeRate);
    }
  });

  it("扶養人数が増えると税負担が減り手取りが増える", () => {
    const r0 = calculateTakeHome({ ...base, annualIncome: 6_000_000, dependents: 0 });
    const r2 = calculateTakeHome({ ...base, annualIncome: 6_000_000, dependents: 2 });
    expect(r2.incomeTax.total).toBeLessThan(r0.incomeTax.total);
    expect(r2.residentTax.total).toBeLessThan(r0.residentTax.total);
    expect(r2.takeHomeAnnual).toBeGreaterThan(r0.takeHomeAnnual);
  });
});

describe("前年収入オプション（住民税は前年所得ベース）", () => {
  it("前年収入を指定しなければ当年と同じ（既存挙動は不変）", () => {
    const without = calculateTakeHome({ ...base, annualIncome: 5_000_000 });
    const sameExplicit = calculateTakeHome({
      ...base,
      annualIncome: 5_000_000,
      priorYearIncome: 5_000_000,
    });
    expect(without.residentTax.total).toBe(sameExplicit.residentTax.total);
    expect(without.residentTaxBasisIncome).toBe(5_000_000);
  });

  it("前年が高収入なら住民税が上がり手取りが減る（所得税・社保は当年のまま）", () => {
    const cur = calculateTakeHome({ ...base, annualIncome: 4_000_000, age: 45 });
    const dropped = calculateTakeHome({
      ...base,
      annualIncome: 4_000_000,
      age: 45,
      priorYearIncome: 10_000_000, // 昨年は高収入
    });
    // 住民税は前年(高収入)ベースなので増える
    expect(dropped.residentTax.total).toBeGreaterThan(cur.residentTax.total);
    // 所得税・社会保険料は当年(400万)ベースなので変わらない
    expect(dropped.incomeTax.total).toBe(cur.incomeTax.total);
    expect(dropped.socialInsurance.total).toBe(cur.socialInsurance.total);
    // その結果、手取りは減る
    expect(dropped.takeHomeAnnual).toBeLessThan(cur.takeHomeAnnual);
    expect(dropped.residentTaxBasisIncome).toBe(10_000_000);
  });

  it("前年収入オプションでも内訳合計は額面年収に一致する", () => {
    const r = calculateTakeHome({
      ...base,
      annualIncome: 6_000_000,
      priorYearIncome: 9_000_000,
    });
    const sum =
      r.takeHomeAnnual +
      r.socialInsurance.total +
      r.incomeTax.total +
      r.residentTax.total;
    expect(sum).toBe(6_000_000);
  });
});

describe("都道府県別の健康保険料率（協会けんぽ・令和7年度）", () => {
  const inc = 5_000_000;
  it("都道府県未指定は東京都（13）と同じ", () => {
    const def = calculateTakeHome({ ...base, annualIncome: inc });
    const tokyo = calculateTakeHome({ ...base, annualIncome: inc, prefecture: "13" });
    expect(def.socialInsurance.health).toBe(tokyo.socialInsurance.health);
  });
  it("東京都の健康保険料（年収500万・30歳）＝247,750円", () => {
    const r = calculateTakeHome({ ...base, annualIncome: inc, prefecture: "13" });
    expect(r.socialInsurance.health).toBe(247_750);
  });
  it("佐賀県(最高10.78%)＞東京都＞沖縄県(最低9.44%)", () => {
    const saga = calculateTakeHome({ ...base, annualIncome: inc, prefecture: "41" });
    const tokyo = calculateTakeHome({ ...base, annualIncome: inc, prefecture: "13" });
    const okinawa = calculateTakeHome({ ...base, annualIncome: inc, prefecture: "47" });
    expect(saga.socialInsurance.health).toBeGreaterThan(tokyo.socialInsurance.health);
    expect(tokyo.socialInsurance.health).toBeGreaterThan(okinawa.socialInsurance.health);
    expect(saga.socialInsurance.health).toBe(269_500); // 5,000,000 × 10.78%/2
  });
  it("無効な都道府県コードは東京都にフォールバック", () => {
    const invalid = calculateTakeHome({ ...base, annualIncome: inc, prefecture: "99" });
    const tokyo = calculateTakeHome({ ...base, annualIncome: inc, prefecture: "13" });
    expect(invalid.socialInsurance.health).toBe(tokyo.socialInsurance.health);
  });
  it("都道府県を変えても内訳合計は額面年収に一致する", () => {
    for (const p of ["01", "13", "27", "41", "47"]) {
      const r = calculateTakeHome({ ...base, annualIncome: inc, prefecture: p });
      const sum =
        r.takeHomeAnnual +
        r.socialInsurance.total +
        r.incomeTax.total +
        r.residentTax.total;
      expect(sum).toBe(inc);
    }
  });
});
