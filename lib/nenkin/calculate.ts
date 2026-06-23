// =============================================================
//  公的年金 受給見込み額シミュレーション — 計算ロジック（純粋関数）
//  老齢基礎年金（国民年金）＋ 老齢厚生年金（会社員）の受給見込み額を概算する。
//  さらに繰上げ受給（60〜64歳）・繰下げ受給（66〜75歳）の増減も反映する。
//
//  計算（令和7年度＝2025年度の額・乗率）:
//    老齢基礎年金 ＝ 満額831,696円 × 保険料納付年数 ÷ 40
//    老齢厚生年金（報酬比例・概算）
//      ＝ 厚生年金加入中の平均年収（賞与込み）× 5.481/1000 × 厚生年金加入年数
//        ※ 報酬比例部分の式（平成15年4月以降の総報酬制）を、平均標準報酬額≒
//          平均年収÷12 とみなして年額に整理した近似。
//    繰上げ/繰下げ:
//      繰上げ（60〜64歳）… 1ヶ月あたり0.4%減（最大−24%）
//      繰下げ（66〜75歳）… 1ヶ月あたり0.7%増（最大+84%）
//
//  出典:
//    日本年金機構 令和7年4月分からの年金額等について
//      https://www.nenkin.go.jp/oshirase/taisetu/2025/202504/040102.html
//    日本年金機構 報酬比例部分 / 年金の繰上げ・繰下げ受給
// =============================================================
import type { NenkinInput, NenkinResult } from "./types";

/** 老齢基礎年金の満額（令和7年度・新規裁定者・年額） */
export const BASIC_PENSION_FULL = 831_696;
/** 満額となる保険料納付年数（40年＝480月） */
export const BASIC_PENSION_FULL_YEARS = 40;
/** 老齢厚生年金（報酬比例）の乗率（平成15年4月以降・総報酬制） */
export const KOSEI_MULTIPLIER = 5.481 / 1000;
/** 繰上げの減額率（1ヶ月あたり・令和4年4月以降） */
export const EARLY_RATE_PER_MONTH = 0.004;
/** 繰下げの増額率（1ヶ月あたり） */
export const DEFER_RATE_PER_MONTH = 0.007;
/** 標準の受給開始年齢 */
export const STANDARD_START_AGE = 65;

/** 受給開始年齢による増減率（1.0が基準＝65歳） */
export function startAgeFactor(startAge: number): number {
  const age = Math.min(75, Math.max(60, Math.round(startAge)));
  const months = (age - STANDARD_START_AGE) * 12;
  if (months < 0) return 1 + months * EARLY_RATE_PER_MONTH; // months負 → 減額
  return 1 + months * DEFER_RATE_PER_MONTH;
}

export function calculateNenkin(input: NenkinInput): NenkinResult {
  const kisoYears = Math.min(BASIC_PENSION_FULL_YEARS, Math.max(0, input.kisoYears));
  const kouseiYears = Math.max(0, input.kouseiYears);
  const avgAnnualIncome = Math.max(0, Math.round(input.avgAnnualIncome));
  const startAge = Math.min(75, Math.max(60, Math.round(input.startAge)));

  // 65歳時点の基本額（増減前）
  const basicBase = Math.round((BASIC_PENSION_FULL * kisoYears) / BASIC_PENSION_FULL_YEARS);
  const koseiBase = Math.round(avgAnnualIncome * KOSEI_MULTIPLIER * kouseiYears);

  const factor = startAgeFactor(startAge);

  const basicAnnual = Math.round(basicBase * factor);
  const koseiAnnual = Math.round(koseiBase * factor);
  const totalAnnual = basicAnnual + koseiAnnual;

  return {
    startAge,
    factor,
    basicAnnualAt65: basicBase,
    koseiAnnualAt65: koseiBase,
    totalAnnualAt65: basicBase + koseiBase,
    basicAnnual,
    koseiAnnual,
    totalAnnual,
    totalMonthly: Math.round(totalAnnual / 12),
  };
}
