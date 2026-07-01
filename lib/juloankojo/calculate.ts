// =============================================================
//  住宅ローン控除（住宅ローン減税）計算ロジック（純粋関数）
//  年間の控除額 ＝ min(年末ローン残高, 借入限度額) × 0.7%
//    ・控除期間：新築（省エネ住宅）13年／中古10年
//    ・借入限度額は住宅の環境性能で変わる（2024・2025年入居）
//      子育て世帯・若者夫婦世帯は新築で上乗せ
//    ・実際の控除は「納めた所得税＋住民税（上限97,500円/年）」が上限
//  出典: 国土交通省「住宅ローン減税」
//        https://www.mlit.go.jp/jutakukentiku/house/jutakukentiku_house_tk2_000017.html
//  ※2024・2025年入居の基準。年度で改正されるため定数として分離。
// =============================================================

export type HousePerformance = "choki" | "zeh" | "shoene" | "other";

export interface JuloanKojoInput {
  /** 年末のローン残高 */
  balance: number;
  /** 新築・買取再販か（false＝中古/既存住宅） */
  newBuild: boolean;
  /** 住宅の環境性能 */
  performance: HousePerformance;
  /** 子育て世帯・若者夫婦世帯（2024・2025年入居の新築で上乗せ） */
  kosodate: boolean;
}

export interface JuloanKojoResult {
  /** 借入限度額 */
  limit: number;
  /** 控除の対象になる額（残高と限度額の小さいほう） */
  target: number;
  /** 年間の控除額（最大） */
  annual: number;
  /** 控除期間（年） */
  years: number;
  /** 期間合計の最大目安（残高一定と仮定） */
  totalMax: number;
  /** 対象外（新築・非省エネ等） */
  ineligible: boolean;
}

/** 借入限度額（万円）を返す。0＝対象外。 */
function borrowLimit(input: JuloanKojoInput): number {
  const { newBuild, performance, kosodate } = input;
  if (newBuild) {
    // 新築・買取再販（2024・2025年入居）
    switch (performance) {
      case "choki":
        return (kosodate ? 5000 : 4500) * 10000;
      case "zeh":
        return (kosodate ? 4500 : 3500) * 10000;
      case "shoene":
        return (kosodate ? 4000 : 3000) * 10000;
      default:
        return 0; // 省エネ基準未達の新築は原則対象外
    }
  }
  // 中古（既存住宅）
  return (performance === "other" ? 2000 : 3000) * 10000;
}

export function calculateJuloanKojo(input: JuloanKojoInput): JuloanKojoResult {
  const balance = Math.max(0, Math.round(input.balance));
  const limit = borrowLimit(input);
  const target = Math.min(balance, limit);
  const annual = Math.floor(target * 0.007);
  const years = input.newBuild ? 13 : 10;
  return {
    limit,
    target,
    annual,
    years,
    totalMax: annual * years,
    ineligible: limit === 0,
  };
}
