// =============================================================
//  年収手取り計算機 — 計算ロジック（純粋関数）
//  すべてクライアント側で完結。副作用なし・テスト可能。
//  計算順序:
//    年収(給与収入)
//      → 給与所得控除 → 給与所得(=合計所得金額)
//      → 社会保険料(本人負担) → 社会保険料控除
//      → 各種所得控除(基礎・扶養・社保) → 課税所得(1000円未満切捨)
//      → 所得税(速算表) → 復興特別所得税
//      → 住民税(所得割[調整控除後]＋均等割)
//      → 手取り = 年収 − 社会保険料 − 所得税 − 住民税
// =============================================================
import {
  TAX_YEAR,
  SALARY_DEDUCTION_BRACKETS,
  BASIC_DEDUCTION_INCOME_TAX,
  BASIC_DEDUCTION_RESIDENT_TAX,
  DEPENDENT_DEDUCTION_INCOME_TAX,
  DEPENDENT_DEDUCTION_RESIDENT_TAX,
  DEPENDENT_PERSONAL_DEDUCTION_DIFF,
  INCOME_TAX_BRACKETS,
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_INCOME_RATE,
  RESIDENT_TAX_PER_CAPITA,
  ADJUSTMENT_CREDIT_RATE,
  BASIC_PERSONAL_DEDUCTION_DIFF,
  HEALTH_INSURANCE_RATE_EMPLOYEE,
  LONG_TERM_CARE_RATE_EMPLOYEE,
  PENSION_RATE_EMPLOYEE,
  EMPLOYMENT_INSURANCE_RATE_EMPLOYEE,
  LONG_TERM_CARE_AGE_MIN,
  LONG_TERM_CARE_AGE_MAX,
  HEALTH_MONTHLY_STANDARD_MAX,
  PENSION_MONTHLY_STANDARD_MAX,
} from "./constants-2025";
import type {
  TakeHomeInput,
  TakeHomeResult,
  SocialInsuranceBreakdown,
  IncomeTaxBreakdown,
  ResidentTaxBreakdown,
} from "./types";

/** 1,000円未満を切り捨て（課税所得の端数処理） */
function floorTo1000(value: number): number {
  return Math.floor(value / 1000) * 1000;
}

/** 100円未満を切り捨て（所得税・住民税所得割の端数処理） */
function floorTo100(value: number): number {
  return Math.floor(value / 100) * 100;
}

/**
 * 給与所得控除額を求める（令和7年分）。
 * 出典: 国税庁 No.1410
 */
export function salaryIncomeDeduction(annualIncome: number): number {
  const income = Math.max(0, annualIncome);
  for (const b of SALARY_DEDUCTION_BRACKETS) {
    if (income <= b.maxIncome) {
      const deduction = income * b.rate + b.add;
      // 控除額は収入額を超えない
      return Math.min(deduction, income);
    }
  }
  return 0;
}

/**
 * 給与所得（＝給与収入 − 給与所得控除）。給与のみなら合計所得金額に等しい。
 */
export function employmentIncome(annualIncome: number): number {
  return Math.max(0, Math.round(annualIncome - salaryIncomeDeduction(annualIncome)));
}

/** ブラケット表から、合計所得金額に応じた控除額を引く */
function lookupByTotalIncome(
  brackets: { maxTotalIncome: number; amount: number }[],
  totalIncome: number,
): number {
  for (const b of brackets) {
    if (totalIncome <= b.maxTotalIncome) return b.amount;
  }
  return 0;
}

/**
 * 社会保険料（本人負担分）を計算する。
 * 近似: 月額 = 年収 ÷ 12 とし、標準報酬月額の上限を適用して料率を乗じる。
 *   - 健康保険（＋40〜64歳は介護保険）: 上限 1,390,000円/月
 *   - 厚生年金: 上限 650,000円/月
 *   - 雇用保険: 年収全額に料率（上限なし）
 * 出典: 協会けんぽ・日本年金機構・厚生労働省（令和7年度）
 */
export function calcSocialInsurance(
  annualIncome: number,
  age: number,
): SocialInsuranceBreakdown {
  const income = Math.max(0, annualIncome);
  const monthly = income / 12;

  // 標準報酬月額の上限を適用した年間の算定基礎額
  const healthBase = Math.min(monthly, HEALTH_MONTHLY_STANDARD_MAX) * 12;
  const pensionBase = Math.min(monthly, PENSION_MONTHLY_STANDARD_MAX) * 12;

  const isCareAge = age >= LONG_TERM_CARE_AGE_MIN && age <= LONG_TERM_CARE_AGE_MAX;

  const health = Math.round(healthBase * HEALTH_INSURANCE_RATE_EMPLOYEE);
  const longTermCare = isCareAge
    ? Math.round(healthBase * LONG_TERM_CARE_RATE_EMPLOYEE)
    : 0;
  const pension = Math.round(pensionBase * PENSION_RATE_EMPLOYEE);
  const employment = Math.round(income * EMPLOYMENT_INSURANCE_RATE_EMPLOYEE);

  const total = health + longTermCare + pension + employment;
  return { health, longTermCare, pension, employment, total };
}

