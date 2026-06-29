// =============================================================
//  住民税 計算ロジック（純粋関数）
//  年収手取り計算機のロジック（lib/takehome）を再利用し、
//  住民税（所得割＋均等割）の年額を求める。
//    所得割 ＝（課税所得 × 10% − 調整控除）
//    均等割 ＝ 約5,000円（標準）
//  ※ 概算。自治体ごとの均等割額・税率の違い、各種税額控除は反映しない。
// =============================================================
import {
  employmentIncome,
  calcSocialInsurance,
  calcResidentTax,
} from "../takehome/calculate";
import { getPrefectureHealthRateEmployee } from "../takehome/prefectures-2025";
import { TAX_YEAR } from "../takehome/constants-2025";

export interface JuuminzeiInput {
  /** 額面の年収（円・賞与込み） */
  annualIncome: number;
  /** 年齢（社会保険料の介護保険判定に使用） */
  age: number;
  /** 配偶者控除の対象となる配偶者がいるか */
  hasSpouse: boolean;
  /** 16歳以上の扶養親族の人数（配偶者を除く） */
  dependents: number;
  /** 都道府県コード（協会けんぽ健康保険料率・任意） */
  prefecture?: string;
}

export interface JuuminzeiResult {
  /** 給与所得（給与収入−給与所得控除） */
  employmentIncome: number;
  /** 社会保険料（本人負担・年額）。所得控除に使う。 */
  socialInsurance: number;
  /** 住民税の課税所得 */
  taxableIncome: number;
  /** 所得割（調整控除後・100円未満切捨て） */
  incomeLevy: number;
  /** 均等割 */
  perCapitaLevy: number;
  /** 住民税の合計（年額） */
  total: number;
  taxYear: number;
}

export function calculateJuuminzei(input: JuuminzeiInput): JuuminzeiResult {
  const annualIncome = Math.max(0, Math.round(input.annualIncome));
  const emp = employmentIncome(annualIncome);
  const healthRate = getPrefectureHealthRateEmployee(input.prefecture);
  const social = calcSocialInsurance(annualIncome, input.age, healthRate);
  const deps = Math.max(0, Math.round(input.dependents)) + (input.hasSpouse ? 1 : 0);

  const r = calcResidentTax(emp, social.total, deps);

  return {
    employmentIncome: emp,
    socialInsurance: social.total,
    taxableIncome: r.taxableIncome,
    incomeLevy: r.incomeLevy,
    perCapitaLevy: r.perCapitaLevy,
    total: r.total,
    taxYear: TAX_YEAR,
  };
}
