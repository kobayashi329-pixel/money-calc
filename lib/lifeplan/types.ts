// ライフプラン表（生涯キャッシュフロー）の型定義（金額はすべて「円」単位）

/** 特定の年齢にかかる一時的な大型支出（住宅購入・車・リフォームなど） */
export interface LifeEvent {
  /** 発生する年齢（歳） */
  age: number;
  /** 金額（円） */
  amount: number;
  /** 表示用ラベル（任意） */
  label?: string;
}

export interface LifePlanInput {
  /** 現在の年齢（歳） */
  currentAge: number;
  /** 何歳まで試算するか（想定寿命・歳） */
  untilAge: number;
  /** 退職（リタイア）する年齢（歳） */
  retireAge: number;
  /** 試算の起点となる西暦（表のため。計算結果には影響しない） */
  currentYear: number;

  /** 現役時代の年間手取り収入（円） */
  annualIncome: number;
  /** 昇給率（年率・%） */
  incomeGrowthPercent: number;
  /** 退職後の年間収入（年金など・円） */
  pensionAnnual: number;

  /** 現役時代の年間支出（円） */
  annualExpense: number;
  /** 退職後の年間支出（円） */
  retireExpense: number;
  /** 支出のインフレ率（年率・%） */
  expenseInflationPercent: number;

  /** 現在の貯蓄額（円） */
  currentSavings: number;
  /** 貯蓄・運用の利回り（年率・%） */
  savingRatePercent: number;

  /** ライフイベント（一時的な大型支出） */
  events: LifeEvent[];
}

/** 1年分のキャッシュフロー */
export interface LifePlanRow {
  age: number;
  year: number;
  income: number;
  expense: number;
  /** 年間収支（収入 − 支出） */
  net: number;
  /** 年末の貯蓄残高 */
  balance: number;
}

export interface LifePlanResult {
  rows: LifePlanRow[];
  /** 最終的な貯蓄残高（想定寿命時点） */
  finalBalance: number;
  /** 貯蓄が底をつく年齢（マイナスになる最初の年齢）。尽きなければ null。 */
  depletionAge: number | null;
  /** 期間中の最低残高 */
  minBalance: number;
  /** 期間中の最高残高 */
  peakBalance: number;
}
