// =============================================================
//  医療費控除 計算ロジック（純粋関数）
//  医療費控除額 ＝（1年間の医療費 − 保険金等の補填）−（10万円 または 総所得×5%の小さいほう）
//    ・控除の上限は200万円
//    ・軽減される税金 ＝ 控除額 ×（所得税の限界税率 ＋ 住民税10%）
//    ※総所得金額等が200万円未満の人は「総所得×5%」が足切り額（本ツールは課税所得で近似）
//  出典: 国税庁 No.1120 医療費を支払ったとき（医療費控除）
//        https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1120.htm
// =============================================================
import { INCOME_TAX_BANDS } from "../shotoku/calculate";

/** 控除の上限 */
export const MAX_DEDUCTION = 2_000_000;
/** 足切り額の原則（10万円） */
export const THRESHOLD = 100_000;

export interface IryouhiInput {
  /** 1年間に支払った医療費の合計 */
  medicalCost: number;
  /** 保険金・高額療養費などで補填される額 */
  compensation: number;
  /** 課税される所得金額（所得税率の判定に使用） */
  taxableIncome: number;
}

export interface IryouhiResult {
  /** 医療費控除額（0〜200万円） */
  deduction: number;
  /** 足切り額（10万円 または 課税所得×5%の小さいほう） */
  threshold: number;
  /** 所得税の限界税率 */
  incomeRate: number;
  /** 合計の軽減率（所得税率＋住民税10%） */
  totalRate: number;
  /** 軽減される税金の目安 */
  refund: number;
}

/** 課税所得から所得税の限界税率を返す */
function marginalRate(taxable: number): number {
  for (const b of INCOME_TAX_BANDS) {
    if (taxable <= b.max) return b.rate;
  }
  return 0.45;
}

export function calculateIryouhi(input: IryouhiInput): IryouhiResult {
  const cost = Math.max(0, Math.round(input.medicalCost));
  const compensation = Math.max(0, Math.round(input.compensation));
  const taxable = Math.max(0, Math.round(input.taxableIncome));

  // 足切り額：総所得200万円未満は5%（課税所得で近似）、それ以外は10万円
  const threshold = Math.min(THRESHOLD, Math.floor(taxable * 0.05));
  const deduction = Math.min(
    MAX_DEDUCTION,
    Math.max(0, cost - compensation - threshold),
  );

  const incomeRate = marginalRate(taxable);
  const totalRate = incomeRate + 0.1; // 住民税10%
  const refund = Math.round(deduction * totalRate);

  return { deduction, threshold, incomeRate, totalRate, refund };
}
