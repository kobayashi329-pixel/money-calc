import { describe, it, expect } from "vitest";
import { calculateRougo } from "./calculate";
import type { RougoInput } from "./types";

const base: RougoInput = {
  currentAge: 40,
  retireAge: 65,
  untilAge: 95,
  monthlyExpense: 250_000,
  monthlyPension: 150_000,
  currentSavings: 5_000_000,
  retirementAllowance: 10_000_000,
  specialReserve: 5_000_000,
  savingRatePercent: 3,
};

describe("40歳・65歳退職・95歳まで・月支出25万/年金15万・貯蓄500万/退職金1000万/予備費500万/利回り3%", () => {
  const r = calculateRougo(base);

  it("期間: 退職まで25年・老後30年", () => {
    expect(r.yearsUntilRetire).toBe(25);
    expect(r.retirementYears).toBe(30);
  });

  it("毎月の不足10万・退職時に必要な老後資金は4,100万円", () => {
    expect(r.monthlyGap).toBe(100_000);
    // 10万 × 12 × 30年 ＋ 予備費500万 = 3,600万 ＋ 500万
    expect(r.totalNeeded).toBe(41_000_000);
  });

  it("準備見込み（貯蓄を運用＋退職金）と不足額・毎月の必要積立額", () => {
    expect(r.grownSavings).toBe(10_575_098); // 500万を年3%で25年運用
    expect(r.preparedAtRetire).toBe(20_575_098); // ＋退職金1000万
    expect(r.shortfall).toBe(20_424_902);
    expect(r.requiredMonthlySaving).toBe(45_795);
    expect(r.isCovered).toBe(false);
  });
});

describe("不変条件・境界値", () => {
  it("年金が支出以上なら不足なし・必要資金は予備費のみ", () => {
    const r = calculateRougo({ ...base, monthlyPension: 300_000, specialReserve: 0 });
    expect(r.monthlyGap).toBe(0);
    expect(r.totalNeeded).toBe(0);
    expect(r.shortfall).toBe(0);
    expect(r.requiredMonthlySaving).toBe(0);
    expect(r.isCovered).toBe(true);
  });

  it("準備見込みが必要額を上回れば余剰が出て積立は不要", () => {
    const r = calculateRougo({ ...base, retirementAllowance: 50_000_000 });
    expect(r.surplus).toBeGreaterThan(0);
    expect(r.shortfall).toBe(0);
    expect(r.requiredMonthlySaving).toBe(0);
    expect(r.isCovered).toBe(true);
  });

  it("年金収入が多いほど必要な老後資金は減る", () => {
    const low = calculateRougo({ ...base, monthlyPension: 100_000 });
    const high = calculateRougo({ ...base, monthlyPension: 200_000 });
    expect(high.totalNeeded).toBeLessThan(low.totalNeeded);
  });

  it("老後が長い（長寿）ほど必要な老後資金は増える", () => {
    const short = calculateRougo({ ...base, untilAge: 85 });
    const long = calculateRougo({ ...base, untilAge: 100 });
    expect(long.totalNeeded).toBeGreaterThan(short.totalNeeded);
  });

  it("退職までの期間が長いほど、同じ不足でも毎月の必要積立額は小さい", () => {
    const young = calculateRougo({ ...base, currentAge: 30 });
    const old = calculateRougo({ ...base, currentAge: 55 });
    expect(young.requiredMonthlySaving).toBeLessThan(old.requiredMonthlySaving);
  });

  it("利回り0%でも破綻しない（積立額＝不足÷積立月数）", () => {
    const r = calculateRougo({ ...base, savingRatePercent: 0 });
    expect(r.grownSavings).toBe(5_000_000); // 運用なし
    const months = r.yearsUntilRetire * 12;
    expect(r.requiredMonthlySaving).toBe(Math.round(r.shortfall / months));
  });

  it("退職時に必要な額 ＝ 準備見込み ＋ これから積み立てて作る不足分（利回り0時）", () => {
    const r = calculateRougo({ ...base, savingRatePercent: 0 });
    const months = r.yearsUntilRetire * 12;
    const madeBySaving = r.requiredMonthlySaving * months;
    // 端数（毎月の積立額の丸め）以内で一致
    expect(Math.abs(r.preparedAtRetire + madeBySaving - r.totalNeeded)).toBeLessThan(months);
  });
});
