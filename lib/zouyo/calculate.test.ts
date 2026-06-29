import { describe, it, expect } from "vitest";
import { calculateZouyo } from "./calculate";

describe("贈与税 計算（暦年課税）", () => {
  it("110万円以下は非課税", () => {
    expect(calculateZouyo({ amount: 1_100_000, rateType: "special" }).tax).toBe(0);
    expect(calculateZouyo({ amount: 500_000, rateType: "general" }).tax).toBe(0);
  });

  it("特例税率：500万円の贈与税は48.5万円", () => {
    // (500万−110万)=390万 ×15%−10万 = 48.5万
    const r = calculateZouyo({ amount: 5_000_000, rateType: "special" });
    expect(r.tax).toBe(485_000);
    expect(r.taxableBase).toBe(3_900_000);
  });

  it("一般税率：500万円の贈与税は53万円", () => {
    // (390万)×20%−25万 = 53万
    const r = calculateZouyo({ amount: 5_000_000, rateType: "general" });
    expect(r.tax).toBe(530_000);
  });

  it("特例税率：1,000万円は177万円", () => {
    // (890万)×30%−90万 = 177万
    expect(calculateZouyo({ amount: 10_000_000, rateType: "special" }).tax).toBe(1_770_000);
  });

  it("一般税率は特例税率以上になる（高額帯）", () => {
    const sp = calculateZouyo({ amount: 10_000_000, rateType: "special" }).tax;
    const ge = calculateZouyo({ amount: 10_000_000, rateType: "general" }).tax;
    expect(ge).toBeGreaterThanOrEqual(sp);
  });

  it("税引後＝贈与額−贈与税", () => {
    const r = calculateZouyo({ amount: 5_000_000, rateType: "special" });
    expect(r.afterTax).toBe(r.amount - r.tax);
  });
});
