// ふるさと納税 上限額シミュレータの型定義
// すべての金額は「円」単位の整数で扱う。

/** 計算の入力 */
export interface FurusatoInput {
  /** 額面の年収（円）。給与収入の総額（賞与含む）。 */
  annualIncome: number;
  /** 年齢（歳）。介護保険（40〜64歳）の社会保険料判定に使用。 */
  age: number;
  /**
   * 配偶者控除の対象となる配偶者がいるか。
   * （専業主婦・主夫など、配偶者本人の所得が控除対象の範囲内のケースを想定。
   *   共働きで配偶者に十分な所得がある場合は「いない」を選ぶ。）
   */
  hasSpouse: boolean;
  /** 16歳以上の扶養親族の人数（配偶者を除く・一般扶養としてまとめた簡易版） */
  dependents: number;
  /**
   * 都道府県コード（協会けんぽの健康保険料率の判定に使用）。任意。
   * 社会保険料は課税所得に影響するため上限額にも僅かに効く。未指定なら東京都。
   */
  prefecture?: string;
}

/** 上限額まで寄付した場合の控除内訳（円） */
export interface FurusatoBreakdown {
  /** 寄付額（＝上限額） */
  donation: number;
  /** 自己負担額（控除されない分。通常2,000円） */
  selfPay: number;
  /** 所得税からの控除（確定申告時に還付される分） */
  incomeTaxDeduction: number;
  /** 住民税 基本分の控除（翌年度の住民税から減額） */
  residentBasicDeduction: number;
  /** 住民税 特例分の控除（翌年度の住民税から減額・所得割の20%が上限） */
  residentSpecialDeduction: number;
  /** 控除合計（＝寄付額 − 自己負担2,000円） */
  totalDeduction: number;
}

/** 計算結果のまとめ */
export interface FurusatoResult {
  /** 自己負担2,000円で済む寄付上限額の目安（円・安全側に1,000円単位で切り捨て） */
  limit: number;
  /** 切り捨て前の理論上の上限額（円） */
  limitExact: number;
  /** 住民税の所得割額（ふるさと納税控除前・調整控除後）。特例分上限の基礎。 */
  residentTaxIncomeLevy: number;
  /** 適用される所得税の限界税率（小数。例: 0.1 = 10%） */
  marginalIncomeTaxRate: number;
  /** 所得税の課税所得金額（限界税率の判定基礎・1,000円未満切捨て） */
  incomeTaxTaxableIncome: number;
  /** 上限額まで寄付した場合の控除内訳 */
  breakdown: FurusatoBreakdown;
  /** 適用年度（西暦） */
  taxYear: number;
}
