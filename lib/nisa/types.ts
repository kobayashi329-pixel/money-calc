// NISA積立シミュレータの型定義（金額はすべて「円」単位）
import type { YearlyAsset } from "../invest/accumulate";

export interface NisaInput {
  /** 毎月の積立額（円） */
  monthlyContribution: number;
  /** 想定利回り（年率・%） */
  annualRatePercent: number;
  /** 積立期間（年） */
  years: number;
}

export interface NisaResult {
  /** 積立月数 */
  months: number;
  /** 元本の合計 */
  totalPrincipal: number;
  /** 最終評価額（非課税） */
  finalValue: number;
  /** 運用益 */
  totalGain: number;
  /** 年ごとの資産推移 */
  yearly: YearlyAsset[];
  /**
   * NISAの非課税メリット額（円）。
   * ＝ 運用益に本来かかる税（20.315%）。NISAではこれがまるごと非課税になる。
   */
  taxSaved: number;
  /** もし課税口座（特定口座等）だった場合の税引後の最終評価額 */
  taxableFinalValue: number;
  /** 年間の積立額（毎月 × 12） */
  annualContribution: number;
  /** 年間積立額が「つみたて投資枠」120万円を超えるか */
  exceedsAnnualTsumitate: boolean;
  /** 年間積立額が年間投資枠の合計360万円を超えるか */
  exceedsAnnualTotal: boolean;
  /** 元本累計が生涯非課税限度額1,800万円を超えるか */
  exceedsLifetime: boolean;
}
