import { describe, it, expect } from "vitest";
import { calculateShaho } from "./calculate";

describe("社会保険料 計算", () => {
  it("年収500万・30歳は社会保険料が年収の約14〜16%", () => {
    const r = calculateShaho({ annualIncome: 5_000_000, age: 30 });
    expect(r.rate).toBeGreaterThan(0.13);
    expect(r.rate).toBeLessThan(0.17);
    expect(r.hasLongTermCare).toBe(false); // 30歳は介護保険なし
  });

  it("40〜64歳は介護保険料が加わる", () => {
    const young = calculateShaho({ annualIncome: 5_000_000, age: 30 });
    const middle = calculateShaho({ annualIncome: 5_000_000, age: 45 });
    expect(middle.hasLongTermCare).toBe(true);
    expect(middle.longTermCare).toBeGreaterThan(0);
    expect(middle.total).toBeGreaterThan(young.total);
  });

  it("内訳の合計が total に一致する", () => {
    const r = calculateShaho({ annualIncome: 6_000_000, age: 45 });
    expect(r.health + r.longTermCare + r.pension + r.employment).toBe(r.total);
  });

  it("月額は年額のおよそ1/12", () => {
    const r = calculateShaho({ annualIncome: 5_000_000, age: 30 });
    expect(r.monthly).toBe(Math.round(r.total / 12));
  });
});
