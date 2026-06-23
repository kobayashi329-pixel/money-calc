// =============================================================
//  消費税・インボイス計算機 — 計算ロジック（純粋関数）
//  税抜⇔税込の変換と、消費税額の端数処理に対応する。
//  軽減税率8%（飲食料品・新聞）と標準税率10%を選べる。
//  インボイス制度では「1つのインボイスにつき、税率ごとに1回」端数処理する
//  のが原則。端数処理の方法（切捨・四捨五入・切上）は事業者が選べるため、
//  本ツールでも選択できるようにする。
//  出典:
//    国税庁 消費税のしくみ https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6101.htm
//    国税庁 インボイス制度（適格請求書等保存方式） https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice.htm
// =============================================================

/** 端数処理の方法 */
export type RoundMode = "floor" | "round" | "ceil";
// floor=切り捨て / round=四捨五入 / ceil=切り上げ

/** 計算の向き */
export type Direction = "addTax" | "removeTax";
// addTax    = 税抜から税込を求める
// removeTax = 税込から税抜を求める

export interface ShohizeiInput {
  /** 入力金額（円） */
  amount: number;
  /** 消費税率（%）。8 または 10。 */
  ratePercent: number;
  /** 計算の向き */
  direction: Direction;
  /** 端数処理の方法 */
  rounding: RoundMode;
}

export interface ShohizeiResult {
  /** 税抜金額 */
  net: number;
  /** 消費税額 */
  tax: number;
  /** 税込金額 */
  gross: number;
  /** 適用税率（%） */
  ratePercent: number;
}

function applyRound(value: number, mode: RoundMode): number {
  if (mode === "floor") return Math.floor(value);
  if (mode === "ceil") return Math.ceil(value);
  return Math.round(value);
}

export function calculateShohizei(input: ShohizeiInput): ShohizeiResult {
  const amount = Math.max(0, Math.round(input.amount));
  const rate = input.ratePercent / 100;

  let net: number;
  let gross: number;
  let tax: number;

  if (input.direction === "addTax") {
    // 税抜 → 税込: 消費税は税抜額 × 税率を端数処理
    net = amount;
    tax = applyRound(net * rate, input.rounding);
    gross = net + tax;
  } else {
    // 税込 → 税抜: 税抜額 = 税込 ÷ (1+税率) を端数処理し、消費税は差額
    gross = amount;
    net = applyRound(gross / (1 + rate), input.rounding);
    tax = gross - net;
  }

  return { net, tax, gross, ratePercent: input.ratePercent };
}
