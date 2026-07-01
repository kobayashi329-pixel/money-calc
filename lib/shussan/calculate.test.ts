import { describe, it, expect } from "vitest";
import { calculateShussan } from "./calculate";

describe("出産手当金 計算", () => {
  it("月給30万：標準報酬日額10,000円・1日6,667円・98日で約65万円", () => {
    const r = calculateShussan({ standardMonthly: 300_000, multiple: false });
    expect(r.standardDaily).toBe(10_000);
    expect(r.benefitDaily).toBe(6_667);
    expect(r.days).toBe(98);
    expect(r.total).toBe(653_366);
  });

  it("月給20万：1日4,447円", () => {
    const r = calculateShussan({ standardMonthly: 200_000, multiple: false });
    expect(r.standardDaily).toBe(6_670); // 200000/30=6666.7→6670
    expect(r.benefitDaily).toBe(4_447);
  });

  it("多胎は154日", () => {
    const r = calculateShussan({ standardMonthly: 300_000, multiple: true });
    expect(r.days).toBe(154);
    expect(r.total).toBe(6_667 * 154);
  });

  it("支給日数を指定できる（予定日とのズレ）", () => {
    const r = calculateShussan({ standardMonthly: 300_000, multiple: false, days: 105 });
    expect(r.days).toBe(105);
    expect(r.total).toBe(6_667 * 105);
  });
});
