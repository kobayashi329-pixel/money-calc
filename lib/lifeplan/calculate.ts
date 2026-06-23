// =============================================================
//  ライフプラン表（生涯キャッシュフロー）— 計算ロジック（純粋関数）
//  現在から想定寿命まで、1年ごとの「収入・支出・年間収支・貯蓄残高」を
//  シミュレーションし、貯蓄が尽きる年齢（あれば）を求める。
//
//  各年の計算:
//    収入 ＝ 現役は手取り年収（昇給率で増加）、退職後は年金などの収入
//    支出 ＝ 現役/退職後の年間支出（インフレ率で増加）＋ その年のライフイベント支出
//    貯蓄残高 ＝ 前年残高 ×（1＋運用利回り）＋（収入 − 支出）
//
//  ※ 公的な前提値ではなく、利用者の入力に対する将来予測（概算）。
// =============================================================
import type { LifePlanInput, LifePlanResult, LifePlanRow } from "./types";

export function calculateLifePlan(input: LifePlanInput): LifePlanResult {
  const currentAge = Math.max(0, Math.round(input.currentAge));
  const untilAge = Math.max(currentAge, Math.round(input.untilAge));
  const retireAge = Math.max(currentAge, Math.round(input.retireAge));
  const baseYear = Math.round(input.currentYear);

  const g = input.incomeGrowthPercent / 100; // 昇給率
  const inf = input.expenseInflationPercent / 100; // インフレ率
  const r = input.savingRatePercent / 100; // 運用利回り

  const rows: LifePlanRow[] = [];
  let balance = Math.round(input.currentSavings);
  let depletionAge: number | null = null;
  let minBalance = balance;
  let peakBalance = balance;

  for (let age = currentAge; age <= untilAge; age++) {
    const t = age - currentAge; // 経過年数
    const isWorking = age < retireAge;

    const income = isWorking
      ? Math.round(input.annualIncome * Math.pow(1 + g, t))
      : Math.round(input.pensionAnnual);

    const baseExpense = isWorking ? input.annualExpense : input.retireExpense;
    const eventExpense = input.events
      .filter((e) => e.age === age)
      .reduce((s, e) => s + Math.max(0, Math.round(e.amount)), 0);
    const expense = Math.round(baseExpense * Math.pow(1 + inf, t)) + eventExpense;

    const net = income - expense;
    // 前年残高を運用してから当年の収支を反映
    balance = Math.round(balance * (1 + r) + net);

    if (balance < 0 && depletionAge === null) depletionAge = age;
    if (balance < minBalance) minBalance = balance;
    if (balance > peakBalance) peakBalance = balance;

    rows.push({ age, year: baseYear + t, income, expense, net, balance });
  }

  return {
    rows,
    finalBalance: balance,
    depletionAge,
    minBalance,
    peakBalance,
  };
}
