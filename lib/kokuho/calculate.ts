// =============================================================
//  国民健康保険料 計算ロジック（純粋関数・標準モデル）
//  国保料 ＝ 医療分 ＋ 後期高齢者支援金分 ＋ 介護分（40〜64歳）
//    各分 ＝ 所得割（(前年の総所得等 − 基礎控除43万)× 所得割率）＋ 均等割（加入人数 × 額）
//         → 各分ごとに賦課限度額を上限、100円未満切捨て
//  ※料率・均等割額・限度額は自治体で大きく異なる。
//    既定は「標準モデル（東京23区・令和6〜7年度の統一料率）」。ユーザーが自治体の値に変更可。
//  出典: 東京都保健医療局「特別区国民健康保険料率」、各区の国民健康保険のご案内
//        https://www.hokeniryo.metro.tokyo.lg.jp/kenkou/kokuho
// =============================================================

export interface KokuhoRates {
  /** 医療分（基礎賦課分） */
  iryoRate: number;
  iryoPerCapita: number;
  iryoMax: number;
  /** 後期高齢者支援金分 */
  shienRate: number;
  shienPerCapita: number;
  shienMax: number;
  /** 介護分（40〜64歳） */
  kaigoRate: number;
  kaigoPerCapita: number;
  kaigoMax: number;
  /** 所得割の基礎控除 */
  deduction: number;
}

/** 標準モデル（東京23区・令和6〜7年度の統一料率） */
export const STANDARD_RATES: KokuhoRates = {
  iryoRate: 0.0771,
  iryoPerCapita: 47_300,
  iryoMax: 650_000,
  shienRate: 0.0269,
  shienPerCapita: 16_800,
  shienMax: 240_000,
  kaigoRate: 0.0242,
  kaigoPerCapita: 16_200,
  kaigoMax: 170_000,
  deduction: 430_000,
};

export interface KokuhoInput {
  /** 前年の総所得金額等（給与なら給与所得、自営業なら事業所得＝売上−経費） */
  income: number;
  /** 国保の加入人数（世帯） */
  members: number;
  /** うち40〜64歳（介護保険第2号）の人数 */
  kaigoMembers: number;
  /** 料率（省略時は標準モデル） */
  rates?: Partial<KokuhoRates>;
}

export interface KokuhoResult {
  /** 所得割の算定基礎（所得 − 基礎控除） */
  base: number;
  iryo: number;
  shien: number;
  kaigo: number;
  /** 年間の保険料合計 */
  total: number;
  /** 月あたり（年額÷12・参考） */
  monthly: number;
}

const floor100 = (n: number) => Math.floor(n / 100) * 100;

export function calculateKokuho(input: KokuhoInput): KokuhoResult {
  const r = { ...STANDARD_RATES, ...(input.rates ?? {}) };
  const members = Math.max(0, Math.floor(input.members));
  const kaigo = Math.max(0, Math.floor(input.kaigoMembers));
  const base = Math.max(0, Math.round(input.income) - r.deduction);

  const iryo = floor100(Math.min(base * r.iryoRate + members * r.iryoPerCapita, r.iryoMax));
  const shien = floor100(Math.min(base * r.shienRate + members * r.shienPerCapita, r.shienMax));
  // 介護分：40〜64歳の加入者がいる場合のみ（所得割は主たる加入者の所得で近似）
  const kaigoAmt =
    kaigo > 0
      ? floor100(Math.min(base * r.kaigoRate + kaigo * r.kaigoPerCapita, r.kaigoMax))
      : 0;

  const total = iryo + shien + kaigoAmt;
  return { base, iryo, shien, kaigo: kaigoAmt, total, monthly: Math.round(total / 12) };
}
