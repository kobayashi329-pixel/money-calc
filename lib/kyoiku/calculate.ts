// =============================================================
//  教育資金シミュレーション — 計算ロジック（純粋関数）
//  子どもの進路（公立／私立）を段階ごとに選び、教育費の総額を積み上げる。
//  さらに、まとまった資金が必要な「大学費用」を、子が18歳になるまでに
//  毎月いくら積み立てれば用意できるかを複利で逆算する。
// =============================================================
import { STAGE_COSTS, STAGE_LABELS, CHOICE_LABELS, UNIVERSITY_START_AGE } from "./constants";
import type { KyoikuInput, KyoikuResult } from "./types";

/** 毎月1円ずつ積み立てたときの終価係数（期末払い）＝((1+r)^n − 1)/r */
function annuityFactor(monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return months;
  return (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
}

export function calculateKyoiku(input: KyoikuInput): KyoikuResult {
  const stages = [
    { key: "kindergarten", choice: input.kindergarten },
    { key: "elementary", choice: input.elementary },
    { key: "juniorHigh", choice: input.juniorHigh },
    { key: "highSchool", choice: input.highSchool },
    { key: "university", choice: input.university },
  ].map(({ key, choice }) => {
    const table = STAGE_COSTS[key as keyof typeof STAGE_COSTS] as Record<string, number>;
    const cost = table[choice] ?? 0;
    return {
      key,
      name: STAGE_LABELS[key],
      choice,
      choiceLabel: CHOICE_LABELS[choice] ?? choice,
      cost,
    };
  });

  const total = stages.reduce((s, st) => s + st.cost, 0);
  const universityCost =
    (STAGE_COSTS.university as Record<string, number>)[input.university] ?? 0;

  // 大学入学（18歳）までに大学費用を貯めるための毎月の積立額
  const childAge = Math.max(0, Math.round(input.childAge));
  const monthsUntilUniversity = Math.max(0, (UNIVERSITY_START_AGE - childAge) * 12);
  const r = input.savingRatePercent / 100 / 12;
  const factor = annuityFactor(r, monthsUntilUniversity);
  const requiredMonthlyForUniversity =
    universityCost > 0 && factor > 0 ? Math.round(universityCost / factor) : 0;

  return {
    stages,
    total,
    universityCost,
    monthsUntilUniversity,
    requiredMonthlyForUniversity,
  };
}
