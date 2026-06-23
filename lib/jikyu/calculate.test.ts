import { describe, it, expect } from "vitest";
import { calculateJikyu } from "./calculate";

const cond = { hoursPerDay: 8, daysPerMonth: 20 };

describe("基本の換算（1日8時間・月20日＝月160時間）", () => {
  it("時給1,500円 → 日給12,000・月給240,000・年収2,880,000", () => {
    const r = calculateJikyu({ value: 1_500, unit: "hourly", ...cond });
    expect(r.daily).toBe(12_000);
    expect(r.monthly).toBe(240_000);
    expect(r.annual).toBe(2_880_000);
  });

  it("年収3,000,000円 → 月給250,000・日給12,500・時給1,563", () => {
    const r = calculateJikyu({ value: 3_000_000, unit: "annual", ...cond });
    expect(r.monthly).toBe(250_000);
    expect(r.daily).toBe(12_500);
    expect(r.hourly).toBe(1_563); // 12,500 / 8 = 1562.5 → 四捨五入
  });

  it("月給300,000円 → 年収3,600,000・時給1,875", () => {
    const r = calculateJikyu({ value: 300_000, unit: "monthly", ...cond });
    expect(r.annual).toBe(3_600_000);
    expect(r.hourly).toBe(1_875); // 300,000 / 160h
  });

  it("日給10,000円 → 月給200,000・年収2,400,000", () => {
    const r = calculateJikyu({ value: 10_000, unit: "daily", ...cond });
    expect(r.monthly).toBe(200_000);
    expect(r.annual).toBe(2_400_000);
  });
});

describe("労働時間・日数の影響と不変条件", () => {
  it("労働日数が増えると同じ時給でも年収は増える", () => {
    const d20 = calculateJikyu({ value: 1_500, unit: "hourly", hoursPerDay: 8, daysPerMonth: 20 });
    const d22 = calculateJikyu({ value: 1_500, unit: "hourly", hoursPerDay: 8, daysPerMonth: 22 });
    expect(d22.annual).toBeGreaterThan(d20.annual);
  });

  it("どの単位から入力しても相互に整合する（往復で一致）", () => {
    const fromHourly = calculateJikyu({ value: 2_000, unit: "hourly", ...cond });
    const fromAnnual = calculateJikyu({ value: fromHourly.annual, unit: "annual", ...cond });
    expect(fromAnnual.hourly).toBe(2_000);
    expect(fromAnnual.monthly).toBe(fromHourly.monthly);
  });

  it("労働時間0や日数0でも破綻しない（最低1で計算）", () => {
    const r = calculateJikyu({ value: 1_000, unit: "hourly", hoursPerDay: 0, daysPerMonth: 0 });
    expect(Number.isFinite(r.annual)).toBe(true);
    expect(r.annual).toBe(1_000 * 1 * 1 * 12);
  });
});
