import { describe, it, expect } from "vitest";
import { calculateNenkin, startAgeFactor } from "./calculate";
import type { NenkinInput } from "./types";

const kaishain: NenkinInput = {
  kisoYears: 40,
  kouseiYears: 40,
  avgAnnualIncome: 5_000_000,
  startAge: 65,
};

describe("繰上げ・繰下げの増減率", () => {
  it("60歳繰上げは−24%、65歳は±0、70歳は+42%、75歳は+84%", () => {
    expect(startAgeFactor(60)).toBeCloseTo(0.76, 5);
    expect(startAgeFactor(65)).toBe(1);
    expect(startAgeFactor(70)).toBeCloseTo(1.42, 5);
    expect(startAgeFactor(75)).toBeCloseTo(1.84, 5);
  });
});

describe("老齢基礎年金（令和7年度・満額831,696円）", () => {
  it("自営業（厚生年金なし）40年納付は満額＝月69,308円", () => {
    const r = calculateNenkin({ kisoYears: 40, kouseiYears: 0, avgAnnualIncome: 0, startAge: 65 });
    expect(r.basicAnnual).toBe(831_696);
    expect(r.koseiAnnual).toBe(0);
    expect(r.totalMonthly).toBe(69_308);
  });

  it("納付30年なら満額の30/40", () => {
    const r = calculateNenkin({ kisoYears: 30, kouseiYears: 0, avgAnnualIncome: 0, startAge: 65 });
    expect(r.basicAnnual).toBe(Math.round((831_696 * 30) / 40));
  });
});

describe("会社員（基礎＋厚生）の合計", () => {
  it("平均年収500万・厚生40年・基礎40年・65歳 → 年約193万・月約16万", () => {
    const r = calculateNenkin(kaishain);
    expect(r.koseiAnnualAt65).toBe(1_096_200); // 500万 × 5.481/1000 × 40
    expect(r.totalAnnualAt65).toBe(1_927_896);
    expect(r.totalMonthly).toBe(160_658);
  });

  it("平均年収が高いほど厚生年金が増える", () => {
    const low = calculateNenkin({ ...kaishain, avgAnnualIncome: 4_000_000 });
    const high = calculateNenkin({ ...kaishain, avgAnnualIncome: 8_000_000 });
    expect(high.koseiAnnual).toBeGreaterThan(low.koseiAnnual);
  });
});

describe("繰上げ・繰下げを反映した受給額", () => {
  it("70歳繰下げは65歳基準の1.42倍", () => {
    const at65 = calculateNenkin(kaishain);
    const at70 = calculateNenkin({ ...kaishain, startAge: 70 });
    expect(at70.totalAnnual).toBe(Math.round(at65.totalAnnualAt65 * 1.42));
    expect(at70.totalAnnual).toBeGreaterThan(at65.totalAnnual);
  });

  it("60歳繰上げは65歳基準より少ない", () => {
    const at65 = calculateNenkin(kaishain);
    const at60 = calculateNenkin({ ...kaishain, startAge: 60 });
    expect(at60.totalAnnual).toBeLessThan(at65.totalAnnual);
  });

  it("基礎・厚生とも同じ率で増減する", () => {
    const r = calculateNenkin({ ...kaishain, startAge: 70 });
    expect(r.basicAnnual).toBe(Math.round(r.basicAnnualAt65 * 1.42));
    expect(r.koseiAnnual).toBe(Math.round(r.koseiAnnualAt65 * 1.42));
  });
});

describe("不変条件・境界", () => {
  it("合計＝基礎＋厚生、月額＝年額÷12", () => {
    const r = calculateNenkin(kaishain);
    expect(r.totalAnnual).toBe(r.basicAnnual + r.koseiAnnual);
    expect(r.totalMonthly).toBe(Math.round(r.totalAnnual / 12));
  });

  it("納付年数は40年で頭打ち（41年でも満額）", () => {
    const r = calculateNenkin({ kisoYears: 41, kouseiYears: 0, avgAnnualIncome: 0, startAge: 65 });
    expect(r.basicAnnual).toBe(831_696);
  });
});
