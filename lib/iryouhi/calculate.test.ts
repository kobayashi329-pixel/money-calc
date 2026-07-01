import { describe, it, expect } from "vitest";
import { calculateIryouhi } from "./calculate";

describe("医療費控除 計算", () => {
  it("医療費30万・補填0・課税所得500万：控除20万・軽減6万円", () => {
    const r = calculateIryouhi({ medicalCost: 300_000, compensation: 0, taxableIncome: 5_000_000 });
    expect(r.threshold).toBe(100_000);
    expect(r.deduction).toBe(200_000); // 30万−10万
    expect(r.incomeRate).toBe(0.2);
    expect(r.totalRate).toBeCloseTo(0.3, 5);
    expect(r.refund).toBe(60_000); // 20万×30%
  });

  it("保険金で補填された分は差し引く", () => {
    const r = calculateIryouhi({ medicalCost: 300_000, compensation: 100_000, taxableIncome: 5_000_000 });
    expect(r.deduction).toBe(100_000); // 30万−10万補填−10万足切り
  });

  it("10万円以下は控除0", () => {
    expect(calculateIryouhi({ medicalCost: 80_000, compensation: 0, taxableIncome: 5_000_000 }).deduction).toBe(0);
  });

  it("控除の上限は200万円", () => {
    const r = calculateIryouhi({ medicalCost: 3_000_000, compensation: 0, taxableIncome: 5_000_000 });
    expect(r.deduction).toBe(2_000_000);
  });

  it("課税所得が低いと足切りは5%（課税所得100万→5万）", () => {
    const r = calculateIryouhi({ medicalCost: 200_000, compensation: 0, taxableIncome: 1_000_000 });
    expect(r.threshold).toBe(50_000); // 100万×5%
    expect(r.deduction).toBe(150_000); // 20万−5万
    expect(r.incomeRate).toBe(0.05);
    expect(r.refund).toBe(Math.round(150_000 * 0.15)); // 5%+10%
  });

  it("税率が高いほど軽減額が大きい", () => {
    const low = calculateIryouhi({ medicalCost: 300_000, compensation: 0, taxableIncome: 3_000_000 }).refund;
    const high = calculateIryouhi({ medicalCost: 300_000, compensation: 0, taxableIncome: 10_000_000 }).refund;
    expect(high).toBeGreaterThan(low);
  });
});
