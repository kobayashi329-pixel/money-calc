// =============================================================
//  固定資産税・都市計画税 計算ロジック（純粋関数）
//  土地・建物の固定資産税評価額から、年税額の目安を求める。
//
//  固定資産税 ＝ 課税標準額 × 1.4%（標準税率）
//  都市計画税 ＝ 課税標準額 × 0.3%（上限。市街化区域のみ）
//
//  住宅用地の特例（土地）:
//    小規模住宅用地（200㎡以下の部分）… 固定資産税 評価額×1/6・都市計画税 評価額×1/3
//    一般住宅用地（200㎡超の部分）   … 固定資産税 評価額×1/3・都市計画税 評価額×2/3
//  新築住宅の軽減（建物）: 一定期間、固定資産税が1/2に軽減される（床面積等の要件あり）。
//
//  ※ 本ツールは概算。負担調整措置・各自治体の制限税率・各種減額は考慮しない。
//  出典:
//    総務省 地方税制度（固定資産税・都市計画税）
//    国税庁/各市区町村の固定資産税のしくみ
// =============================================================

export const FIXED_TAX_RATE = 0.014; // 固定資産税 標準税率 1.4%
export const CITY_PLANNING_TAX_RATE = 0.003; // 都市計画税 上限 0.3%
export const SMALL_LAND_LIMIT_SQM = 200; // 小規模住宅用地の上限面積

export interface KoteiInput {
  /** 土地の固定資産税評価額（円） */
  landValue: number;
  /** 土地の面積（㎡）。小規模/一般住宅用地の按分に使用。 */
  landAreaSqm: number;
  /** 建物の固定資産税評価額（円） */
  buildingValue: number;
  /** 住宅用地か（住宅が建っている土地か）。住宅用地の特例を適用。 */
  isResidential: boolean;
  /** 市街化区域（都市計画税がかかる）か。 */
  cityPlanningArea: boolean;
  /** 新築住宅の軽減（建物の固定資産税1/2）を適用するか。 */
  newBuildingReduction: boolean;
}

export interface KoteiResult {
  /** 固定資産税（土地） */
  landFixedTax: number;
  /** 固定資産税（建物） */
  buildingFixedTax: number;
  /** 都市計画税（土地） */
  landCityTax: number;
  /** 都市計画税（建物） */
  buildingCityTax: number;
  /** 固定資産税の合計 */
  fixedTaxTotal: number;
  /** 都市計画税の合計 */
  cityTaxTotal: number;
  /** 年税額の合計 */
  total: number;
  /** 土地の固定資産税の課税標準額 */
  landFixedBase: number;
  /** 土地の都市計画税の課税標準額 */
  landCityBase: number;
}

function floor100(v: number): number {
  return Math.floor(Math.max(0, v) / 100) * 100;
}

export function calculateKotei(input: KoteiInput): KoteiResult {
  const landValue = Math.max(0, Math.round(input.landValue));
  const buildingValue = Math.max(0, Math.round(input.buildingValue));
  const area = Math.max(0, input.landAreaSqm);

  // ---- 土地の課税標準額 ----
  let landFixedBase: number;
  let landCityBase: number;
  if (input.isResidential && area > 0) {
    // 200㎡以下の部分（小規模）と 200㎡超の部分（一般）に按分
    const smallRatio = Math.min(area, SMALL_LAND_LIMIT_SQM) / area;
    const generalRatio = 1 - smallRatio;
    const smallValue = landValue * smallRatio;
    const generalValue = landValue * generalRatio;
    landFixedBase = smallValue / 6 + generalValue / 3;
    landCityBase = smallValue / 3 + (generalValue * 2) / 3;
  } else {
    // 非住宅用地は評価額をそのまま課税標準とする（負担調整は考慮せず）
    landFixedBase = landValue;
    landCityBase = landValue;
  }

  // ---- 税額 ----
  const landFixedTax = floor100(landFixedBase * FIXED_TAX_RATE);
  let buildingFixedTax = buildingValue * FIXED_TAX_RATE;
  if (input.newBuildingReduction) buildingFixedTax /= 2; // 新築住宅の軽減（1/2）
  buildingFixedTax = floor100(buildingFixedTax);

  const landCityTax = input.cityPlanningArea ? floor100(landCityBase * CITY_PLANNING_TAX_RATE) : 0;
  const buildingCityTax = input.cityPlanningArea ? floor100(buildingValue * CITY_PLANNING_TAX_RATE) : 0;

  const fixedTaxTotal = landFixedTax + buildingFixedTax;
  const cityTaxTotal = landCityTax + buildingCityTax;

  return {
    landFixedTax,
    buildingFixedTax,
    landCityTax,
    buildingCityTax,
    fixedTaxTotal,
    cityTaxTotal,
    total: fixedTaxTotal + cityTaxTotal,
    landFixedBase: Math.round(landFixedBase),
    landCityBase: Math.round(landCityBase),
  };
}
