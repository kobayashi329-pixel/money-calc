import { describe, it, expect } from "vitest";
import { calculateIkukyu, CAP_67, CAP_50 } from "./calculate";

describe("育児休業給付金 計算", () => {
  it("月給30万：67%＝20.1万円／50%＝15万円", () => {
    const r = calculateIkukyu({ monthlyWage: 300_000, months: 12 });
    expect(r.monthly67).toBe(201_000); // 30万×0.67
    expect(r.monthly50).toBe(150_000); // 30万×0.50
  });

  it("最初の6か月は67%、以降は50%", () => {
    const r = calculateIkukyu({ monthlyWage: 300_000, months: 12 });
    expect(r.months67).toBe(6);
    expect(r.months50).toBe(6);
    // 総額＝201,000×6 + 150,000×6
    expect(r.total).toBe(201_000 * 6 + 150_000 * 6);
  });

  it("6か月以内なら全期間67%", () => {
    const r = calculateIkukyu({ monthlyWage: 300_000, months: 4 });
    expect(r.months67).toBe(4);
    expect(r.months50).toBe(0);
    expect(r.total).toBe(201_000 * 4);
  });

  it("高所得は支給上限で頭打ち（67%＝323,811／50%＝241,650）", () => {
    const r = calculateIkukyu({ monthlyWage: 600_000, months: 12 });
    expect(r.monthly67).toBe(CAP_67);
    expect(r.monthly50).toBe(CAP_50);
    expect(r.capped).toBe(true);
  });

  it("上限未満ならcappedはfalse", () => {
    expect(calculateIkukyu({ monthlyWage: 300_000, months: 12 }).capped).toBe(false);
  });
});
