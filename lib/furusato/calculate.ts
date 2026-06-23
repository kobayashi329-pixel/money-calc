// =============================================================
//  ふるさと納税 上限額シミュレータ — 計算ロジック（純粋関数）
//  すべてクライアント側で完結。副作用なし・テスト可能。
//
//  「自己負担2,000円で全額控除される寄付上限額」を求める。
//  ふるさと納税の控除は次の3階建てで、寄付額(X)−2,000円が
//  まるごと税から差し引かれる：
//    (1) 所得税からの控除  = (X−2,000) × 所得税の限界税率 × 1.021
//    (2) 住民税 基本分      = (X−2,000) × 10%
//    (3) 住民税 特例分      = (X−2,000) × (90% − 所得税率 × 1.021)
//        ただし (3) は「住民税 所得割額 × 20%」が上限。
//  この (3) が上限（所得割の20%）に達する寄付額が、自己負担2,000円で
//  済む上限額になる。逆算すると：
//    上限額 = 住民税所得割額 × 20% ÷ (90% − 所得税率 × 1.021) + 2,000
//
//  出典:
//    総務省 ふるさと納税ポータル「税金の控除について」
//      https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html
//    国税庁 No.2260 所得税の税率 / No.1199 基礎控除
// =============================================================
import {
  TAX_YEAR,
  INCOME_TAX_BRACKETS,
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_INCOME_RATE,
} from "../takehome/constants-2025";
import {
  employmentIncome,
  calcSocialInsurance,
  calcIncomeTax,
  calcResidentTax,
} from "../takehome/calculate";
import { getPrefectureHealthRateEmployee } from "../takehome/prefectures-2025";
import type { FurusatoInput, FurusatoResult } from "./types";

/** 自己負担額（控除されない最低負担） */
export const SELF_PAY = 2_000;
/** 住民税 特例分の上限（住民税所得割額に対する割合） */
export const SPECIAL_CAP_RATE = 0.2;

/**
 * 所得税の限界税率を求める（課税所得金額から速算表の区分を引く）。
 * ふるさと納税の控除割合の計算に使う。
 * 出典: 国税庁 No.2260
 */
export function marginalIncomeTaxRate(taxableIncome: number): number {
  for (const b of INCOME_TAX_BRACKETS) {
    if (taxableIncome <= b.maxTaxable) return b.rate;
  }
  return 0;
}

/**
 * ふるさと納税の上限額（自己負担2,000円で済む寄付額の目安）を計算する。
 * 課税所得・住民税所得割は、年収手取り計算機と同じロジックを再利用して求める。
 */
export function calculateFurusato(input: FurusatoInput): FurusatoResult {
  const annualIncome = Math.max(0, Math.round(input.annualIncome));
  // 配偶者控除は一般扶養控除（所得税38万/住民税33万）と同額のため、
  // 簡易に「扶養人数＋配偶者(1人)」として既存ロジックに渡す。
  const effectiveDependents =
    Math.max(0, Math.round(input.dependents)) + (input.hasSpouse ? 1 : 0);

  const empIncome = employmentIncome(annualIncome);
  const healthRate = getPrefectureHealthRateEmployee(input.prefecture);
  const social = calcSocialInsurance(annualIncome, input.age, healthRate);

  // 所得税の課税所得（限界税率の判定基礎）と住民税の所得割（特例分上限の基礎）
  const incomeTax = calcIncomeTax(empIncome, social.total, effectiveDependents);
  const residentTax = calcResidentTax(empIncome, social.total, effectiveDependents);

  const residentTaxIncomeLevy = residentTax.incomeLevy;
  const marginalRate = marginalIncomeTaxRate(incomeTax.taxableIncome);

  // 特例分の控除割合 = 90% − 所得税率 × 1.021
  //   （90% = 100% − 住民税基本分10%）
  const specialRate =
    1 - RESIDENT_TAX_INCOME_RATE - marginalRate * (1 + RECONSTRUCTION_TAX_RATE);

  // 上限額の逆算
  let limitExact = 0;
  if (residentTaxIncomeLevy > 0 && specialRate > 0) {
    limitExact =
      (residentTaxIncomeLevy * SPECIAL_CAP_RATE) / specialRate + SELF_PAY;
  } else if (residentTaxIncomeLevy > 0) {
    // specialRate <= 0 は理論上のみ（高所得で所得税率45%でも約0.44で正）。保険的処理。
    limitExact = SELF_PAY;
  }
  // 住民税所得割が生じない（非課税等）→ ふるさと納税の控除メリットはない
  const hasBenefit = residentTaxIncomeLevy > 0 && limitExact > SELF_PAY;

  // 安全側に1,000円未満を切り捨て（少しでも超えると超過分は自己負担になるため）
  const limit = hasBenefit ? Math.floor(limitExact / 1_000) * 1_000 : 0;

  // 上限額まで寄付した場合の控除内訳
  const donation = limit;
  const base = Math.max(0, donation - SELF_PAY); // 控除対象額
  const incomeTaxDeduction = Math.round(
    base * marginalRate * (1 + RECONSTRUCTION_TAX_RATE),
  );
  const residentBasicDeduction = Math.round(base * RESIDENT_TAX_INCOME_RATE);
  // 特例分は残差で求める（合計が必ず base に一致＝自己負担をちょうど2,000円にする）。
  // base ≤ limitExact−2,000 なので特例分は所得割20%上限を超えない。
  const residentSpecialDeduction = Math.max(
    0,
    base - incomeTaxDeduction - residentBasicDeduction,
  );
  const totalDeduction =
    incomeTaxDeduction + residentBasicDeduction + residentSpecialDeduction;

  return {
    limit,
    limitExact: Math.round(limitExact),
    residentTaxIncomeLevy,
    marginalIncomeTaxRate: marginalRate,
    incomeTaxTaxableIncome: incomeTax.taxableIncome,
    breakdown: {
      donation,
      selfPay: donation - totalDeduction,
      incomeTaxDeduction,
      residentBasicDeduction,
      residentSpecialDeduction,
      totalDeduction,
    },
    taxYear: TAX_YEAR,
  };
}
