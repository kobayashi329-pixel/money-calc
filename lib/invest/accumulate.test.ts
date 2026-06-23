import { describe, it, expect } from "vitest";
import { accumulate } from "./accumulate";

describe("積立の複利計算エンジン", () => {
  it("利回り0%なら評価額＝元本（運用益なし）", () => {
    const r = accumulate({ monthlyContribution: 30_000, annualRatePercent: 0, years: 10 });
    expect(r.totalPrincipal).toBe(3_600_000);
    expect(r.finalValue).toBe(3_600_000);
    expect(r.totalGain).toBe(0);
  });

  it("元本は毎月の積立額×月数", () => {
    const r = accumulate({ monthlyContribution: 23_000, annualRatePercent: 5, years: 20 });
    expect(r.totalPrincipal).toBe(23_000 * 240);
  });

  it("毎月3万円・年5%・20年 → 既知の年金終価に一致（約1,233万円）", () => {
    // 月利 r=0.05/12, n=240 の期末払い終価係数で検算
    const r = accumulate({ monthlyContribution: 30_000, annualRatePercent: 5, years: 20 });
    // 理論値: 30000 * ((1+r)^240 - 1)/r ≒ 12,331,010 円
    expect(r.finalValue).toBeGreaterThan(12_320_000);
    expect(r.finalValue).toBeLessThan(12_340_000);
    expect(r.totalPrincipal).toBe(7_200_000);
    expect(r.totalGain).toBe(r.finalValue - r.totalPrincipal);
  });

  it("運用益はプラス、利回りが高いほど評価額は大きい", () => {
    const low = accumulate({ monthlyContribution: 30_000, annualRatePercent: 3, years: 30 });
    const high = accumulate({ monthlyContribution: 30_000, annualRatePercent: 7, years: 30 });
    expect(high.finalValue).toBeGreaterThan(low.finalValue);
    expect(low.totalGain).toBeGreaterThan(0);
  });

  it("年ごとの推移は years 件、各年で評価額＝元本＋運用益", () => {
    const r = accumulate({ monthlyContribution: 10_000, annualRatePercent: 4, years: 15 });
    expect(r.yearly).toHaveLength(15);
    expect(r.yearly[14].year).toBe(15);
    for (const p of r.yearly) {
      expect(p.total).toBe(p.principal + p.gain);
    }
    // 最終年の評価額は結果の finalValue に一致
    expect(r.yearly[14].total).toBe(r.finalValue);
  });

  it("評価額は単調増加する（積立を続ける限り減らない）", () => {
    const r = accumulate({ monthlyContribution: 20_000, annualRatePercent: 5, years: 25 });
    for (let i = 1; i < r.yearly.length; i++) {
      expect(r.yearly[i].total).toBeGreaterThan(r.yearly[i - 1].total);
    }
  });

  it("積立期間0なら全て0", () => {
    const r = accumulate({ monthlyContribution: 30_000, annualRatePercent: 5, years: 0 });
    expect(r.finalValue).toBe(0);
    expect(r.totalPrincipal).toBe(0);
    expect(r.yearly).toHaveLength(0);
  });
});
