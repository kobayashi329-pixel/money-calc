// =============================================================
//  都道府県別 健康保険料率（協会けんぽ・令和7年度＝2025）
//  一般保険料率（介護分を含まない・労使合計%）。被保険者本人は半分を負担。
//  出典: 全国健康保険協会 令和7年度 都道府県毎の保険料率
//    https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r07/index.html
//  適用: 令和7年3月分（4月納付分）から。
//  ※ 介護保険料率(1.59%)・厚生年金(18.3%)・雇用保険(0.55%)は全国一律のため constants-2025.ts 側。
// =============================================================

export interface Prefecture {
  /** JIS都道府県コード（2桁） */
  code: string;
  name: string;
  /** 一般保険料率（労使合計、%）。本人負担はこの半分。 */
  healthRateTotal: number;
}

/** 既定の都道府県（東京都） */
export const DEFAULT_PREFECTURE_CODE = "13";

export const PREFECTURES: Prefecture[] = [
  { code: "01", name: "北海道", healthRateTotal: 10.31 },
  { code: "02", name: "青森県", healthRateTotal: 9.85 },
  { code: "03", name: "岩手県", healthRateTotal: 9.62 },
  { code: "04", name: "宮城県", healthRateTotal: 10.11 },
  { code: "05", name: "秋田県", healthRateTotal: 10.01 },
  { code: "06", name: "山形県", healthRateTotal: 9.75 },
  { code: "07", name: "福島県", healthRateTotal: 9.62 },
  { code: "08", name: "茨城県", healthRateTotal: 9.67 },
  { code: "09", name: "栃木県", healthRateTotal: 9.82 },
  { code: "10", name: "群馬県", healthRateTotal: 9.77 },
  { code: "11", name: "埼玉県", healthRateTotal: 9.76 },
  { code: "12", name: "千葉県", healthRateTotal: 9.79 },
  { code: "13", name: "東京都", healthRateTotal: 9.91 },
  { code: "14", name: "神奈川県", healthRateTotal: 9.92 },
  { code: "15", name: "新潟県", healthRateTotal: 9.55 },
  { code: "16", name: "富山県", healthRateTotal: 9.65 },
  { code: "17", name: "石川県", healthRateTotal: 9.88 },
  { code: "18", name: "福井県", healthRateTotal: 9.94 },
  { code: "19", name: "山梨県", healthRateTotal: 9.89 },
  { code: "20", name: "長野県", healthRateTotal: 9.69 },
  { code: "21", name: "岐阜県", healthRateTotal: 9.93 },
  { code: "22", name: "静岡県", healthRateTotal: 9.80 },
  { code: "23", name: "愛知県", healthRateTotal: 10.03 },
  { code: "24", name: "三重県", healthRateTotal: 9.99 },
  { code: "25", name: "滋賀県", healthRateTotal: 9.97 },
  { code: "26", name: "京都府", healthRateTotal: 10.03 },
  { code: "27", name: "大阪府", healthRateTotal: 10.24 },
  { code: "28", name: "兵庫県", healthRateTotal: 10.16 },
  { code: "29", name: "奈良県", healthRateTotal: 10.02 },
  { code: "30", name: "和歌山県", healthRateTotal: 10.19 },
  { code: "31", name: "鳥取県", healthRateTotal: 9.93 },
  { code: "32", name: "島根県", healthRateTotal: 9.94 },
  { code: "33", name: "岡山県", healthRateTotal: 10.17 },
  { code: "34", name: "広島県", healthRateTotal: 9.97 },
  { code: "35", name: "山口県", healthRateTotal: 10.36 },
  { code: "36", name: "徳島県", healthRateTotal: 10.47 },
  { code: "37", name: "香川県", healthRateTotal: 10.21 },
  { code: "38", name: "愛媛県", healthRateTotal: 10.18 },
  { code: "39", name: "高知県", healthRateTotal: 10.13 },
  { code: "40", name: "福岡県", healthRateTotal: 10.31 },
  { code: "41", name: "佐賀県", healthRateTotal: 10.78 },
  { code: "42", name: "長崎県", healthRateTotal: 10.41 },
  { code: "43", name: "熊本県", healthRateTotal: 10.12 },
  { code: "44", name: "大分県", healthRateTotal: 10.25 },
  { code: "45", name: "宮崎県", healthRateTotal: 10.09 },
  { code: "46", name: "鹿児島県", healthRateTotal: 10.31 },
  { code: "47", name: "沖縄県", healthRateTotal: 9.44 },
];

/** コードから都道府県を取得（無効なら既定＝東京都を返す） */
export function getPrefecture(code?: string): Prefecture {
  return (
    PREFECTURES.find((p) => p.code === code) ??
    PREFECTURES.find((p) => p.code === DEFAULT_PREFECTURE_CODE)!
  );
}

/** 健康保険料率（本人負担分・小数）。労使折半なので合計率の半分。 */
export function getPrefectureHealthRateEmployee(code?: string): number {
  return getPrefecture(code).healthRateTotal / 100 / 2;
}
