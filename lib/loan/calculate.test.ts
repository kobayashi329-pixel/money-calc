import { describe, it, expect } from "vitest";
import { calculateLoan, equalPaymentMonthly } from "./calculate";

describe("元利均等返済（3000万円・年1.0%・35年）", () => {
  const r = calculateLoan({
    principal: 30_000_000,
    annualRatePercent: 1.0,
    years: 35,
    method: "equal-payment",
  });

  it("毎月返済額は約84,685円（公開計算機と一致・端数±数円）", () => {
    expect(r.monthlyPayment).toBeGreaterThanOrEqual(84_680);
    expect(r.monthlyPayment).toBeLessThanOrEqual(84_690);
  });
  it("元利均等は毎月の返済額が一定（初回＝最終回手前まで月額）", () => {
    expect(r.firstPayment).toBe(r.monthlyPayment);
  });
  it("総返済額は約3,557万円・利息は約557万円", () => {
    expect(r.totalPayment).toBeGreaterThan(35_500_000);
    expect(r.totalPayment).toBeLessThan(35_600_000);
    expect(r.totalInterest).toBeGreaterThan(5_500_000);
    expect(r.totalInterest).toBeLessThan(5_600_000);
  });
  it("総返済額 ＝ 借入額 ＋ 利息総額", () => {
    expect(r.totalPayment).toBe(r.principal + r.totalInterest);
  });
  it("残高は最終的に0になる", () => {
    expect(r.yearlyBalance[r.yearlyBalance.length - 1].balance).toBe(0);
  });
});

describe("元金均等返済（3000万円・年1.0%・35年）", () => {
  const r = calculateLoan({
    principal: 30_000_000,
    annualRatePercent: 1.0,
    years: 35,
    method: "equal-principal",
  });

  it("初回返済額が最大（元金71,428＋利息25,000≒96,428円）", () => {
    expect(r.firstPayment).toBeGreaterThan(96_000);
    expect(r.firstPayment).toBeLessThan(97_000);
  });
  it("返済額は徐々に減る（初回＞最終回）", () => {
    expect(r.firstPayment).toBeGreaterThan(r.lastPayment);
  });
  it("総返済額 ＝ 借入額 ＋ 利息総額", () => {
    expect(r.totalPayment).toBe(r.principal + r.totalInterest);
  });
});

describe("方式の比較・金利・境界値", () => {
  it("元金均等は元利均等より利息総額が少ない", () => {
    const equalPayment = calculateLoan({
      principal: 30_000_000,
      annualRatePercent: 1.0,
      years: 35,
      method: "equal-payment",
    });
    const equalPrincipal = calculateLoan({
      principal: 30_000_000,
      annualRatePercent: 1.0,
      years: 35,
      method: "equal-principal",
    });
    expect(equalPrincipal.totalInterest).toBeLessThan(equalPayment.totalInterest);
  });

  it("金利が高いほど利息総額が増える", () => {
    const low = calculateLoan({ principal: 30_000_000, annualRatePercent: 0.5, years: 35, method: "equal-payment" });
    const high = calculateLoan({ principal: 30_000_000, annualRatePercent: 2.0, years: 35, method: "equal-payment" });
    expect(high.totalInterest).toBeGreaterThan(low.totalInterest);
  });

  it("金利0%なら利息0・毎月返済＝借入額÷回数", () => {
    const r = calculateLoan({ principal: 36_000_000, annualRatePercent: 0, years: 30, method: "equal-payment" });
    expect(r.totalInterest).toBe(0);
    expect(r.monthlyPayment).toBe(100_000); // 36,000,000 / 360
    expect(r.totalPayment).toBe(36_000_000);
  });

  it("借入額0なら全て0", () => {
    const r = calculateLoan({ principal: 0, annualRatePercent: 1, years: 35, method: "equal-payment" });
    expect(r.monthlyPayment).toBe(0);
    expect(r.totalPayment).toBe(0);
  });

  it("equalPaymentMonthly: 金利0は元本÷回数", () => {
    expect(equalPaymentMonthly(1_200_000, 0, 12)).toBe(100_000);
  });
});
