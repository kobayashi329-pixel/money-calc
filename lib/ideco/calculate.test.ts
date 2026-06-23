import { describe, it, expect } from "vitest";
import { calculateIdeco } from "./calculate";
import type { IdecoInput } from "./types";

const base: Omit<IdecoInput, "annualIncome"> = {
  age: 30,
  categoryKey: "kaishain-none",
  monthlyContribution: 23_000,
  annualRatePercent: 5,
};

describe("iDeCoの節税額（掛金が全額所得控除）", () => {
  it("年収500万・会社員(企業年金なし)・掛金2.3万/月 → 年間節税≒55,780円", () => {
    const r = calculateIdeco({ ...base, annualIncome: 5_000_000 });
    // 限界税率10%。掛金年額276,000 ×(0.10×1.021 + 0.10) ≒ 55,780円
    expect(r.marginalIncomeTaxRate).toBe(0.1);
    expect(r.annualTaxSaving).toBe(55_780);
    expect(r.annualIncomeTaxSaving + r.annualResidentTaxSaving).toBe(r.annualTaxSaving);
  });

  it("年収が高いほど限界税率が上がり節税額も増える", () => {
    const mid = calculateIdeco({ ...base, annualIncome: 5_000_000 });
    const high = calculateIdeco({ ...base, annualIncome: 12_000_000 });
    expect(high.marginalIncomeTaxRate).toBeGreaterThan(mid.marginalIncomeTaxRate);
    expect(high.annualTaxSaving).toBeGreaterThan(mid.annualTaxSaving);
  });

  it("所得がない専業主婦・主夫は節税メリットなし（節税額0）", () => {
    const r = calculateIdeco({
      ...base,
      annualIncome: 0,
      categoryKey: "fuyo",
      monthlyContribution: 23_000,
    });
    expect(r.annualTaxSaving).toBe(0);
    expect(r.totalTaxSaving).toBe(0);
  });
});

describe("掛金上限（加入区分別）", () => {
  it("会社員(企業年金なし)の上限は月2.3万円。超過分はクランプされる", () => {
    const r = calculateIdeco({
      ...base,
      annualIncome: 6_000_000,
      monthlyContribution: 30_000,
    });
    expect(r.monthlyLimit).toBe(23_000);
    expect(r.monthlyContribution).toBe(23_000);
    expect(r.wasCapped).toBe(true);
    expect(r.annualContribution).toBe(276_000);
  });

  it("自営業（第1号）の上限は月6.8万円", () => {
    const r = calculateIdeco({
      ...base,
      annualIncome: 6_000_000,
      categoryKey: "jiei",
      monthlyContribution: 68_000,
    });
    expect(r.monthlyLimit).toBe(68_000);
    expect(r.monthlyContribution).toBe(68_000);
    expect(r.wasCapped).toBe(false);
  });

  it("公務員・DB等ありの上限は月2.0万円", () => {
    const r = calculateIdeco({
      ...base,
      annualIncome: 6_000_000,
      categoryKey: "kaishain-db",
      monthlyContribution: 23_000,
    });
    expect(r.monthlyLimit).toBe(20_000);
    expect(r.monthlyContribution).toBe(20_000);
    expect(r.wasCapped).toBe(true);
  });
});

describe("積立期間と運用", () => {
  it("積立期間は65歳までの年数", () => {
    expect(calculateIdeco({ ...base, annualIncome: 5_000_000, age: 30 }).years).toBe(35);
    expect(calculateIdeco({ ...base, annualIncome: 5_000_000, age: 50 }).years).toBe(15);
    expect(calculateIdeco({ ...base, annualIncome: 5_000_000, age: 65 }).years).toBe(0);
  });

  it("総節税額＝年間節税額×積立年数", () => {
    const r = calculateIdeco({ ...base, annualIncome: 5_000_000, age: 30 });
    expect(r.totalTaxSaving).toBe(r.annualTaxSaving * r.years);
  });

  it("評価額＝元本＋運用益、運用益はプラス", () => {
    const r = calculateIdeco({ ...base, annualIncome: 5_000_000, age: 30 });
    expect(r.finalValue).toBe(r.totalPrincipal + r.totalGain);
    expect(r.totalGain).toBeGreaterThan(0);
    expect(r.totalPrincipal).toBe(23_000 * 12 * 35);
  });
});
