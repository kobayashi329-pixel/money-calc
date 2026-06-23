// =============================================================
//  iDeCo節税・積立シミュレータ — 計算ロジック（純粋関数）
//  iDeCoの掛金は全額が「小規模企業共済等掛金控除」になり、課税所得が
//  そのぶん減る。よって毎年の節税額は次で求められる：
//    節税額 = 掛金 ×（所得税の限界税率 × 1.021 ＋ 住民税率10%）
//  課税所得・限界税率は年収手取り計算機のロジックを再利用して算出する。
//  積立部分は共通の複利エンジン（lib/invest/accumulate）で評価額を出す。
//
//  出典:
//    国税庁 No.1135 小規模企業共済等掛金控除
//      https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1135.htm
//    国民年金基金連合会 iDeCo公式（拠出限度額）
//      https://www.ideco-koushiki.jp/guide/structure.html
// =============================================================
import {
  employmentIncome,
  calcSocialInsurance,
  calcIncomeTax,
  calcResidentTax,
} from "../takehome/calculate";
import { getPrefectureHealthRateEmployee } from "../takehome/prefectures-2025";
import { marginalIncomeTaxRate } from "../furusato/calculate";
import { accumulate } from "../invest/accumulate";
import { getIdecoCategory } from "../invest/constants";
import {
  TAX_YEAR,
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_INCOME_RATE,
} from "../takehome/constants-2025";
import type { IdecoInput, IdecoResult } from "./types";

/** iDeCoに加入できる上限年齢（65歳未満まで・現行制度）。積立期間の終端。 */
export const IDECO_END_AGE = 65;

export function calculateIdeco(input: IdecoInput): IdecoResult {
  const annualIncome = Math.max(0, Math.round(input.annualIncome));
  const category = getIdecoCategory(input.categoryKey);
  const monthlyLimit = category.monthlyLimit;

  // 掛金は加入区分の上限でクランプ
  const requested = Math.max(0, Math.round(input.monthlyContribution));
  const monthly = Math.min(requested, monthlyLimit);
  const wasCapped = requested > monthlyLimit;
  const annualContribution = monthly * 12;

  // 積立期間（65歳まで）
  const years = Math.max(0, IDECO_END_AGE - Math.max(0, Math.round(input.age)));

  // ---- 節税額の算出（課税所得・限界税率を手取りロジックで再利用）----
  const effectiveDependents =
    Math.max(0, Math.round(input.dependents ?? 0)) + (input.hasSpouse ? 1 : 0);
  const empIncome = employmentIncome(annualIncome);
  const healthRate = getPrefectureHealthRateEmployee(input.prefecture);
  const social = calcSocialInsurance(annualIncome, input.age, healthRate);
  const incomeTax = calcIncomeTax(empIncome, social.total, effectiveDependents);
  const residentTax = calcResidentTax(empIncome, social.total, effectiveDependents);

  const marginalRate = marginalIncomeTaxRate(incomeTax.taxableIncome);

  // 掛金のうち、実際に課税所得を減らせる範囲（掛金が課税所得を超える低所得時の頭打ち）
  const incomeTaxBase = Math.min(annualContribution, Math.max(0, incomeTax.taxableIncome));
  const annualIncomeTaxSaving =
    incomeTax.taxableIncome > 0
      ? Math.round(incomeTaxBase * marginalRate * (1 + RECONSTRUCTION_TAX_RATE))
      : 0;

  const residentTaxBase = Math.min(annualContribution, Math.max(0, residentTax.taxableIncome));
  const annualResidentTaxSaving =
    residentTax.incomeLevy > 0
      ? Math.round(residentTaxBase * RESIDENT_TAX_INCOME_RATE)
      : 0;

  const annualTaxSaving = annualIncomeTaxSaving + annualResidentTaxSaving;
  const totalTaxSaving = annualTaxSaving * years;

  // ---- 積立（運用）----
  const acc = accumulate({
    monthlyContribution: monthly,
    annualRatePercent: input.annualRatePercent,
    years,
  });

  return {
    monthlyContribution: monthly,
    monthlyLimit,
    wasCapped,
    annualContribution,
    years,
    marginalIncomeTaxRate: marginalRate,
    annualIncomeTaxSaving,
    annualResidentTaxSaving,
    annualTaxSaving,
    totalTaxSaving,
    totalPrincipal: acc.totalPrincipal,
    finalValue: acc.finalValue,
    totalGain: acc.totalGain,
    yearly: acc.yearly,
    taxYear: TAX_YEAR,
  };
}
