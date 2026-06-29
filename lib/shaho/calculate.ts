// =============================================================
//  社会保険料 計算ロジック（純粋関数）
//  年収手取り計算機の calcSocialInsurance を再利用し、本人負担分の
//  社会保険料（健康保険・介護保険・厚生年金・雇用保険）の年額・月額を求める。
//  ※ 概算。標準報酬月額の等級・上限を近似で扱う（年収÷12で算定）。
// =============================================================
import { calcSocialInsurance } from "../takehome/calculate";
import { getPrefectureHealthRateEmployee } from "../takehome/prefectures-2025";
import { TAX_YEAR } from "../takehome/constants-2025";

export interface ShahoInput {
  /** 額面の年収（円・賞与込み） */
  annualIncome: number;
  /** 年齢（介護保険＝40〜64歳の判定に使用） */
  age: number;
  /** 都道府県コード（協会けんぽ健康保険料率・任意） */
  prefecture?: string;
}

export interface ShahoResult {
  /** 健康保険料（年額・本人負担） */
  health: number;
  /** 介護保険料（年額・40〜64歳のみ） */
  longTermCare: number;
  /** 厚生年金保険料（年額・本人負担） */
  pension: number;
  /** 雇用保険料（年額・本人負担） */
  employment: number;
  /** 社会保険料の合計（年額） */
  total: number;
  /** 月額の合計（年額÷12の目安） */
  monthly: number;
  /** 年収に対する社会保険料の割合 */
  rate: number;
  /** 40〜64歳（介護保険あり）か */
  hasLongTermCare: boolean;
  taxYear: number;
}

export function calculateShaho(input: ShahoInput): ShahoResult {
  const annualIncome = Math.max(0, Math.round(input.annualIncome));
  const healthRate = getPrefectureHealthRateEmployee(input.prefecture);
  const s = calcSocialInsurance(annualIncome, input.age, healthRate);

  return {
    health: s.health,
    longTermCare: s.longTermCare,
    pension: s.pension,
    employment: s.employment,
    total: s.total,
    monthly: Math.round(s.total / 12),
    rate: annualIncome > 0 ? s.total / annualIncome : 0,
    hasLongTermCare: s.longTermCare > 0,
    taxYear: TAX_YEAR,
  };
}