/**
 * 所得税（復興特別所得税込み）を計算する。
 * 出典: 国税庁 No.2260 / No.1199
 */
export function calcIncomeTax(
  empIncome: number,
  socialInsuranceTotal: number,
  dependents: number,
): IncomeTaxBreakdown {
  const basicDeduction = lookupByTotalIncome(BASIC_DEDUCTION_INCOME_TAX, empIncome);
  const dependentDeduction = Math.max(0, dependents) * DEPENDENT_DEDUCTION_INCOME_TAX;
  const totalDeductions = basicDeduction + socialInsuranceTotal + dependentDeduction;

  const taxableIncome = floorTo1000(Math.max(0, empIncome - totalDeductions));

  // 速算表
  let baseTax = 0;
  for (const b of INCOME_TAX_BRACKETS) {
    if (taxableIncome <= b.maxTaxable) {
      baseTax = taxableIncome * b.rate - b.deduction;
      break;
    }
  }
  baseTax = Math.max(0, baseTax);

  // 復興特別所得税込みの合計（最後に100円未満切捨て）
  const total = floorTo100(baseTax * (1 + RECONSTRUCTION_TAX_RATE));
  const reconstructionTax = Math.round(baseTax * RECONSTRUCTION_TAX_RATE);
  // 内訳の合計を total に一致させる（表示の整合性のため）
  const baseTaxShown = total - reconstructionTax;

  return {
    employmentIncome: empIncome,
    totalDeductions,
    taxableIncome,
    baseTax: baseTaxShown,
    reconstructionTax,
    total,
  };
}

/**
 * 住民税（所得割＋均等割）を計算する。
 * 出典: 総務省 個人住民税 / 東京都主税局
 */
export function calcResidentTax(
  empIncome: number,
  socialInsuranceTotal: number,
  dependents: number,
): ResidentTaxBreakdown {
  const deps = Math.max(0, dependents);
  const basicDeduction = lookupByTotalIncome(BASIC_DEDUCTION_RESIDENT_TAX, empIncome);
  const dependentDeduction = deps * DEPENDENT_DEDUCTION_RESIDENT_TAX;
  const totalDeductions = basicDeduction + socialInsuranceTotal + dependentDeduction;

  const taxableIncome = floorTo1000(Math.max(0, empIncome - totalDeductions));

  // 所得割（標準税率10%）
  const incomeLevyRaw = taxableIncome * RESIDENT_TAX_INCOME_RATE;

  // 調整控除（人的控除額の差に基づく税額控除）
  let adjustmentCredit = 0;
  if (empIncome <= 25_000_000 && taxableIncome > 0) {
    const personalDeductionDiff =
      BASIC_PERSONAL_DEDUCTION_DIFF + deps * DEPENDENT_PERSONAL_DEDUCTION_DIFF;
    if (taxableIncome <= 2_000_000) {
      adjustmentCredit =
        Math.min(personalDeductionDiff, taxableIncome) * ADJUSTMENT_CREDIT_RATE;
    } else {
      const base = Math.max(
        personalDeductionDiff - (taxableIncome - 2_000_000),
        50_000,
      );
      adjustmentCredit = base * ADJUSTMENT_CREDIT_RATE;
    }
  }

  const incomeLevy = floorTo100(Math.max(0, incomeLevyRaw - adjustmentCredit));
  // 均等割（課税所得が生じる水準でのみ賦課する簡易判定）
  const perCapitaLevy = taxableIncome > 0 ? RESIDENT_TAX_PER_CAPITA : 0;

  return {
    taxableIncome,
    incomeLevy,
    perCapitaLevy,
    total: incomeLevy + perCapitaLevy,
  };
}

/**
 * 年収手取りの総合計算。
 */
export function calculateTakeHome(input: TakeHomeInput): TakeHomeResult {
  const annualIncome = Math.max(0, Math.round(input.annualIncome));
  const empIncome = employmentIncome(annualIncome);

  const socialInsurance = calcSocialInsurance(annualIncome, input.age);
  const incomeTax = calcIncomeTax(empIncome, socialInsurance.total, input.dependents);
  const residentTax = calcResidentTax(empIncome, socialInsurance.total, input.dependents);

  const totalDeductionFromIncome =
    socialInsurance.total + incomeTax.total + residentTax.total;
  const takeHomeAnnual = annualIncome - totalDeductionFromIncome;
  const takeHomeMonthly = Math.round(takeHomeAnnual / 12);
  const takeHomeRate = annualIncome > 0 ? takeHomeAnnual / annualIncome : 0;

  return {
    annualIncome,
    socialInsurance,
    incomeTax,
    residentTax,
    totalDeductionFromIncome,
    takeHomeAnnual,
    takeHomeMonthly,
    takeHomeRate,
    taxYear: TAX_YEAR,
  };
}
