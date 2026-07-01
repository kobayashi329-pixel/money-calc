import { describe, it, expect } from "vitest";
import { calculateShotoku } from "./calculate";

describe("所得税 計算（速算表）", () => {
  it("課税所得500万：所得税572,500円・税率20%", () => {
    const r = calculateShotoku(5_000_000);
    // 500万×20%−42.75万 = 57.25万
    expect(r.rate).toBe(0.2);
    expect(r.incomeTax).toBe(572_500);
    // 復興特別所得税 572,500×2.1%=12,022→12,000（100円未満切捨て）
    expect(r.reconstruction).toBe(12_000);
    expect(r.total).toBe(584_500);
  });

  it("課税所得195万以下は5%", () => {
    expect(calculateShotoku(1_000_000).incomeTax).toBe(50_000);
    expect(calculateShotoku(1_000_000).rate).toBe(0.05);
  });

  it("課税所得330万：10%帯", () => {
    // 330万×10%−9.75万 = 23.25万
    expect(calculateShotoku(3_300_000).incomeTax).toBe(232_500);
  });

  it("課税所得2000万：40%帯", () => {
    // 2000万×40%−279.6万 = 520.4万
    expect(calculateShotoku(20_000_000).incomeTax).toBe(5_204_000);
    expect(calculateShotoku(20_000_000).rate).toBe(0.4);
  });

  it("課税所得は1000円未満切り捨て", () => {
    expect(calculateShotoku(1_000_900).taxable).toBe(1_000_000);
  });

  it("課税所得0は税額0", () => {
    expect(calculateShotoku(0).total).toBe(0);
  });
});
