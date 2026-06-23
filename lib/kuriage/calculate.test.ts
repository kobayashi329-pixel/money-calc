import { describe, it, expect } from "vitest";
import { calculateKuriage } from "./calculate";
import type { KuriageInput } from "./calculate";

const base: KuriageInput = {
  principal: 30_000_000,
  annualRatePercent: 1,
  years: 35,
  prepayAmount: 1_000_000,
  prepayAfterYears: 5,
};

describe("3000万円・年1%・35年、5年後に100万円繰上", () => {
  const r = calculateKuriage(base);

  it("基準（繰上なし）: 毎月84,686円・420回・利息約557万円", () => {
    expect(r.baseline.monthlyPayment).toBe(84_686);
    expect(r.baseline.payoffMonths).toBe(420);
    expect(r.baseline.totalInterest).toBe(5_567_972);
  });

  it("期間短縮型: 利息341,360円減・15ヶ月短縮・毎月額は据え置き", () => {
    expect(r.shortenInterestSaved).toBe(341_360);
    expect(r.shortenMonthsReduced).toBe(15);
    expect(r.shorten.monthlyPayment).toBe(r.baseline.monthlyPayment);
    expect(r.shorten.payoffMonths).toBe(420 - 15);
  });

  it("返済額軽減型: 完済時期は同じ・毎月3,216円減・利息157,917円減", () => {
    expect(r.reduce.payoffMonths).toBe(420);
    expect(r.reduceMonthlyReduced).toBe(3_216);
    expect(r.reduceInterestSaved).toBe(157_917);
    expect(r.reduce.monthlyPayment).toBeLessThan(r.baseline.monthlyPayment);
  });

  it("期間短縮型のほうが返済額軽減型より利息軽減が大きい", () => {
    expect(r.shortenInterestSaved).toBeGreaterThan(r.reduceInterestSaved);
  });
});

describe("不変条件・境界値", () => {
  it("繰上額0なら両方とも基準と完全一致", () => {
    const r = calculateKuriage({ ...base, prepayAmount: 0 });
    expect(r.shortenInterestSaved).toBe(0);
    expect(r.shortenMonthsReduced).toBe(0);
    expect(r.reduceInterestSaved).toBe(0);
    expect(r.reduceMonthlyReduced).toBe(0);
    expect(r.shorten.payoffMonths).toBe(r.baseline.payoffMonths);
    expect(r.reduce.monthlyPayment).toBe(r.baseline.monthlyPayment);
  });

  it("繰上額が大きいほど利息軽減も大きい", () => {
    const small = calculateKuriage({ ...base, prepayAmount: 500_000 });
    const big = calculateKuriage({ ...base, prepayAmount: 3_000_000 });
    expect(big.shortenInterestSaved).toBeGreaterThan(small.shortenInterestSaved);
  });

  it("早い時期に繰上するほうが利息軽減は大きい（期間短縮型）", () => {
    const early = calculateKuriage({ ...base, prepayAfterYears: 3 });
    const late = calculateKuriage({ ...base, prepayAfterYears: 25 });
    expect(early.shortenInterestSaved).toBeGreaterThan(late.shortenInterestSaved);
  });

  it("金利0%なら利息は発生せず軽減額も0", () => {
    const r = calculateKuriage({ ...base, annualRatePercent: 0 });
    expect(r.baseline.totalInterest).toBe(0);
    expect(r.shortenInterestSaved).toBe(0);
    expect(r.reduceInterestSaved).toBe(0);
  });

  it("繰上額が残高以上でも破綻しない（完済して残高は0以上）", () => {
    const r = calculateKuriage({ ...base, prepayAmount: 50_000_000 });
    expect(r.shorten.payoffMonths).toBeLessThan(r.baseline.payoffMonths);
    expect(r.shorten.yearlyBalance[r.shorten.yearlyBalance.length - 1].balance).toBe(0);
  });
});
