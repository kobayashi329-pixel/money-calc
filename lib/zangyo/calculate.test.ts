import { describe, it, expect } from "vitest";
import { calculateZangyo } from "./calculate";

describe("残業代（割増賃金）計算", () => {
  it("基礎賃金30万・所定160時間→時給1,875円", () => {
    const r = calculateZangyo({
      baseWage: 300_000,
      monthlyHours: 160,
      overtimeHours: 0,
      nightHours: 0,
      holidayHours: 0,
    });
    expect(r.hourlyWage).toBe(1_875);
  });

  it("時間外20時間（25%増）", () => {
    const r = calculateZangyo({
      baseWage: 300_000,
      monthlyHours: 160,
      overtimeHours: 20,
      nightHours: 0,
      holidayHours: 0,
    });
    // 20 × 1,875 × 1.25 = 46,875
    expect(r.payOvertime).toBe(46_875);
    expect(r.total).toBe(46_875);
  });

  it("月60時間超は50%増（70時間→60h分25%＋10h分50%）", () => {
    const r = calculateZangyo({
      baseWage: 300_000,
      monthlyHours: 160,
      overtimeHours: 70,
      nightHours: 0,
      holidayHours: 0,
    });
    expect(r.payOvertime).toBe(Math.round(60 * 1875 * 1.25)); // 140,625
    expect(r.payOvertimeOver60).toBe(Math.round(10 * 1875 * 1.5)); // 28,125
  });

  it("深夜は25%加算（時間外と重複）", () => {
    const r = calculateZangyo({
      baseWage: 300_000,
      monthlyHours: 160,
      overtimeHours: 10,
      nightHours: 10,
      holidayHours: 0,
    });
    // 時間外 10×1875×1.25=23,437.5→23,438、深夜加算 10×1875×0.25=4,687.5→4,688
    expect(r.payOvertime).toBe(23_438);
    expect(r.payNight).toBe(4_688);
  });

  it("法定休日は35%増", () => {
    const r = calculateZangyo({
      baseWage: 300_000,
      monthlyHours: 160,
      overtimeHours: 0,
      nightHours: 0,
      holidayHours: 8,
    });
    expect(r.payHoliday).toBe(Math.round(8 * 1875 * 1.35)); // 20,250
  });
});
