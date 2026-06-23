import { describe, it, expect } from "vitest";
import { calculateKarikae } from "./calculate";
import type { KarikaeInput } from "./calculate";

const base: KarikaeInput = {
  balance: 20_000_000,
  remainingYears: 25,
  currentRatePercent: 1.5,
  newRatePercent: 0.7,
  fee: 600_000,
};

describe("残高2000万・残25年・1.5%→0.7%・諸費用60万", () => {
  const r = calculateKarikae(base);

  it("毎月の返済額が下がる（79,987 → 72,689円・−7,298円）", () => {
    expect(r.current.monthlyPayment).toBe(79_987);
    expect(r.refinanced.monthlyPayment).toBe(72_689);
    expect(r.monthlyReduction).toBe(7_298);
  });

  it("利息軽減で総返済額が約219万円減り、諸費用控除後の正味メリットは約159万円", () => {
    expect(r.totalSaved).toBe(2_189_345);
    expect(r.netBenefit).toBe(2_189_345 - 600_000);
    expect(r.worthIt).toBe(true);
  });
});

describe("不変条件・境界値", () => {
  it("金利が同じなら返済額は変わらず、メリットは諸費用分だけマイナス", () => {
    const r = calculateKarikae({ ...base, newRatePercent: 1.5 });
    expect(r.monthlyReduction).toBe(0);
    expect(r.totalSaved).toBe(0);
    expect(r.netBenefit).toBe(-600_000);
    expect(r.worthIt).toBe(false);
  });

  it("金利が上がる借り換えは損（正味メリットがマイナス）", () => {
    const r = calculateKarikae({ ...base, newRatePercent: 2.0 });
    expect(r.monthlyReduction).toBeLessThan(0);
    expect(r.netBenefit).toBeLessThan(0);
    expect(r.worthIt).toBe(false);
  });

  it("金利差が大きいほど総返済額の軽減も大きい", () => {
    const small = calculateKarikae({ ...base, newRatePercent: 1.2 });
    const big = calculateKarikae({ ...base, newRatePercent: 0.5 });
    expect(big.totalSaved).toBeGreaterThan(small.totalSaved);
  });

  it("諸費用が軽減額を上回ると借り換えメリットなし", () => {
    const r = calculateKarikae({ ...base, newRatePercent: 1.4, fee: 800_000 });
    expect(r.totalSaved).toBeGreaterThan(0); // 金利は少し下がる
    expect(r.netBenefit).toBeLessThan(0); // でも諸費用負け
    expect(r.worthIt).toBe(false);
  });

  it("総返済額＝元金＋利息（取りこぼしなし）", () => {
    const r = calculateKarikae(base);
    expect(r.current.totalPayment).toBe(base.balance + r.current.totalInterest);
    expect(r.refinanced.totalPayment).toBe(base.balance + r.refinanced.totalInterest);
  });
});
