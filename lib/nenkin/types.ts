// 公的年金 受給見込み額シミュレーションの型定義（金額はすべて「円」単位）

export interface NenkinInput {
  /** 国民年金（基礎年金）の保険料納付年数（20〜60歳・最大40年） */
  kisoYears: number;
  /** 厚生年金の加入年数（会社員・公務員だった年数） */
  kouseiYears: number;
  /** 厚生年金加入中の平均年収（賞与込み・円） */
  avgAnnualIncome: number;
  /** 受給開始年齢（60〜75歳） */
  startAge: number;
}

export interface NenkinResult {
  /** 受給開始年齢 */
  startAge: number;
  /** 受給開始年齢による増減率（1.0が65歳基準） */
  factor: number;

  /** 65歳基準の老齢基礎年金（年額） */
  basicAnnualAt65: number;
  /** 65歳基準の老齢厚生年金（年額） */
  koseiAnnualAt65: number;
  /** 65歳基準の合計（年額） */
  totalAnnualAt65: number;

  /** 受給開始年齢を反映した老齢基礎年金（年額） */
  basicAnnual: number;
  /** 受給開始年齢を反映した老齢厚生年金（年額） */
  koseiAnnual: number;
  /** 受給開始年齢を反映した合計（年額） */
  totalAnnual: number;
  /** 合計の月額目安 */
  totalMonthly: number;
}
