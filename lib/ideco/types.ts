// iDeCo節税・積立シミュレータの型定義（金額はすべて「円」単位）
import type { YearlyAsset } from "../invest/accumulate";

export interface IdecoInput {
  /** 額面の年収（円） */
  annualIncome: number;
  /** 年齢（歳）。積立期間（65歳まで）と社会保険料の判定に使用。 */
  age: number;
  /** 加入区分のキー（掛金上限の判定） */
  categoryKey: string;
  /** 毎月の掛金（円） */
  monthlyContribution: number;
  /** 想定利回り（年率・%） */
  annualRatePercent: number;
  /** 16歳以上の扶養人数（節税額の精度向上・任意） */
  dependents?: number;
  /** 配偶者控除の対象配偶者がいるか（任意） */
  hasSpouse?: boolean;
  /** 都道府県コード（社会保険料率・任意） */
  prefecture?: string;
}

export interface IdecoResult {
  /** 実際に適用した毎月の掛金（上限でクランプ後） */
  monthlyContribution: number;
  /** 加入区分の毎月の掛金上限 */
  monthlyLimit: number;
  /** 入力が上限を超えていてクランプしたか */
  wasCapped: boolean;
  /** 年間の掛金 */
  annualContribution: number;
  /** 積立期間（65歳までの年数） */
  years: number;

  // ---- 節税（掛金が全額所得控除になる効果）----
  /** 所得税の限界税率（小数） */
  marginalIncomeTaxRate: number;
  /** 年間の所得税の軽減額 */
  annualIncomeTaxSaving: number;
  /** 年間の住民税の軽減額 */
  annualResidentTaxSaving: number;
  /** 年間の節税額（所得税＋住民税） */
  annualTaxSaving: number;
  /** 積立期間トータルの節税額（年間 × 年数・概算） */
  totalTaxSaving: number;

  // ---- 積立（運用）----
  /** 元本の合計 */
  totalPrincipal: number;
  /** 65歳時点の評価額 */
  finalValue: number;
  /** 運用益 */
  totalGain: number;
  /** 年ごとの資産推移 */
  yearly: YearlyAsset[];

  /** 適用年度（西暦） */
  taxYear: number;
}
