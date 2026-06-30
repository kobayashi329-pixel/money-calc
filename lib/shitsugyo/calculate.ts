// =============================================================
//  失業保険（雇用保険の基本手当）計算ロジック（純粋関数）
//  基本手当の総額 ＝ 基本手当日額 × 所定給付日数
//   ・基本手当日額 ＝ 賃金日額 × 給付率（賃金が低いほど高率）
//     賃金日額 ＝ 離職前6か月の賃金総額 ÷ 180（＝平均月給 ÷ 30の目安）
//     給付率は50〜80%（60〜64歳は45〜80%）。年齢別の上限額・下限額あり。
//   ・所定給付日数は「離職理由 × 被保険者期間 × 年齢」で決まる。
//  出典: ハローワーク「基本手当について」、厚生労働省「雇用保険の基本手当日額の変更」
//        （令和7年8月1日改定の上限額・下限額を反映）
//        https://www.hellowork.mhlw.go.jp/insurance/insurance_benefitdays.html
//        https://www.mhlw.go.jp/stf/newpage_59748.html
//  ※賃金日額の区分（給付率の逓減境界）は毎年8月に改定される概算値。
// =============================================================

export type LeaveReason = "self" | "company";

// ---- 令和7年8月1日〜 の定数 ----
/** 基本手当日額の下限額（全年齢）。1,055×20÷7×0.8＝2,411 */
export const BENEFIT_DAILY_MIN = 2_411;
/** 賃金日額の下限額（基本手当日額下限 ÷ 0.8） */
export const WAGE_DAILY_MIN = 3_014;

/** 離職時年齢区分ごとの基本手当日額の上限額（令和7年8月1日〜） */
interface AgeCap {
  /** この年齢「未満」 */
  under: number;
  benefitMax: number;
}
export const BENEFIT_DAILY_MAX: AgeCap[] = [
  { under: 30, benefitMax: 7_255 },
  { under: 45, benefitMax: 8_055 },
  { under: 60, benefitMax: 8_870 },
  { under: 65, benefitMax: 7_623 },
  { under: Infinity, benefitMax: 7_623 },
];

// 給付率の逓減境界（令和7年8月時点の概算・賃金日額）。
// 給付率 = 0.8 −（0.8−下限率）×(w − R80)/(R50 − R80)
const RANGE_80_UPPER = 5_110; // これ以下は給付率80%
const RANGE_50_LOWER = 12_580; // これ以上は給付率（下限）

function ageBenefitMax(age: number): number {
  return BENEFIT_DAILY_MAX.find((a) => age < a.under)!.benefitMax;
}

/** 賃金日額 → 給付率（60歳未満は50〜80%、60〜64歳は45〜80%） */
function benefitRate(wageDaily: number, age: number): number {
  const lower = age >= 60 && age < 65 ? 0.45 : 0.5;
  if (wageDaily <= RANGE_80_UPPER) return 0.8;
  if (wageDaily >= RANGE_50_LOWER) return lower;
  const t = (wageDaily - RANGE_80_UPPER) / (RANGE_50_LOWER - RANGE_80_UPPER);
  return 0.8 - (0.8 - lower) * t;
}

// ---- 所定給付日数 ----
// 一般の受給資格者（自己都合・定年など）: 被保険者期間のみで決まる
function daysSelf(insuredYears: number): number {
  if (insuredYears < 1) return 0; // 原則1年以上必要
  if (insuredYears < 10) return 90;
  if (insuredYears < 20) return 120;
  return 150;
}

// 特定受給資格者・特定理由離職者（会社都合など）: 年齢 × 被保険者期間
// 行 = 年齢区分、列 = [1年未満, 1-5, 5-10, 10-20, 20年以上]
const COMPANY_DAYS: { under: number; days: number[] }[] = [
  { under: 30, days: [90, 90, 120, 180, 180] },
  { under: 35, days: [90, 120, 180, 210, 240] },
  { under: 45, days: [90, 150, 180, 240, 270] },
  { under: 60, days: [90, 180, 240, 270, 330] },
  { under: 65, days: [90, 150, 180, 210, 240] },
  { under: Infinity, days: [90, 150, 180, 210, 240] },
];

function periodIndex(insuredYears: number): number {
  if (insuredYears < 1) return 0;
  if (insuredYears < 5) return 1;
  if (insuredYears < 10) return 2;
  if (insuredYears < 20) return 3;
  return 4;
}

function daysCompany(age: number, insuredYears: number): number {
  const row = COMPANY_DAYS.find((r) => age < r.under)!;
  return row.days[periodIndex(insuredYears)];
}

export interface ShitsugyoInput {
  /** 離職時の年齢 */
  age: number;
  /** 離職前6か月の平均月給（賞与を除く・額面） */
  monthlyWage: number;
  /** 雇用保険の被保険者であった期間（年） */
  insuredYears: number;
  /** 離職理由 */
  reason: LeaveReason;
}

export interface ShitsugyoResult {
  /** 賃金日額 */
  wageDaily: number;
  /** 給付率 */
  rate: number;
  /** 基本手当日額（上限・下限適用後・1円未満切捨て） */
  benefitDaily: number;
  /** 所定給付日数 */
  days: number;
  /** 受給総額の目安 */
  total: number;
  /** 自己都合の給付制限（月） */
  restrictionMonths: number;
}

export function calculateShitsugyo(input: ShitsugyoInput): ShitsugyoResult {
  const age = Math.max(0, Math.floor(input.age));
  const insuredYears = Math.max(0, input.insuredYears);

  // 賃金日額（下限・上限の年齢別賃金日額は省略し、基本手当日額側で上限を適用）
  const wageDaily = Math.max(WAGE_DAILY_MIN, input.monthlyWage / 30);
  const rate = benefitRate(wageDaily, age);

  const benefitDailyRaw = Math.floor(wageDaily * rate);
  const benefitDaily = Math.min(
    Math.max(benefitDailyRaw, BENEFIT_DAILY_MIN),
    ageBenefitMax(age),
  );

  const days =
    input.reason === "company"
      ? daysCompany(age, insuredYears)
      : daysSelf(insuredYears);

  return {
    wageDaily: Math.round(wageDaily),
    rate,
    benefitDaily,
    days,
    total: benefitDaily * days,
    restrictionMonths: input.reason === "self" ? 2 : 0,
  };
}
