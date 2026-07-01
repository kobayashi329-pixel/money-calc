// =============================================================
//  ボーナス（賞与）手取り計算ロジック（純粋関数）
//  賞与の手取り = 賞与総支給額 − 社会保険料（本人負担） − 所得税（源泉徴収）
//
//  ● 社会保険料（本人負担）
//    標準賞与額（賞与総支給額の1,000円未満切捨て）に料率を乗じ、労使折半。
//      - 健康保険・介護保険: 標準賞与額の年度累計上限 573万円（4/1〜翌3/31）
//      - 厚生年金保険:       標準賞与額は1か月あたり上限 150万円
//      - 雇用保険:           実際の賞与額に本人負担料率を乗じる（上限なし）
//    出典: 日本年金機構「賞与にかかる保険料」/ 協会けんぽ / 厚生労働省
//
//  ● 所得税（源泉徴収）
//    賞与の源泉徴収税額 = (賞与額 − 賞与の社会保険料) × 算出率
//    算出率は「前月の社会保険料等控除後の給与等の金額」と「扶養親族等の数」で決まる。
//    出典: 国税庁「賞与に対する源泉徴収税額の算出率の表（令和8年分）」甲欄
//          https://www.nta.go.jp/publication/pamph/gensen/zeigakuhyo2026/data/15-16.pdf
//    ※ 表の率には復興特別所得税（2.1%）が織り込まれている。
//    ※ 住民税は賞与から源泉徴収されない（前年所得ベースで毎月の給与から徴収）。
//       このツールの「手取り」に住民税は含めない。
// =============================================================
import {
  HEALTH_INSURANCE_RATE_EMPLOYEE,
  LONG_TERM_CARE_RATE_EMPLOYEE,
  PENSION_RATE_EMPLOYEE,
  EMPLOYMENT_INSURANCE_RATE_EMPLOYEE,
  LONG_TERM_CARE_AGE_MIN,
  LONG_TERM_CARE_AGE_MAX,
  HEALTH_MONTHLY_STANDARD_MAX,
  PENSION_MONTHLY_STANDARD_MAX,
} from "../takehome/constants-2025";
import { getPrefectureHealthRateEmployee } from "../takehome/prefectures-2025";

/** 賞与に適用する源泉徴収税額の算出率の表の適用年分（西暦） */
export const BONUS_TAX_YEAR = 2026; // 令和8年分（賞与の源泉徴収税額の算出率の表）

/** 標準賞与額の上限（健康保険・介護保険：年度累計 573万円） */
export const HEALTH_STANDARD_BONUS_YEAR_MAX = 5_730_000;
/** 標準賞与額の上限（厚生年金：1か月あたり 150万円） */
export const PENSION_STANDARD_BONUS_MONTH_MAX = 1_500_000;

