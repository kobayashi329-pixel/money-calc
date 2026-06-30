import { describe, it, expect } from "vitest";
import {
  calculateShitsugyo,
  BENEFIT_DAILY_MIN,
} from "./calculate";

describe("失業保険（基本手当）計算", () => {
  it("低賃金帯は給付率80%（月給15万＝賃金日額5,000円）", () => {
    const r = calculateShitsugyo({
      age: 35,
      monthlyWage: 150_000,
      insuredYears: 8,
      reason: "self",
    });
    expect(r.wageDaily).toBe(5_000);
    expect(r.rate).toBeCloseTo(0.8, 5);
    expect(r.benefitDaily).toBe(4_000); // 5,000×0.8
  });

  it("基本手当日額には下限がある", () => {
    const r = calculateShitsugyo({
      age: 40,
      monthlyWage: 50_000,
      insuredYears: 3,
      reason: "self",
    });
    expect(r.benefitDaily).toBe(BENEFIT_DAILY_MIN);
  });

  it("高賃金帯は年齢別の上限で頭打ち（30-44歳は8,055円）", () => {
    const r = calculateShitsugyo({
      age: 40,
      monthlyWage: 800_000,
      insuredYears: 15,
      reason: "self",
    });
    expect(r.benefitDaily).toBe(8_055);
  });

  it("自己都合：被保険者期間で給付日数（10年未満90日／10-20年120日／20年以上150日）", () => {
    const base = { age: 40, monthlyWage: 300_000, reason: "self" as const };
    expect(calculateShitsugyo({ ...base, insuredYears: 8 }).days).toBe(90);
    expect(calculateShitsugyo({ ...base, insuredYears: 12 }).days).toBe(120);
    expect(calculateShitsugyo({ ...base, insuredYears: 25 }).days).toBe(150);
    // 給付制限2か月
    expect(calculateShitsugyo({ ...base, insuredYears: 8 }).restrictionMonths).toBe(2);
  });

  it("自己都合で被保険者期間1年未満は受給日数0", () => {
    expect(
      calculateShitsugyo({ age: 30, monthlyWage: 250_000, insuredYears: 0.5, reason: "self" }).days,
    ).toBe(0);
  });

  it("会社都合：45-59歳・20年以上は330日（最大）", () => {
    const r = calculateShitsugyo({
      age: 50,
      monthlyWage: 400_000,
      insuredYears: 22,
      reason: "company",
    });
    expect(r.days).toBe(330);
    expect(r.restrictionMonths).toBe(0);
  });

  it("会社都合：30歳未満・1年未満は90日", () => {
    expect(
      calculateShitsugyo({ age: 25, monthlyWage: 200_000, insuredYears: 0.5, reason: "company" }).days,
    ).toBe(90);
  });

  it("総額＝基本手当日額×給付日数", () => {
    const r = calculateShitsugyo({
      age: 35,
      monthlyWage: 150_000,
      insuredYears: 8,
      reason: "self",
    });
    expect(r.total).toBe(r.benefitDaily * r.days);
  });
});
