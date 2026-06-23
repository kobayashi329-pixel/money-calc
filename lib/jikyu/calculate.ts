// =============================================================
//  時給・月給・年収 換算機 — 計算ロジック（純粋関数）
//  時給・日給・月給・年収を相互に換算する。
//  関係式（1日の労働時間 h、1ヶ月の労働日数 d）:
//    日給 = 時給 × h
//    月給 = 日給 × d
//    年収 = 月給 × 12
//  いずれか1つの値から、共通の基準（年額）に直してから他を導出する。
// =============================================================

/** 入力する金額の種類 */
export type WageUnit = "hourly" | "daily" | "monthly" | "annual";

export interface JikyuInput {
  /** 入力金額（円） */
  value: number;
  /** 入力金額の種類 */
  unit: WageUnit;
  /** 1日の労働時間（時間） */
  hoursPerDay: number;
  /** 1ヶ月の労働日数（日） */
  daysPerMonth: number;
}

export interface JikyuResult {
  /** 時給（円） */
  hourly: number;
  /** 日給（円） */
  daily: number;
  /** 月給（円） */
  monthly: number;
  /** 年収（円） */
  annual: number;
  /** 換算に用いた1日の労働時間 */
  hoursPerDay: number;
  /** 換算に用いた1ヶ月の労働日数 */
  daysPerMonth: number;
}

export function calculateJikyu(input: JikyuInput): JikyuResult {
  const value = Math.max(0, input.value);
  // 0除算を避けるため最低1を保証
  const h = Math.max(1, input.hoursPerDay);
  const d = Math.max(1, input.daysPerMonth);

  // いったん年額（annual）に正規化する
  let annual: number;
  switch (input.unit) {
    case "hourly":
      annual = value * h * d * 12;
      break;
    case "daily":
      annual = value * d * 12;
      break;
    case "monthly":
      annual = value * 12;
      break;
    case "annual":
    default:
      annual = value;
      break;
  }

  const monthly = annual / 12;
  const daily = monthly / d;
  const hourly = daily / h;

  return {
    hourly: Math.round(hourly),
    daily: Math.round(daily),
    monthly: Math.round(monthly),
    annual: Math.round(annual),
    hoursPerDay: h,
    daysPerMonth: d,
  };
}