// -------------------------------------------------------------
//  賞与に対する源泉徴収税額の算出率の表（令和8年分・甲欄）
//  各行 = [賞与の金額に乗ずべき率(%), 扶養0〜7人ごとの「前月の社会保険料等
//         控除後の給与等の金額」の上限（未満・千円単位）]
//  afterSocial（円）がその行の上限（×1000）未満なら、その率を適用する。
//  最終行（45.945%）は上限なし（Infinity）。
// -------------------------------------------------------------
const RATE_ROWS: { rate: number; limitsSenYen: number[] }[] = [
  { rate: 0.0, limitsSenYen: [82, 107, 143, 181, 218, 251, 284, 317] },
  { rate: 2.042, limitsSenYen: [94, 250, 276, 300, 300, 304, 343, 383] },
  { rate: 4.084, limitsSenYen: [260, 289, 321, 354, 387, 412, 438, 463] },
  { rate: 6.126, limitsSenYen: [309, 346, 377, 405, 431, 457, 483, 508] },
  { rate: 8.168, limitsSenYen: [342, 373, 400, 424, 452, 479, 505, 529] },
  { rate: 10.21, limitsSenYen: [372, 401, 426, 452, 477, 503, 527, 552] },
  { rate: 12.252, limitsSenYen: [402, 430, 457, 484, 509, 531, 553, 578] },
  { rate: 14.294, limitsSenYen: [433, 463, 492, 517, 540, 564, 589, 614] },
  { rate: 16.336, limitsSenYen: [520, 520, 525, 550, 577, 604, 630, 657] },
  { rate: 18.378, limitsSenYen: [605, 621, 636, 651, 666, 681, 697, 708] },
  { rate: 20.42, limitsSenYen: [684, 705, 728, 751, 774, 798, 821, 845] },
  { rate: 22.462, limitsSenYen: [715, 739, 764, 788, 813, 838, 862, 887] },
  { rate: 24.504, limitsSenYen: [752, 778, 804, 830, 856, 881, 907, 933] },
  { rate: 26.546, limitsSenYen: [795, 821, 848, 876, 903, 930, 957, 985] },
  { rate: 28.588, limitsSenYen: [854, 882, 910, 938, 966, 994, 1022, 1051] },
  { rate: 30.63, limitsSenYen: [922, 952, 983, 1013, 1044, 1074, 1104, 1135] },
  { rate: 32.672, limitsSenYen: [1318, 1342, 1367, 1391, 1416, 1440, 1464, 1489] },
  { rate: 35.735, limitsSenYen: [1521, 1526, 1526, 1538, 1555, 1555, 1555, 1583] },
  { rate: 38.798, limitsSenYen: [2621, 2645, 2669, 2693, 2716, 2740, 2764, 2788] },
  { rate: 41.861, limitsSenYen: [3495, 3527, 3559, 3590, 3622, 3654, 3685, 3717] },
  {
    rate: 45.945,
    limitsSenYen: [
      Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity,
      Infinity,
    ],
  },
];

/**
 * 「賞与の金額に乗ずべき率」を求める（甲欄・令和8年分）。
 * @param afterSocial 前月の社会保険料等控除後の給与等の金額（円）
 * @param dependents  扶養親族等の数（0〜7。8以上は7で近似）
 * @returns 率（小数。例: 0.04084 = 4.084%）
 */
export function bonusTaxRate(afterSocial: number, dependents: number): number {
  const col = Math.min(7, Math.max(0, Math.floor(dependents)));
  const base = Math.max(0, afterSocial);
  for (const row of RATE_ROWS) {
    if (base < row.limitsSenYen[col] * 1000) {
      return row.rate / 100;
    }
  }
  return 45.945 / 100;
}

export interface BonusInput {
  /** 賞与の総支給額（額面・円） */
  bonusAmount: number;
  /** 前月の給与（額面・月給。源泉徴収の算出率の判定に使用） */
  monthlySalary: number;
  /** 年齢（介護保険＝40〜64歳の判定に使用） */
  age: number;
  /** 扶養親族等の数（0〜7） */
  dependents: number;
  /** 都道府県コード（協会けんぽ健康保険料率・任意。未指定なら東京都） */
  prefecture?: string;
  /** 今年度すでに支給された賞与の標準賞与額の累計（健保573万上限の判定・任意） */
  healthStandardBonusYtd?: number;
}

export interface BonusResult {
  /** 賞与の総支給額（額面） */
  bonusAmount: number;
  /** 標準賞与額（健康保険・介護保険用。1,000円未満切捨て・上限適用後） */
  standardBonusHealth: number;
  /** 標準賞与額（厚生年金用。1,000円未満切捨て・上限適用後） */
  standardBonusPension: number;
  /** 健康保険料（本人負担） */
  health: number;
  /** 介護保険料（40〜64歳のみ） */
  longTermCare: number;
  /** 厚生年金保険料（本人負担） */
  pension: number;
  /** 雇用保険料（本人負担） */
  employment: number;
  /** 社会保険料の合計（本人負担） */
  socialInsurance: number;
  /** 前月の社会保険料等控除後の給与等の金額（源泉率の判定に使用） */
  prevMonthAfterSocial: number;
  /** 適用した源泉徴収の算出率（小数） */
  incomeTaxRate: number;
  /** 所得税（源泉徴収額） */
  incomeTax: number;
  /** 賞与の手取り額 */
  takeHome: number;
  /** 手取り率（手取り ÷ 総支給額） */
  takeHomeRate: number;
  /** 40〜64歳（介護保険あり）か */
  hasLongTermCare: boolean;
  /** 源泉徴収の算出率の表の適用年分 */
  taxYear: number;
}

