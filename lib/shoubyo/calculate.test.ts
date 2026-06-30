import { describe, it, expect } from "vitest";
import { calculateShoubyo } from "./calculate";

describe("傷病手当金 計算", () => {
  it("標準報酬月額30万：標準報酬日額10,000円・1日6,667円", () => {
    const r = calculateShoubyo({ standardMonthly: 300_000, daysOff: 30 });
    expect(r.standardDaily).toBe(10_000); // 300,000/30
    expect(r.benefitDaily).toBe(6_667); // 10,000×2/3 四捨五入
  });

  it("待期3日を除いた日数が支給対象", () => {
    const r = calculateShoubyo({ standardMonthly: 300_000, daysOff: 30 });
    expect(r.paidDays).toBe(27); // 30−3
    expect(r.total).toBe(6_667 * 27);
  });

  it("休みが3日以下なら支給対象0", () => {
    expect(calculateShoubyo({ standardMonthly: 300_000, daysOff: 3 }).paidDays).toBe(0);
    expect(calculateShoubyo({ standardMonthly: 300_000, daysOff: 2 }).total).toBe(0);
  });

  it("標準報酬日額は10円単位に四捨五入（月給26万→8,670円）", () => {
    // 260,000/30 = 8,666.7 → 8,670
    const r = calculateShoubyo({ standardMonthly: 260_000, daysOff: 10 });
    expect(r.standardDaily).toBe(8_670);
    expect(r.benefitDaily).toBe(5_780); // 8,670×2/3=5,780
  });

  it("通算1年6か月（546日）を超えて支給されない", () => {
    const r = calculateShoubyo({ standardMonthly: 300_000, daysOff: 600 });
    expect(r.paidDays).toBe(546);
  });
});
