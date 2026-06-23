// =============================================================
//  相続税の定数（2015年改正以後・現行）
//  出典: 国税庁 No.4152 / No.4155 / No.4158
// =============================================================

/** 基礎控除の定額部分（3,000万円） */
export const BASIC_EXEMPTION_BASE = 30_000_000;
/** 基礎控除の法定相続人1人あたりの加算額（600万円） */
export const BASIC_EXEMPTION_PER_HEIR = 6_000_000;

/**
 * 配偶者の税額軽減の下限（1億6,000万円）。
 * 配偶者の取得額がこの額か法定相続分のいずれか多い額までは相続税がかからない。
 */
export const SPOUSE_CREDIT_FLOOR = 160_000_000;

/**
 * 相続税の速算表。
 * 「法定相続分に応ずる取得金額」に対し、税額 = 金額 × 税率 − 控除額。
 * 出典: 国税庁 No.4155 相続税の税率
 */
export interface InheritanceTaxBracket {
  /** 取得金額の上限（この値以下に適用）。最終段は Infinity。 */
  maxAmount: number;
  rate: number;
  deduction: number;
}

export const INHERITANCE_TAX_BRACKETS: InheritanceTaxBracket[] = [
  { maxAmount: 10_000_000, rate: 0.1, deduction: 0 },
  { maxAmount: 30_000_000, rate: 0.15, deduction: 500_000 },
  { maxAmount: 50_000_000, rate: 0.2, deduction: 2_000_000 },
  { maxAmount: 100_000_000, rate: 0.3, deduction: 7_000_000 },
  { maxAmount: 200_000_000, rate: 0.4, deduction: 17_000_000 },
  { maxAmount: 300_000_000, rate: 0.45, deduction: 27_000_000 },
  { maxAmount: 600_000_000, rate: 0.5, deduction: 42_000_000 },
  { maxAmount: Infinity, rate: 0.55, deduction: 72_000_000 },
];
