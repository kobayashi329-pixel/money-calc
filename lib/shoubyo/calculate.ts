// =============================================================
//  傷病手当金 計算ロジック（純粋関数）
//  1日あたりの支給額 ＝（支給開始日以前12か月の標準報酬月額の平均 ÷ 30）× 2/3
//    ・「÷30」した額は10円未満を四捨五入して「標準報酬日額」とする
//    ・「×2/3」した額は1円未満を四捨五入
//    ・連続して3日間休んだ後（待期期間）、4日目から支給
//    ・支給期間は通算1年6か月（同一傷病）
//  出典: 全国健康保険協会（協会けんぽ）「傷病手当金」
//        https://www.kyoukaikenpo.or.jp/g3/sb3040/
// =============================================================

/** 支給は通算1年6か月（＝約546日）まで */
export const MAX_BENEFIT_DAYS = 546;
/** 待期期間（連続3日） */
export const WAITING_DAYS = 3;

export interface ShoubyoInput {
  /** 標準報酬月額の平均（目安として直近の月給を入力） */
  standardMonthly: number;
  /** 連続して休んだ日数（待期3日を含む） */
  daysOff: number;
}

export interface ShoubyoResult {
  /** 標準報酬日額（月額÷30を10円単位に四捨五入） */
  standardDaily: number;
  /** 1日あたりの傷病手当金（標準報酬日額×2/3） */
  benefitDaily: number;
  /** 支給対象日数（休んだ日数−待期3日。通算上限を適用） */
  paidDays: number;
  /** 受給総額の目安 */
  total: number;
}

export function calculateShoubyo(input: ShoubyoInput): ShoubyoResult {
  const monthly = Math.max(0, Math.round(input.standardMonthly));
  const daysOff = Math.max(0, Math.floor(input.daysOff));

  // 標準報酬日額（10円未満四捨五入）
  const standardDaily = Math.round(monthly / 30 / 10) * 10;
  // 1日あたり（×2/3、1円未満四捨五入）
  const benefitDaily = Math.round((standardDaily * 2) / 3);

  // 待期3日を除き、通算1年6か月を上限
  const paidDays = Math.min(
    Math.max(0, daysOff - WAITING_DAYS),
    MAX_BENEFIT_DAYS,
  );

  return {
    standardDaily,
    benefitDaily,
    paidDays,
    total: benefitDaily * paidDays,
  };
}
