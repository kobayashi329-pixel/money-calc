// 老後資金シミュレーションの型定義（金額はすべて「円」単位）

export interface RougoInput {
  /** 現在の年齢（歳） */
  currentAge: number;
  /** 退職（リタイア）する年齢（歳） */
  retireAge: number;
  /** 何歳まで生きると想定するか（歳） */
  untilAge: number;
  /** 老後の毎月の生活費（円） */
  monthlyExpense: number;
  /** 老後の毎月の年金収入（円） */
  monthlyPension: number;
  /** 現在の貯蓄額（円） */
  currentSavings: number;
  /** 退職金の見込み額（円） */
  retirementAllowance: number;
  /** 介護・住宅修繕などの特別支出の予備費（円） */
  specialReserve: number;
  /** 退職までの貯蓄・運用の想定利回り（年率・%） */
  savingRatePercent: number;
}

export interface RougoResult {
  /** 退職までの年数 */
  yearsUntilRetire: number;
  /** 老後の年数（退職〜想定寿命） */
  retirementYears: number;
  /** 老後の毎月の不足額（支出 − 年金、下限0） */
  monthlyGap: number;
  /** 退職時に必要な老後資金（不足の総額＋特別支出予備費） */
  totalNeeded: number;
  /** 現在の貯蓄を退職まで運用した将来価値 */
  grownSavings: number;
  /** 退職金の見込み額 */
  retirementAllowance: number;
  /** 退職時の準備見込み（運用後の貯蓄＋退職金） */
  preparedAtRetire: number;
  /** 退職時点での不足額（必要額 − 準備見込み、下限0） */
  shortfall: number;
  /** 準備が必要額を上回る場合の余剰額 */
  surplus: number;
  /** 不足を埋めるために退職まで毎月積み立てる必要がある額（想定利回り考慮） */
  requiredMonthlySaving: number;
  /** 準備見込みだけで必要額に達しているか */
  isCovered: boolean;
}
