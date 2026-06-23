// 退職金の手取り・税金計算の型定義（金額はすべて「円」単位）

export interface TaishokuInput {
  /** 退職金の額（円） */
  severance: number;
  /** 勤続年数（年）。1年未満は切り上げて退職所得控除を計算。 */
  years: number;
  /** 役員等かどうか（勤続5年以下のとき1/2課税の扱いが変わる）。任意。 */
  isOfficer?: boolean;
}

export interface TaishokuResult {
  /** 退職金（入力） */
  severance: number;
  /** 退職所得控除の計算に用いた勤続年数（切り上げ後） */
  yearsForDeduction: number;
  /** 退職所得控除額 */
  retirementDeduction: number;
  /** 控除後の金額（退職金 − 退職所得控除） */
  afterDeduction: number;
  /** 1/2課税の適用状況（full=半分課税 / partial=一部のみ / none=全額課税） */
  halfApplied: "full" | "partial" | "none";
  /** 課税退職所得金額（1,000円未満切捨て） */
  taxableIncome: number;
  /** 所得税（復興特別所得税込み） */
  incomeTax: number;
  /** 住民税（退職所得 × 10%） */
  residentTax: number;
  /** 税金の合計 */
  totalTax: number;
  /** 手取り額（退職金 − 税金） */
  takeHome: number;
  /** 適用年度（西暦） */
  taxYear: number;
}
