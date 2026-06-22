// 年収手取り計算機の型定義
// すべての金額は「円」単位の整数で扱う。

/** 社会保険の種類 */
export type InsuranceType =
  | "kenkohoken" // 健康保険（協会けんぽ・会社員）＋ 厚生年金 ＋ 雇用保険
  | "kokuho"; // 国民健康保険 ＋ 国民年金（自営業など）※今後の拡張用

/** 計算の入力 */
export interface TakeHomeInput {
  /** 額面の年収（円）。給与収入の総額（賞与含む）。 */
  annualIncome: number;
  /** 年齢（歳）。介護保険（40〜64歳）や社会保険の判定に使用。 */
  age: number;
  /** 扶養親族の人数（一般の控除対象扶養親族・配偶者を簡易にまとめた人数） */
  dependents: number;
  /** 社会保険の種類 */
  insuranceType: InsuranceType;
}

/** 社会保険料の内訳（被保険者本人負担分、円） */
export interface SocialInsuranceBreakdown {
  /** 健康保険料（介護保険分を除く） */
  health: number;
  /** 介護保険料（40〜64歳のみ。それ以外は0） */
  longTermCare: number;
  /** 厚生年金保険料 */
  pension: number;
  /** 雇用保険料 */
  employment: number;
  /** 社会保険料合計 */
  total: number;
}

/** 所得税の内訳（円） */
export interface IncomeTaxBreakdown {
  /** 給与所得控除後の給与所得金額 */
  employmentIncome: number;
  /** 所得控除の合計（基礎控除＋社会保険料控除＋扶養控除など） */
  totalDeductions: number;
  /** 課税所得金額（1000円未満切り捨て） */
  taxableIncome: number;
  /** 基準所得税額（復興特別所得税を含まない） */
  baseTax: number;
  /** 復興特別所得税（基準所得税額×2.1%） */
  reconstructionTax: number;
  /** 所得税合計（基準所得税額＋復興特別所得税、100円未満切り捨て） */
  total: number;
}

/** 住民税の内訳（円） */
export interface ResidentTaxBreakdown {
  /** 課税所得金額（住民税ベース、1000円未満切り捨て） */
  taxableIncome: number;
  /** 所得割（調整控除適用後） */
  incomeLevy: number;
  /** 均等割（森林環境税を含む） */
  perCapitaLevy: number;
  /** 住民税合計 */
  total: number;
}

/** 計算結果のまとめ */
export interface TakeHomeResult {
  /** 入力（額面年収） */
  annualIncome: number;
  /** 社会保険料 */
  socialInsurance: SocialInsuranceBreakdown;
  /** 所得税 */
  incomeTax: IncomeTaxBreakdown;
  /** 住民税 */
  residentTax: ResidentTaxBreakdown;
  /** 控除合計（社会保険料＋所得税＋住民税） */
  totalDeductionFromIncome: number;
  /** 手取り年収（円） */
  takeHomeAnnual: number;
  /** 手取り月額の目安（手取り年収 ÷ 12、円） */
  takeHomeMonthly: number;
  /** 手取り率（手取り ÷ 額面） */
  takeHomeRate: number;
  /** 適用年度（西暦） */
  taxYear: number;
}
