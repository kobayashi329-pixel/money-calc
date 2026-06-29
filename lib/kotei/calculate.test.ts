import { describe, it, expect } from "vitest";
import { calculateKotei } from "./calculate";

describe("固定資産税・都市計画税", () => {
  it("住宅用地(150㎡・全て小規模)＋建物・市街化区域", () => {
    const r = calculateKotei({
      landValue: 12_000_000,
      landAreaSqm: 150,
      buildingValue: 8_000_000,
      isResidential: true,
      cityPlanningArea: true,
      newBuildingReduction: false,
    });
    // 土地: 1200万/6=200万 ×1.4% = 28,000
    expect(r.landFixedTax).toBe(28_000);
    // 建物: 800万 ×1.4% = 112,000
    expect(r.buildingFixedTax).toBe(112_000);
    // 都計 土地: 1200万/3=400万 ×0.3% = 12,000
    expect(r.landCityTax).toBe(12_000);
    // 都計 建物: 800万 ×0.3% = 24,000
    expect(r.buildingCityTax).toBe(24_000);
    expect(r.fixedTaxTotal).toBe(140_000);
    expect(r.cityTaxTotal).toBe(36_000);
    expect(r.total).toBe(176_000);
  });

  it("新築住宅の軽減で建物の固定資産税が1/2になる", () => {
    const r = calculateKotei({
      landValue: 12_000_000,
      landAreaSqm: 150,
      buildingValue: 8_000_000,
      isResidential: true,
      cityPlanningArea: true,
      newBuildingReduction: true,
    });
    expect(r.buildingFixedTax).toBe(56_000); // 112,000 / 2
  });

  it("住宅用地300㎡(200小規模＋100一般)の按分", () => {
    const r = calculateKotei({
      landValue: 30_000_000,
      landAreaSqm: 300,
      buildingValue: 0,
      isResidential: true,
      cityPlanningArea: false,
      newBuildingReduction: false,
    });
    // 小規模2000万/6 + 一般1000万/3 = 666.67万 ×1.4% = 93,333 → 93,300
    expect(r.landFixedTax).toBe(93_300);
    expect(r.cityTaxTotal).toBe(0); // 市街化区域でない
  });

  it("非住宅用地は評価額がそのまま課税標準", () => {
    const r = calculateKotei({
      landValue: 20_000_000,
      landAreaSqm: 200,
      buildingValue: 0,
      isResidential: false,
      cityPlanningArea: false,
      newBuildingReduction: false,
    });
    expect(r.landFixedTax).toBe(280_000); // 2000万 ×1.4%
  });

  it("市街化区域でなければ都市計画税は0", () => {
    const r = calculateKotei({
      landValue: 12_000_000,
      landAreaSqm: 150,
      buildingValue: 8_000_000,
      isResidential: true,
      cityPlanningArea: false,
      newBuildingReduction: false,
    });
    expect(r.cityTaxTotal).toBe(0);
  });
});
