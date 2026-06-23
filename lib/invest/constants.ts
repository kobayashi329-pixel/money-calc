// =============================================================
//  投資・資産形成シリーズ 共通定数（NISA・iDeCo）
//  料率・制度値は一次情報を出典とし、改正に追従できるよう分離する。
// =============================================================

/**
 * 上場株式・投資信託の譲渡益・配当への課税率（特定口座など課税口座）。
 * 所得税15% ＋ 復興特別所得税0.315%（＝15%×2.1%）＋ 住民税5% ＝ 20.315%。
 * NISAではこの課税が非課税になる。
 * 出典: 国税庁 No.1463 株式等を譲渡したときの課税
 *   https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1463.htm
 */
export const CAPITAL_GAINS_TAX_RATE = 0.20315;

// -------------------------------------------------------------
//  新NISA（2024年〜）の非課税枠
//  出典: 金融庁 新しいNISA
//    https://www.fsa.go.jp/policy/nisa2/about/nisa2024/index.html
// -------------------------------------------------------------
/** つみたて投資枠（年間） */
export const NISA_TSUMITATE_ANNUAL = 1_200_000;
/** 成長投資枠（年間） */
export const NISA_GROWTH_ANNUAL = 2_400_000;
/** 年間投資枠の合計（つみたて＋成長） */
export const NISA_ANNUAL_TOTAL = NISA_TSUMITATE_ANNUAL + NISA_GROWTH_ANNUAL; // 3,600,000
/** 生涯の非課税保有限度額（簿価・元本ベース） */
export const NISA_LIFETIME_TOTAL = 18_000_000;
/** うち成長投資枠の上限 */
export const NISA_GROWTH_LIFETIME = 12_000_000;

// -------------------------------------------------------------
//  iDeCo（個人型確定拠出年金）の拠出限度額
//  ※ 2026年6月時点の現行値（2024年12月改正後）。
//    2027年1月からの大幅引き上げ（第1号75,000円・第2号62,000円等）は
//    本ツール公開時点では未施行のため反映しない。改正時はこの定数を更新する。
//  出典: 国民年金基金連合会 iDeCo公式 / 厚生労働省
//    https://www.ideco-koushiki.jp/guide/structure.html
// -------------------------------------------------------------
export interface IdecoCategory {
  /** 内部キー */
  key: string;
  /** 表示名 */
  label: string;
  /** 毎月の拠出限度額（円） */
  monthlyLimit: number;
  /** 補足説明 */
  note: string;
}

export const IDECO_CATEGORIES: IdecoCategory[] = [
  {
    key: "jiei",
    label: "自営業・フリーランス（第1号）",
    monthlyLimit: 68_000,
    note: "国民年金基金・付加保険料と合算した上限です。",
  },
  {
    key: "kaishain-none",
    label: "会社員（企業年金なし）",
    monthlyLimit: 23_000,
    note: "勤務先に企業年金（企業型DC・DB）がない会社員。",
  },
  {
    key: "kaishain-dc",
    label: "会社員（企業型DCのみ加入）",
    monthlyLimit: 20_000,
    note: "勤務先の企業型確定拠出年金に加入している会社員。",
  },
  {
    key: "kaishain-db",
    label: "会社員（DB等あり）・公務員",
    monthlyLimit: 20_000,
    note: "確定給付企業年金などに加入。公務員もこの区分（2024年12月に1.2万→2.0万へ引き上げ）。",
  },
  {
    key: "fuyo",
    label: "専業主婦・主夫（第3号）",
    monthlyLimit: 23_000,
    note: "所得がない場合は所得控除による節税メリットはありません。",
  },
];

/** iDeCoの最低掛金（円・月額） */
export const IDECO_MIN_MONTHLY = 5_000;

export function getIdecoCategory(key: string): IdecoCategory {
  return IDECO_CATEGORIES.find((c) => c.key === key) ?? IDECO_CATEGORIES[1];
}
