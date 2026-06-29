// =============================================================
//  自動車税（種別割）計算ロジック（純粋関数）
//  自家用乗用車の年税額を、総排気量・初度登録時期・経過年数（重課）から求める。
//
//  ・普通自動車（自家用乗用）：総排気量の区分で税額が決まる。
//    2019年10月1日以降に新規登録した車は引き下げ後の新税率。
//  ・軽自動車（自家用乗用）：定額。2015年4月以降の新規検査は10,800円。
//  ・グリーン化特例による経年重課：
//    ガソリン/LP車は新規登録から13年超、ディーゼル車は11年超で約15%重課。
//    （EV・ハイブリッド等は重課の対象外）
//
//  出典:
//    総務省 地方税制度（自動車税種別割）
//    各都道府県の自動車税種別割の税率表（令和）
//  ※ 税額は標準税率。自治体・年度・車種で異なる場合がある。
// =============================================================

export type CarType = "normal" | "kei";
export type RegistrationEra = "new" | "old"; // new: 2019年10月以降 / old: 2019年9月以前

export interface JidoshazeiInput {
  carType: CarType;
  /** 総排気量（cc）。普通車のみ使用。 */
  displacementCc: number;
  /** 初度登録の時期（普通車の新旧税率の判定）。 */
  era: RegistrationEra;
  /** 経年重課の対象か（ガソリン車13年超／ディーゼル車11年超）。 */
  heavyTax: boolean;
}

export interface JidoshazeiResult {
  carType: CarType;
  displacementCc: number;
  /** 排気量区分のラベル（例: "1,500cc超〜2,000cc以下"） */
  bandLabel: string;
  /** 経年重課が適用されたか */
  heavyTaxApplied: boolean;
  /** 標準税率（重課前）の年税額 */
  baseTax: number;
  /** 実際の年税額（重課込み） */
  annualTax: number;
}

/** 排気量区分（cc上限, 新税率, 旧税率, ラベル） */
interface Band {
  maxCc: number;
  newTax: number;
  oldTax: number;
  label: string;
}

// 自家用乗用車（普通自動車）の税額表
export const NORMAL_BANDS: Band[] = [
  { maxCc: 1000, newTax: 25_000, oldTax: 29_500, label: "1,000cc以下" },
  { maxCc: 1500, newTax: 30_500, oldTax: 34_500, label: "1,000cc超〜1,500cc以下" },
  { maxCc: 2000, newTax: 36_000, oldTax: 39_500, label: "1,500cc超〜2,000cc以下" },
  { maxCc: 2500, newTax: 43_500, oldTax: 45_000, label: "2,000cc超〜2,500cc以下" },
  { maxCc: 3000, newTax: 50_000, oldTax: 51_000, label: "2,500cc超〜3,000cc以下" },
  { maxCc: 3500, newTax: 57_000, oldTax: 58_000, label: "3,000cc超〜3,500cc以下" },
  { maxCc: 4000, newTax: 65_500, oldTax: 66_500, label: "3,500cc超〜4,000cc以下" },
  { maxCc: 4500, newTax: 75_500, oldTax: 76_500, label: "4,000cc超〜4,500cc以下" },
  { maxCc: 6000, newTax: 87_000, oldTax: 88_000, label: "4,500cc超〜6,000cc以下" },
  { maxCc: Infinity, newTax: 110_000, oldTax: 111_000, label: "6,000cc超" },
];

/** 軽自動車（自家用乗用）の税額 */
export const KEI_STANDARD = 10_800; // 2015年4月以降の新規検査
export const KEI_HEAVY = 12_900; // 13年超の経年重課

function findBand(cc: number): Band {
  const c = Math.max(0, cc);
  return NORMAL_BANDS.find((b) => c <= b.maxCc) ?? NORMAL_BANDS[NORMAL_BANDS.length - 1];
}

export function calculateJidoshazei(input: JidoshazeiInput): JidoshazeiResult {
  if (input.carType === "kei") {
    const baseTax = KEI_STANDARD;
    const annualTax = input.heavyTax ? KEI_HEAVY : baseTax;
    return {
      carType: "kei",
      displacementCc: 0,
      bandLabel: "軽自動車（自家用乗用）",
      heavyTaxApplied: input.heavyTax,
      baseTax,
      annualTax,
    };
  }

  const band = findBand(input.displacementCc);
  const baseTax = input.era === "new" ? band.newTax : band.oldTax;

  // 経年重課は概ね旧税率の約15%増（100円未満切り捨て）
  const annualTax = input.heavyTax
    ? Math.floor((band.oldTax * 1.15) / 100) * 100
    : baseTax;

  return {
    carType: "normal",
    displacementCc: input.displacementCc,
    bandLabel: band.label,
    heavyTaxApplied: input.heavyTax,
    baseTax,
    annualTax,
  };
}
