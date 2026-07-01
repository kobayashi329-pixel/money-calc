// =============================================================
//  所得税 計算ロジック（純粋関数）
//  所得税 ＝ 課税所得 × 税率 − 控除額（超過累進・速算表）
//    ・課税所得は1,000円未満切り捨て
//    ・復興特別所得税 ＝ 所得税 × 2.1%（2037年まで）
//  出典: 国税庁 No.2260 所得税の税率
//        https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
// =============================================================

interface Band {
  max: number; // 課税所得の上限
  rate: number;
  deduction: number;
}

// 課税所得に対する所得税の速算表
export const INCOME_TAX_BANDS: Band[] = [
  { max: 1_950_000, rate: 0.05, deduction: 0 },
  { max: 3_300_000, rate: 0.1, deduction: 97_500 },
  { max: 6_950_000, rate: 0.2, deduction: 427_500 },
  { max: 9_000_000, rate: 0.23, deduction: 636_000 },
  { max: 18_000_000, rate: 0.33, deduction: 1_536_000 },
  { max: 40_000_000, rate: 0.4, deduction: 2_796_000 },
  { max: Infinity, rate: 0.45, deduction: 4_796_000 },
];

export interface ShotokuResult {
  /** 課税所得（1,000円未満切捨て後） */
  taxable: number;
  /** 適用された限界税率 */
  rate: number;
  /** 所得税（復興税を除く・100円未満切捨て） */
  incomeTax: number;
  /** 復興特別所得税（2.1%） */
  reconstruction: number;
  /** 合計（所得税＋復興特別所得税） */
  total: number;
}

/** 課税所得（課税される所得金額）から所得税を計算する */
export function calculateShotoku(taxableInput: number): ShotokuResult {
  const taxable = Math.floor(Math.max(0, taxableInput) / 1000) * 1000;
  let rate = 0;
  let deduction = 0;
  for (const b of INCOME_TAX_BANDS) {
    if (taxable <= b.max) {
      rate = b.rate;
      deduction = b.deduction;
      break;
    }
  }
  const incomeTax = Math.floor(Math.max(0, taxable * rate - deduction) / 100) * 100;
  const reconstruction = Math.floor((incomeTax * 0.021) / 100) * 100;
  return {
    taxable,
    rate,
    incomeTax,
    reconstruction,
    total: incomeTax + reconstruction,
  };
}
