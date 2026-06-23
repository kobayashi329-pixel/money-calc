// =============================================================
//  老後資金シミュレーション — 計算ロジック（純粋関数）
//  「退職時にいくら必要か（老後資金）」と「不足を埋めるには今から毎月
//  いくら積み立てればよいか」を求める、ライフプランの中心ツール。
//
//  考え方（老後資金ギャップ）:
//    退職時に必要な額
//      ＝（毎月の支出 − 毎月の年金収入）× 12 × 老後の年数 ＋ 特別支出の予備費
//    退職時の準備見込み
//      ＝ 現在の貯蓄を退職まで運用した額 ＋ 退職金見込み
//    不足額 ＝ 必要な額 − 準備見込み
//    毎月の必要積立額 ＝ 不足額を「退職までの期間・想定利回り」で逆算
//
//  ※ 公的データに基づく前提値ではなく、利用者の入力に対する試算。
//    物価上昇（インフレ）や年金額の将来変動は考慮しない簡易版。
// =============================================================
import type { RougoInput, RougoResult } from "./types";

/** 一時金を月複利で months ヶ月運用した将来価値 */
function futureValueLump(present: number, monthlyRate: number, months: number): number {
  if (months <= 0) return present;
  return present * Math.pow(1 + monthlyRate, months);
}

/** 毎月1円ずつ積み立てたときの終価係数（期末払い）＝((1+r)^n − 1)/r */
function annuityFactor(monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return months;
  return (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
}

export function calculateRougo(input: RougoInput): RougoResult {
  const currentAge = Math.max(0, Math.round(input.currentAge));
  const retireAge = Math.max(currentAge, Math.round(input.retireAge));
  const untilAge = Math.max(retireAge, Math.round(input.untilAge));

  const yearsUntilRetire = retireAge - currentAge;
  const retirementYears = untilAge - retireAge;
  const monthsUntilRetire = yearsUntilRetire * 12;

  const monthlyExpense = Math.max(0, Math.round(input.monthlyExpense));
  const monthlyPension = Math.max(0, Math.round(input.monthlyPension));
  const monthlyGap = Math.max(0, monthlyExpense - monthlyPension);

  const specialReserve = Math.max(0, Math.round(input.specialReserve));
  // 退職時に必要な老後資金
  const totalNeeded = monthlyGap * 12 * retirementYears + specialReserve;

  // 退職時の準備見込み（現在の貯蓄を運用＋退職金）
  const r = input.savingRatePercent / 100 / 12;
  const currentSavings = Math.max(0, Math.round(input.currentSavings));
  const retirementAllowance = Math.max(0, Math.round(input.retirementAllowance));
  const grownSavings = Math.round(futureValueLump(currentSavings, r, monthsUntilRetire));
  const preparedAtRetire = grownSavings + retirementAllowance;

  // 不足額と、それを埋める毎月の積立額
  const shortfall = Math.max(0, totalNeeded - preparedAtRetire);
  const surplus = Math.max(0, preparedAtRetire - totalNeeded);
  const factor = annuityFactor(r, monthsUntilRetire);
  const requiredMonthlySaving =
    shortfall > 0 && factor > 0 ? Math.round(shortfall / factor) : 0;

  return {
    yearsUntilRetire,
    retirementYears,
    monthlyGap,
    totalNeeded,
    grownSavings,
    retirementAllowance,
    preparedAtRetire,
    shortfall,
    surplus,
    requiredMonthlySaving,
    isCovered: shortfall === 0,
  };
}
