// =============================================================
//  積立の複利計算エンジン（NISA・iDeCo 共通）
//  毎月一定額を積み立て、年利を月複利で運用した場合の将来評価額を求める。
//  純粋関数・副作用なし。月末に積立（期末払い）として計算する。
// =============================================================

export interface AccumulationInput {
  /** 毎月の積立額（円） */
  monthlyContribution: number;
  /** 想定利回り（年率・%）。例: 5 → 5% */
  annualRatePercent: number;
  /** 積立期間（年） */
  years: number;
}

/** 年ごとの資産推移（グラフ用） */
export interface YearlyAsset {
  /** 経過年（1〜years） */
  year: number;
  /** 元本累計（円） */
  principal: number;
  /** 評価額（元本＋運用益、円） */
  total: number;
  /** 運用益（円） */
  gain: number;
}

export interface AccumulationResult {
  /** 積立月数 */
  months: number;
  /** 元本の合計（毎月の積立額 × 月数） */
  totalPrincipal: number;
  /** 最終評価額（円） */
  finalValue: number;
  /** 運用益（最終評価額 − 元本、円） */
  totalGain: number;
  /** 年ごとの推移 */
  yearly: YearlyAsset[];
}

/**
 * 積立の複利計算。月末に積立額を入れ、毎月 (年利/12) で増やす。
 */
export function accumulate(input: AccumulationInput): AccumulationResult {
  const monthly = Math.max(0, input.monthlyContribution);
  const months = Math.max(0, Math.round(input.years * 12));
  const monthlyRate = input.annualRatePercent / 100 / 12;

  let balance = 0;
  let principal = 0;
  const yearly: YearlyAsset[] = [];

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthly;
    principal += monthly;

    if (m % 12 === 0 || m === months) {
      const total = Math.round(balance);
      const principalRounded = Math.round(principal);
      yearly.push({
        year: Math.ceil(m / 12),
        principal: principalRounded,
        total,
        gain: total - principalRounded,
      });
    }
  }

  const totalPrincipal = Math.round(principal);
  const finalValue = Math.round(balance);
  return {
    months,
    totalPrincipal,
    finalValue,
    totalGain: finalValue - totalPrincipal,
    yearly,
  };
}
