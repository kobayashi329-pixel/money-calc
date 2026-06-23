// =============================================================
//  退職金の手取り・税金計算 — 計算ロジック（純粋関数）
//  退職金（退職手当等）は「退職所得」として、給与とは分離して課税される。
//  計算順序:
//    退職金
//      → 退職所得控除（勤続年数で決まる大きな控除）を引く
//      → 1/2課税（原則。控除後の半分が課税対象）
//        ※ 勤続5年以下は特例あり（短期退職手当等・特定役員退職手当等）
//      → 課税退職所得金額（1,000円未満切捨て）
//      → 所得税（速算表）＋復興特別所得税2.1%
//      → 住民税（退職所得 × 10%・分離課税）
//      → 手取り = 退職金 − 所得税 − 住民税
//
//  出典:
//    国税庁 No.1420 退職金を受け取ったとき https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm
//    国税庁 No.2732 退職所得の源泉徴収 / 総務省 退職所得に係る個人住民税
// =============================================================
import {
  TAX_YEAR,
  INCOME_TAX_BRACKETS,
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_INCOME_RATE,
} from "../takehome/constants-2025";
import type { TaishokuInput, TaishokuResult } from "./types";

function floor1000(v: number): number {
  return Math.floor(v / 1000) * 1000;
}
function floor100(v: number): number {
  return Math.floor(v / 100) * 100;
}

/**
 * 退職所得控除額を求める。勤続年数は1年未満を切り上げる。
 *   勤続20年以下: 40万円 × 年数（最低80万円）
 *   勤続20年超 : 800万円 + 70万円 × (年数 − 20)
 * 出典: 国税庁 No.1420
 */
export function retirementDeduction(years: number): number {
  const y = Math.max(1, Math.ceil(years));
  if (y <= 20) return Math.max(800_000, 400_000 * y);
  return 8_000_000 + 700_000 * (y - 20);
}

/** 速算表から基準所得税額を引く */
function incomeTaxByBracket(taxable: number): number {
  for (const b of INCOME_TAX_BRACKETS) {
    if (taxable <= b.maxTaxable) return Math.max(0, taxable * b.rate - b.deduction);
  }
  return 0;
}

export function calculateTaishoku(input: TaishokuInput): TaishokuResult {
  const severance = Math.max(0, Math.round(input.severance));
  const yearsCeil = Math.max(1, Math.ceil(Math.max(0, input.years)));
  const isOfficer = !!input.isOfficer;

  const deduction = retirementDeduction(input.years);
  const afterDeduction = Math.max(0, severance - deduction);

  // 1/2課税の適用（勤続5年以下の特例を反映）
  let taxableBase: number;
  let halfApplied: "full" | "partial" | "none";
  if (yearsCeil > 5) {
    taxableBase = afterDeduction / 2;
    halfApplied = "full";
  } else if (isOfficer) {
    // 特定役員退職手当等: 1/2課税の適用なし
    taxableBase = afterDeduction;
    halfApplied = "none";
  } else if (afterDeduction <= 3_000_000) {
    // 短期退職手当等で控除後300万円以下: 1/2適用
    taxableBase = afterDeduction / 2;
    halfApplied = "full";
  } else {
    // 短期退職手当等で300万円超の部分: 1/2適用なし
    taxableBase = 1_500_000 + (afterDeduction - 3_000_000);
    halfApplied = "partial";
  }

  const taxableIncome = floor1000(Math.max(0, taxableBase));

  // 所得税（復興特別所得税込み・100円未満切捨て）
  const baseTax = incomeTaxByBracket(taxableIncome);
  const incomeTax = floor100(baseTax * (1 + RECONSTRUCTION_TAX_RATE));

  // 住民税（退職所得 × 10%・分離課税・100円未満切捨て）
  const residentTax = floor100(taxableIncome * RESIDENT_TAX_INCOME_RATE);

  const totalTax = incomeTax + residentTax;
  const takeHome = severance - totalTax;

  return {
    severance,
    yearsForDeduction: yearsCeil,
    retirementDeduction: deduction,
    afterDeduction,
    halfApplied,
    taxableIncome,
    incomeTax,
    residentTax,
    totalTax,
    takeHome,
    taxYear: TAX_YEAR,
  };
}
