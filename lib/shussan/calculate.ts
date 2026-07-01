// =============================================================
//  出産手当金 計算ロジック（純粋関数）
//  1日あたり ＝（支給開始日以前12か月の標準報酬月額の平均 ÷ 30）× 2/3
//    ・「÷30」は10円未満を四捨五入して「標準報酬日額」とする
//    ・「×2/3」は1円未満を四捨五入
//    ・支給期間：出産日以前42日（多胎98日）＋出産日後56日
//      → 単胎で原則98日、多胎で原則154日（会社を休み給与がなかった期間が対象）
//  出典: 全国健康保険協会（協会けんぽ）「出産で会社を休んだとき（出産手当金）」
//        https://www.kyoukaikenpo.or.jp/g6/cat620/r311/
// =============================================================

/** 支給日数（産前42＋産後56） */
export const DAYS_SINGLE = 98;
/** 多胎（産前98＋産後56） */
export const DAYS_MULTIPLE = 154;

export interface ShussanInput {
  /** 標準報酬月額の平均（目安として月給を入力） */
  standardMonthly: number;
  /** 多胎妊娠か */
  multiple: boolean;
  /** 支給対象日数（省略時は単胎98／多胎154。実際は出産日で増減） */
  days?: number;
}

export interface ShussanResult {
  standardDaily: number;
  benefitDaily: number;
  days: number;
  total: number;
}

export function calculateShussan(input: ShussanInput): ShussanResult {
  const monthly = Math.max(0, Math.round(input.standardMonthly));
  const standardDaily = Math.round(monthly / 30 / 10) * 10;
  const benefitDaily = Math.round((standardDaily * 2) / 3);
  const days =
    input.days ?? (input.multiple ? DAYS_MULTIPLE : DAYS_SINGLE);

  return {
    standardDaily,
    benefitDaily,
    days,
    total: benefitDaily * days,
  };
}
