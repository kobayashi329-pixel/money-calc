import { describe, it, expect } from "vitest";
import { calculateNisa } from "./calculate";

describe("NISA積立シミュレータ", () => {
  it("非課税メリット＝運用益×20.315%、課税口座評価額＝最終評価額−税", () => {
    const r = calculateNisa({ monthlyContribution: 30_000, annualRatePercent: 5, years: 20 });
    expect(r.taxSaved).toBe(Math.round(r.totalGain * 0.20315));
    expect(r.taxableFinalValue).toBe(r.finalValue - r.taxSaved);
    // 運用益がプラスなら非課税メリットもプラス
    expect(r.taxSaved).toBeGreaterThan(0);
  });

  it("利回り0%なら運用益0・非課税メリットも0", () => {
    const r = calculateNisa({ monthlyContribution: 30_000, annualRatePercent: 0, years: 10 });
    expect(r.totalGain).toBe(0);
    expect(r.taxSaved).toBe(0);
    expect(r.taxableFinalValue).toBe(r.finalValue);
  });

  it("年間積立額の枠判定（つみたて120万・合計360万）", () => {
    // 毎月10万 → 年120万（つみたて枠ちょうど・超過しない）
    const a = calculateNisa({ monthlyContribution: 100_000, annualRatePercent: 5, years: 10 });
    expect(a.annualContribution).toBe(1_200_000);
    expect(a.exceedsAnnualTsumitate).toBe(false);
    // 毎月10.1万 → つみたて枠超
    const b = calculateNisa({ monthlyContribution: 101_000, annualRatePercent: 5, years: 10 });
    expect(b.exceedsAnnualTsumitate).toBe(true);
    expect(b.exceedsAnnualTotal).toBe(false);
    // 毎月31万 → 年372万（合計枠360万超）
    const c = calculateNisa({ monthlyContribution: 310_000, annualRatePercent: 5, years: 10 });
    expect(c.exceedsAnnualTotal).toBe(true);
  });

  it("生涯非課税限度額1,800万円（元本ベース）の超過判定", () => {
    // 毎月10万 × 15年 = 1,800万ちょうど → 超過しない
    const ok = calculateNisa({ monthlyContribution: 100_000, annualRatePercent: 3, years: 15 });
    expect(ok.totalPrincipal).toBe(18_000_000);
    expect(ok.exceedsLifetime).toBe(false);
    // 毎月10万 × 16年 = 1,920万 → 超過
    const over = calculateNisa({ monthlyContribution: 100_000, annualRatePercent: 3, years: 16 });
    expect(over.exceedsLifetime).toBe(true);
  });

  it("最終評価額＝元本＋運用益（取りこぼしなし）", () => {
    const r = calculateNisa({ monthlyContribution: 50_000, annualRatePercent: 6, years: 25 });
    expect(r.finalValue).toBe(r.totalPrincipal + r.totalGain);
  });
});