/** 前月給与から、その月の社会保険料（本人負担）を近似計算する */
function monthlySocialInsurance(
  monthlySalary: number,
  age: number,
  healthRateEmployee: number,
): number {
  const salary = Math.max(0, monthlySalary);
  const healthBase = Math.min(salary, HEALTH_MONTHLY_STANDARD_MAX);
  const pensionBase = Math.min(salary, PENSION_MONTHLY_STANDARD_MAX);
  const isCareAge = age >= LONG_TERM_CARE_AGE_MIN && age <= LONG_TERM_CARE_AGE_MAX;

  const health = Math.round(healthBase * healthRateEmployee);
  const care = isCareAge ? Math.round(healthBase * LONG_TERM_CARE_RATE_EMPLOYEE) : 0;
  const pension = Math.round(pensionBase * PENSION_RATE_EMPLOYEE);
  const employment = Math.round(salary * EMPLOYMENT_INSURANCE_RATE_EMPLOYEE);
  return health + care + pension + employment;
}

/** 賞与の手取り・社会保険料・源泉所得税を計算する。 */
export function calculateBonus(input: BonusInput): BonusResult {
  const bonusAmount = Math.max(0, Math.round(input.bonusAmount));
  const monthlySalary = Math.max(0, Math.round(input.monthlySalary));
  const age = Math.max(0, input.age);
  const healthRateEmployee = getPrefectureHealthRateEmployee(input.prefecture);
  const isCareAge = age >= LONG_TERM_CARE_AGE_MIN && age <= LONG_TERM_CARE_AGE_MAX;

  // --- 社会保険料（本人負担） ---
  // 標準賞与額（1,000円未満切捨て）
  const rawStandardBonus = Math.floor(bonusAmount / 1000) * 1000;
  // 健康保険・介護保険：年度累計 573万円の上限
  const ytd = Math.max(0, input.healthStandardBonusYtd ?? 0);
  const healthCapRemaining = Math.max(0, HEALTH_STANDARD_BONUS_YEAR_MAX - ytd);
  const standardBonusHealth = Math.min(rawStandardBonus, healthCapRemaining);
  // 厚生年金：1か月あたり 150万円の上限
  const standardBonusPension = Math.min(
    rawStandardBonus,
    PENSION_STANDARD_BONUS_MONTH_MAX,
  );

  const health = Math.round(standardBonusHealth * healthRateEmployee);
  const longTermCare = isCareAge
    ? Math.round(standardBonusHealth * LONG_TERM_CARE_RATE_EMPLOYEE)
    : 0;
  const pension = Math.round(standardBonusPension * PENSION_RATE_EMPLOYEE);
  // 雇用保険は標準賞与額でなく実際の賞与額に料率を乗じる
  const employment = Math.round(bonusAmount * EMPLOYMENT_INSURANCE_RATE_EMPLOYEE);
  const socialInsurance = health + longTermCare + pension + employment;

  // --- 所得税（源泉徴収） ---
  const prevMonthSocial = monthlySocialInsurance(
    monthlySalary,
    age,
    healthRateEmployee,
  );
  const prevMonthAfterSocial = Math.max(0, monthlySalary - prevMonthSocial);
  const incomeTaxRate = bonusTaxRate(prevMonthAfterSocial, input.dependents);
  // 課税対象 = 賞与額 − 賞与の社会保険料。源泉税額は1円未満切捨て。
  const incomeTax = Math.floor((bonusAmount - socialInsurance) * incomeTaxRate);

  const takeHome = bonusAmount - socialInsurance - incomeTax;

  return {
    bonusAmount,
    standardBonusHealth,
    standardBonusPension,
    health,
    longTermCare,
    pension,
    employment,
    socialInsurance,
    prevMonthAfterSocial,
    incomeTaxRate,
    incomeTax,
    takeHome,
    takeHomeRate: bonusAmount > 0 ? takeHome / bonusAmount : 0,
    hasLongTermCare: longTermCare > 0,
    taxYear: BONUS_TAX_YEAR,
  };
}
