// =============================================================
//  育児休業給付金 計算ロジック（純粋関数）
//  支給額（1か月）＝ 休業開始時賃金日額 × 支給日数（原則30日）× 支給率
//    支給率：育休開始から通算180日（約6か月）までは 67%、それ以降は 50%
//    休業開始時賃金日額 ＝ 休業開始前6か月の賃金 ÷ 180（＝平均月給 ÷ 30の目安）
//    → 1か月分の支給額 ≒ 休業前の月給 × 支給率（上限あり）
//  出典: ハローワーク「育児休業給付」、厚生労働省「育児休業等給付の支給限度額」
//        （令和7年8月1日改定の支給上限額を反映）
//        https://www.hellowork.mhlw.go.jp/insurance/insurance_ikuji.html
//  ※2025年4月〜「出生後休業支援給付金」により、両親が一定要件で育休を取ると
//    最大28日間13%が上乗せされ、その間は実質手取り10割相当（本計算では別途）。
// =============================================================

// ---- 令和7年8月1日〜 の支給上限額（1支給単位＝30日あたり） ----
/** 支給率67%のときの支給額の上限 */
export const CAP_67 = 323_811;
/** 支給率50%のときの支給額の上限 */
export const CAP_50 = 241_650;

/** 支給率67%が適用される期間（日数）。約6か月。 */
const DAYS_67 = 180;

export interface IkukyuInput {
  /** 休業開始前6か月の平均月給（賞与を除く・額面） */
  monthlyWage: number;
  /** 育児休業を取得する月数 */
  months: number;
}

export interface IkukyuResult {
  /** 67%期間の1か月あたり支給額（上限適用後） */
  monthly67: number;
  /** 50%期間の1か月あたり支給額（上限適用後） */
  monthly50: number;
  /** 67%が適用される月数 */
  months67: number;
  /** 50%が適用される月数 */
  months50: number;
  /** 受給総額の目安 */
  total: number;
  /** 上限額で頭打ちになっているか */
  capped: boolean;
}

export function calculateIkukyu(input: IkukyuInput): IkukyuResult {
  const wage = Math.max(0, Math.round(input.monthlyWage));
  const months = Math.max(0, Math.round(input.months));

  // 1か月（30日）あたりの支給額（＝賃金日額×30×支給率 ≒ 月給×支給率）に上限を適用
  const monthly67 = Math.min(Math.round(wage * 0.67), CAP_67);
  const monthly50 = Math.min(Math.round(wage * 0.5), CAP_50);

  const months67 = Math.min(months, DAYS_67 / 30); // 最大6か月
  const months50 = Math.max(0, months - months67);

  const total = Math.round(monthly67 * months67 + monthly50 * months50);
  const capped = wage * 0.67 > CAP_67;

  return { monthly67, monthly50, months67, months50, total, capped };
}
