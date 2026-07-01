import { describe, it, expect } from "vitest";
import { calculateJuloanKojo } from "./calculate";

describe("住宅ローン控除 計算（2024・2025年入居）", () => {
  it("新築・長期優良・一般：限度4,500万、残高3,000万→年21万円", () => {
    const r = calculateJuloanKojo({
      balance: 30_000_000,
      newBuild: true,
      performance: "choki",
      kosodate: false,
    });
    expect(r.limit).toBe(45_000_000);
    expect(r.target).toBe(30_000_000);
    expect(r.annual).toBe(210_000); // 3000万×0.7%
    expect(r.years).toBe(13);
  });

  it("残高が限度額を超えると限度額で頭打ち（子育て・長期優良5,000万）", () => {
    const r = calculateJuloanKojo({
      balance: 60_000_000,
      newBuild: true,
      performance: "choki",
      kosodate: true,
    });
    expect(r.limit).toBe(50_000_000);
    expect(r.target).toBe(50_000_000);
    expect(r.annual).toBe(350_000); // 5000万×0.7%
  });

  it("子育て世帯はZEH・省エネで上乗せ", () => {
    expect(
      calculateJuloanKojo({ balance: 99_000_000, newBuild: true, performance: "zeh", kosodate: true }).limit,
    ).toBe(45_000_000);
    expect(
      calculateJuloanKojo({ balance: 99_000_000, newBuild: true, performance: "shoene", kosodate: false }).limit,
    ).toBe(30_000_000);
  });

  it("新築・非省エネは対象外（限度0）", () => {
    const r = calculateJuloanKojo({ balance: 30_000_000, newBuild: true, performance: "other", kosodate: false });
    expect(r.limit).toBe(0);
    expect(r.annual).toBe(0);
    expect(r.ineligible).toBe(true);
  });

  it("中古は10年・限度3,000万（性能あり）/2,000万（その他）", () => {
    const r1 = calculateJuloanKojo({ balance: 40_000_000, newBuild: false, performance: "shoene", kosodate: false });
    expect(r1.limit).toBe(30_000_000);
    expect(r1.years).toBe(10);
    const r2 = calculateJuloanKojo({ balance: 40_000_000, newBuild: false, performance: "other", kosodate: false });
    expect(r2.limit).toBe(20_000_000);
  });
});
