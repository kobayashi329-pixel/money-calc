// =============================================================
//  NISA積立シミュレータ — 計算ロジック（純粋関数）
//  共通の複利エンジン（lib/invest/accumulate）で将来評価額を求め、
//  NISAの最大の価値である「運用益が非課税」のメリット額を算出する。
//
//  課税口座（特定口座など）なら運用益に20.315%が課税されるが、
//  NISAではそれが非課税になる ＝ taxSaved がそのまま利用者の得になる。
// =============================================================
import { accumulate } from "../invest/accumulate";
import {
  CAPITAL_GAINS_TAX_RATE,
  NISA_TSUMITATE_ANNUAL,
  NISA_ANNUAL_TOTAL,
  NISA_LIFETIME_TOTAL,
} from "../invest/constants";
import type { NisaInput, NisaResult } from "./types";

export function calculateNisa(input: NisaInput): NisaResult {
  const acc = accumulate({
    monthlyContribution: input.monthlyContribution,
    annualRatePercent: input.annualRatePercent,
    years: input.years,
  });

  // NISAの非課税メリット ＝ 運用益にかかるはずだった税
  const taxSaved = Math.round(acc.totalGain * CAPITAL_GAINS_TAX_RATE);
  // 課税口座だった場合の税引後評価額（元本は非課税なので運用益にのみ課税）
  const taxableFinalValue = acc.finalValue - taxSaved;

  const annualContribution = Math.max(0, Math.round(input.monthlyContribution)) * 12;

  return {
    months: acc.months,
    totalPrincipal: acc.totalPrincipal,
    finalValue: acc.finalValue,
    totalGain: acc.totalGain,
    yearly: acc.yearly,
    taxSaved,
    taxableFinalValue,
    annualContribution,
    exceedsAnnualTsumitate: annualContribution > NISA_TSUMITATE_ANNUAL,
    exceedsAnnualTotal: annualContribution > NISA_ANNUAL_TOTAL,
    exceedsLifetime: acc.totalPrincipal > NISA_LIFETIME_TOTAL,
  };
}
