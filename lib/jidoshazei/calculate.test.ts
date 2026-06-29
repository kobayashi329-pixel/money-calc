import { describe, it, expect } from "vitest";
import { calculateJidoshazei, KEI_STANDARD, KEI_HEAVY } from "./calculate";

describe("自動車税（種別割）— 普通自動車", () => {
  it("1,500cc超〜2,000cc以下・新税率は36,000円", () => {
    const r = calculateJidoshazei({ carType: "normal", displacementCc: 1800, era: "new", heavyTax: false });
    expect(r.annualTax).toBe(36_000);
    expect(r.bandLabel).toBe("1,500cc超〜2,000cc以下");
  });
  it("1,500cc超〜2,000cc以下・旧税率は39,500円", () => {
    const r = calculateJidoshazei({ carType: "normal", displacementCc: 1800, era: "old", heavyTax: false });
    expect(r.annualTax).toBe(39_500);
  });
  it("1,000cc以下・新税率は25,000円", () => {
    const r = calculateJidoshazei({ carType: "normal", displacementCc: 660, era: "new", heavyTax: false });
    expect(r.annualTax).toBe(25_000);
  });
  it("6,000cc超は110,000円（新税率）", () => {
    const r = calculateJidoshazei({ carType: "normal", displacementCc: 6500, era: "new", heavyTax: false });
    expect(r.annualTax).toBe(110_000);
  });
  it("経年重課（13年超）は旧税率の約15%増", () => {
    // 1,500超2,000以下 旧39,500 × 1.15 = 45,425 → 45,400
    const r = calculateJidoshazei({ carType: "normal", displacementCc: 1800, era: "old", heavyTax: true });
    expect(r.annualTax).toBe(45_400);
    expect(r.heavyTaxApplied).toBe(true);
  });
  it("境界値: 2,000ccちょうどは2,000cc以下の区分", () => {
    const r = calculateJidoshazei({ carType: "normal", displacementCc: 2000, era: "new", heavyTax: false });
    expect(r.annualTax).toBe(36_000);
  });
  it("境界値: 2,001ccは次の区分（43,500円）", () => {
    const r = calculateJidoshazei({ carType: "normal", displacementCc: 2001, era: "new", heavyTax: false });
    expect(r.annualTax).toBe(43_500);
  });
});

describe("自動車税（種別割）— 軽自動車", () => {
  it("標準は10,800円", () => {
    const r = calculateJidoshazei({ carType: "kei", displacementCc: 0, era: "new", heavyTax: false });
    expect(r.annualTax).toBe(KEI_STANDARD);
  });
  it("13年超の重課は12,900円", () => {
    const r = calculateJidoshazei({ carType: "kei", displacementCc: 0, era: "new", heavyTax: true });
    expect(r.annualTax).toBe(KEI_HEAVY);
  });
});
