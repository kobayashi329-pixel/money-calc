import { describe, it, expect } from "vitest";
import { calculateShohizei } from "./calculate";

describe("税抜 → 税込（addTax）", () => {
  it("税抜10,000円・10% → 消費税1,000円・税込11,000円", () => {
    const r = calculateShohizei({ amount: 10_000, ratePercent: 10, direction: "addTax", rounding: "floor" });
    expect(r.net).toBe(10_000);
    expect(r.tax).toBe(1_000);
    expect(r.gross).toBe(11_000);
  });

  it("税抜1,480円・8%（軽減）→ 端数の処理で消費税が変わる", () => {
    // 1480 × 0.08 = 118.4
    const floor = calculateShohizei({ amount: 1_480, ratePercent: 8, direction: "addTax", rounding: "floor" });
    const round = calculateShohizei({ amount: 1_480, ratePercent: 8, direction: "addTax", rounding: "round" });
    const ceil = calculateShohizei({ amount: 1_480, ratePercent: 8, direction: "addTax", rounding: "ceil" });
    expect(floor.tax).toBe(118);
    expect(round.tax).toBe(118);
    expect(ceil.tax).toBe(119);
    expect(floor.gross).toBe(1_598);
    expect(ceil.gross).toBe(1_599);
  });
});

describe("税込 → 税抜（removeTax）", () => {
  it("税込11,000円・10% → 税抜10,000円・消費税1,000円", () => {
    const r = calculateShohizei({ amount: 11_000, ratePercent: 10, direction: "removeTax", rounding: "floor" });
    expect(r.net).toBe(10_000);
    expect(r.tax).toBe(1_000);
    expect(r.gross).toBe(11_000);
  });

  it("税込1,000円・10% → 税抜は端数処理で909〜910円", () => {
    // 1000 / 1.1 = 909.09...
    const floor = calculateShohizei({ amount: 1_000, ratePercent: 10, direction: "removeTax", rounding: "floor" });
    const ceil = calculateShohizei({ amount: 1_000, ratePercent: 10, direction: "removeTax", rounding: "ceil" });
    expect(floor.net).toBe(909);
    expect(floor.tax).toBe(91);
    expect(ceil.net).toBe(910);
    expect(ceil.tax).toBe(90);
  });
});

describe("不変条件", () => {
  it("税抜 ＋ 消費税 ＝ 税込（常に成立）", () => {
    for (const dir of ["addTax", "removeTax"] as const) {
      for (const mode of ["floor", "round", "ceil"] as const) {
        const r = calculateShohizei({ amount: 12_345, ratePercent: 10, direction: dir, rounding: mode });
        expect(r.net + r.tax).toBe(r.gross);
      }
    }
  });

  it("軽減税率8%は標準税率10%より消費税が少ない", () => {
    const r8 = calculateShohizei({ amount: 50_000, ratePercent: 8, direction: "addTax", rounding: "floor" });
    const r10 = calculateShohizei({ amount: 50_000, ratePercent: 10, direction: "addTax", rounding: "floor" });
    expect(r8.tax).toBeLessThan(r10.tax);
  });
});
