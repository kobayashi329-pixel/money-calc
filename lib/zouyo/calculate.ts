// =============================================================
//  贈与税 計算ロジック（暦年課税・純粋関数）
//  贈与税 ＝（1年間の贈与額 − 基礎控除110万円）× 税率 − 控除額
//    特例税率：直系尊属（親・祖父母）から18歳以上の子・孫への贈与
//    一般税率：上記以外（兄弟間・夫婦間・未成年への贈与など）
//  出典: 国税庁 No.4408 贈与税の計算と税率（暦年課税）
//        https://www.nta.go.jp/taxes/shiraberu/taxanswer/zoyo/4408.htm
// =============================================================

export type GiftRateType = "special" | "general";

/** 暦年課税の基礎控除 */
export const GIFT_BASIC_DEDUCTION = 1_100_000;

interface GiftBand {
  maxBase: number; // 基礎控除後の課税価格の上限
  rate: number;
  deduction: number;
}

// 特例税率（直系尊属→18歳以上）
export const SPECIAL_BANDS: GiftBand[] = [
  { maxBase: 2_000_000, rate: 0.1, deduction: 0 },
  { maxBase: 4_000_000, rate: 0.15, deduction: 100_000 },
  { maxBase: 6_000_000, rate: 0.2, deduction: 300_000 },
  { maxBase: 10_000_000, rate: 0.3, deduction: 900_000 },
  { maxBase: 15_000_000, rate: 0.4, deduction: 1_900_000 },
  { maxBase: 30_000_000, rate: 0.45, deduction: 2_650_000 },
  { maxBase: 45_000_000, rate: 0.5, deduction: 4_150_000 },
  { maxBase: Infinity, rate: 0.55, deduction: 6_400_000 },
];

// 一般税率
export const GENERAL_BANDS: GiftBand[] = [
  { maxBase: 2_000_000, rate: 0.1, deduction: 0 },
  { maxBase: 3_000_000, rate: 0.15, deduction: 100_000 },
  { maxBase: 4_000_000, rate: 0.2, deduction: 250_000 },
  { maxBase: 6_000_000, rate: 0.3, deduction: 650_000 },
  { maxBase: 10_000_000, rate: 0.4, deduction: 1_250_000 },
  { maxBase: 15_000_000, rate: 0.45, deduction: 1_750_000 },
  { maxBase: 30_000_000, rate: 0.5, deduction: 2_500_000 },
  { maxBase: Infinity, rate: 0.55, deduction: 4_000_000 },
];

export interface ZouyoInput {
  /** 1年間に受け取った贈与額の合計（円） */
  amount: number;
  /** 適用する税率の種類 */
  rateType: GiftRateType;
}

export interface ZouyoResult {
  amount: number;
  basicDeduction: number;
  /** 基礎控除後の課税価格 */
  taxableBase: number;
  /** 適用された限界税率 */
  taxRate: number;
  /** 贈与税額（100円未満切捨て） */
  tax: number;
  /** 税引後に手元に残る額 */
  afterTax: number;
  /** 実質負担率（贈与税 ÷ 贈与額） */
  burdenRate: number;
}

export function calculateZouyo(input: ZouyoInput): ZouyoResult {
  const amount = Math.max(0, Math.round(input.amount));
  const taxableBase = Math.max(0, amount - GIFT_BASIC_DEDUCTION);
  const bands = input.rateType === "special" ? SPECIAL_BANDS : GENERAL_BANDS;

  let tax = 0;
  let taxRate = 0;
  if (taxableBase > 0) {
    for (const b of bands) {
      if (taxableBase <= b.maxBase) {
        tax = Math.max(0, taxableBase * b.rate - b.deduction);
        taxRate = b.rate;
        break;
      }
    }
  }
  tax = Math.floor(tax / 100) * 100; // 100円未満切捨て

  return {
    amount,
    basicDeduction: GIFT_BASIC_DEDUCTION,
    taxableBase,
    taxRate,
    tax,
    afterTax: amount - tax,
    burdenRate: amount > 0 ? tax / amount : 0,
  };
}
