// =============================================================
//  計算機レジストリ（サイト全体の単一の真実）
//  ここに1エントリ追加するだけで、トップページのカード・サイトマップ・
//  カテゴリ・各ページの「関連する計算機」内部リンク・パンくずが自動配線される。
//  → 内部リンク（リンクジュース）の取り回しを一元管理する設計。
// =============================================================

/** カテゴリの定義 */
export interface Category {
  /** URLスラッグ（/c/<slug>） */
  slug: string;
  /** 表示名 */
  name: string;
  /** 短い説明（カテゴリページ・トップのセクション見出し用） */
  description: string;
  emoji: string;
}

/** 計算機（スポーク）の定義 */
export interface Calculator {
  /** URLスラッグ（/<slug>）。ローマ字で短く。 */
  slug: string;
  /** 正式名称（ページH1・titleに使用） */
  title: string;
  /** 一覧カード用の短い名前 */
  shortTitle: string;
  /** 一覧・meta用の説明（30〜60字） */
  description: string;
  /** 所属カテゴリ slug */
  category: string;
  /** 公開状態。"live"のみ実ページ・サイトマップに載る */
  status: "live" | "planned";
  /** 関連する計算機の slug（内部リンク用）。集客→収益へ流すよう設計 */
  related: string[];
  /** トップ/一覧での並び順（小さいほど上）。収益・人気を上位に */
  priority: number;
  emoji: string;
}

// ---- カテゴリ ----
export const CATEGORIES: Category[] = [
  { slug: "kyuyo", name: "給与・手取り", description: "年収や月給から手取りを計算", emoji: "💴" },
  { slug: "loan", name: "ローン・返済", description: "住宅・自動車・教育ローンの返済を試算", emoji: "🏠" },
  { slug: "zei", name: "税金", description: "ふるさと納税・消費税・贈与税などを計算", emoji: "📑" },
  { slug: "toshi", name: "投資・資産形成", description: "NISA・iDeCoの積立をシミュレーション", emoji: "📈" },
  { slug: "nenkin", name: "年金・退職金", description: "退職金や年金の手取り・税金を計算", emoji: "🧾" },
  { slug: "life", name: "ライフプラン", description: "老後資金・教育資金・生涯のお金の計画をシミュレーション", emoji: "🗓️" },
];

// ---- 計算機 ----
// priority: 集客入口(手取り)と収益エンジン(住宅ローン/NISA)を上位に。
export const CALCULATORS: Calculator[] = [
  {
    slug: "tedori",
    title: "年収手取り計算機",
    shortTitle: "年収手取り",
    description:
      "額面年収から所得税・住民税・社会保険料を引いた手取りを、内訳とグラフで即計算。令和7年改正対応。",
    category: "kyuyo",
    status: "live",
    related: ["furusato-nozei", "ideco", "jutaku-loan"],
    priority: 1,
    emoji: "💴",
  },
  {
    slug: "jutaku-loan",
    title: "住宅ローンシミュレータ",
    shortTitle: "住宅ローン",
    description:
      "借入額・金利・返済期間から、毎月の返済額・総返済額・利息総額を計算。元利均等／元金均等に対応。",
    category: "loan",
    status: "live",
    related: ["kuriage-hensai", "tedori", "furusato-nozei"],
    priority: 2,
    emoji: "🏠",
  },
  {
    slug: "furusato-nozei",
    title: "ふるさと納税 上限額シミュレータ",
    shortTitle: "ふるさと納税",
    description:
      "年収・家族構成から、自己負担2,000円で済む寄付上限の目安を計算。",
    category: "zei",
    status: "live",
    related: ["tedori", "jutaku-loan", "ideco"],
    priority: 3,
    emoji: "🎁",
  },
  {
    slug: "nisa",
    title: "NISA積立シミュレータ",
    shortTitle: "NISA",
    description: "毎月の積立額と利回りから、将来の資産額と運用益を試算。運用益が非課税になるメリット額も表示。",
    category: "toshi",
    status: "live",
    related: ["ideco", "tedori"],
    priority: 4,
    emoji: "📈",
  },
  {
    slug: "ideco",
    title: "iDeCo節税・積立シミュレータ",
    shortTitle: "iDeCo",
    description: "掛金による所得税・住民税の節税額と、65歳時点の積立評価額を計算。加入区分別の掛金上限に対応。",
    category: "toshi",
    status: "live",
    related: ["nisa", "tedori", "furusato-nozei"],
    priority: 5,
    emoji: "🐷",
  },
  {
    slug: "kuriage-hensai",
    title: "住宅ローン繰り上げ返済シミュレータ",
    shortTitle: "繰上返済",
    description:
      "繰上返済の効果を試算。期間短縮型と返済額軽減型で、利息の軽減額・短縮期間・毎月の返済額の差を比較。",
    category: "loan",
    status: "live",
    related: ["jutaku-loan", "tedori"],
    priority: 6,
    emoji: "📉",
  },
  {
    slug: "sozokuzei",
    title: "相続税計算機",
    shortTitle: "相続税",
    description:
      "遺産総額と家族構成から、基礎控除・相続税の総額・配偶者の税額軽減を反映した納税額の目安を計算。",
    category: "zei",
    status: "live",
    related: ["tedori", "furusato-nozei"],
    priority: 7,
    emoji: "🏛️",
  },
  {
    slug: "karikae",
    title: "住宅ローン借り換え比較シミュレータ",
    shortTitle: "借り換え",
    description:
      "今のローンと借り換え後を比較。金利差による毎月返済額・総返済額の軽減から、諸費用を引いた正味メリットを試算。",
    category: "loan",
    status: "live",
    related: ["jutaku-loan", "kuriage-hensai", "tedori"],
    priority: 8,
    emoji: "🔁",
  },
  {
    slug: "rougo-shikin",
    title: "老後資金シミュレーション",
    shortTitle: "老後資金",
    description:
      "退職時に必要な老後資金と、不足を埋めるために今から毎月いくら積み立てればよいかを試算。",
    category: "life",
    status: "live",
    related: ["nenkin-mikomi", "nisa", "ideco"],
    priority: 7.5,
    emoji: "🗓️",
  },
  {
    slug: "kyoiku-shikin",
    title: "教育資金シミュレーション",
    shortTitle: "教育資金",
    description:
      "幼稚園〜大学の進路（公立／私立）別に教育費の総額を試算。大学費用を貯める毎月の積立額も計算。",
    category: "life",
    status: "live",
    related: ["rougo-shikin", "nisa", "tedori"],
    priority: 7.6,
    emoji: "🎓",
  },
  {
    slug: "life-plan",
    title: "ライフプラン表（生涯キャッシュフロー）",
    shortTitle: "ライフプラン表",
    description:
      "現在から想定寿命まで、毎年の収入・支出・貯蓄残高を試算。貯蓄が尽きる年齢が一目でわかる生涯のお金の設計表。",
    category: "life",
    status: "live",
    related: ["rougo-shikin", "nenkin-mikomi", "kyoiku-shikin"],
    priority: 7.7,
    emoji: "📊",
  },
  {
    slug: "nenkin-mikomi",
    title: "公的年金 受給見込み額シミュレーション",
    shortTitle: "年金見込み",
    description:
      "加入年数と平均年収から、老齢基礎年金＋厚生年金の受給見込み額を概算。繰上げ・繰下げ受給にも対応。",
    category: "nenkin",
    status: "live",
    related: ["rougo-shikin", "taishokukin", "tedori"],
    priority: 8.5,
    emoji: "👵",
  },
  {
    slug: "taishokukin",
    title: "退職金の手取り・税金計算",
    shortTitle: "退職金",
    description: "勤続年数と退職金額から、退職所得控除・1/2課税・税金・手取りを計算。",
    category: "nenkin",
    status: "live",
    related: ["tedori", "ideco", "nisa"],
    priority: 9,
    emoji: "🧾",
  },
  {
    slug: "shohizei",
    title: "消費税・インボイス計算機",
    shortTitle: "消費税",
    description: "税込・税抜の変換、軽減税率8%/10%、インボイスの端数処理に対応。",
    category: "zei",
    status: "live",
    related: ["tedori", "sozokuzei"],
    priority: 10,
    emoji: "🧮",
  },
  {
    slug: "jikyu-nenshu",
    title: "時給・月給・年収 換算機",
    shortTitle: "時給→年収",
    description: "時給・日給・月給・年収を相互に換算。手取り計算にも連携。",
    category: "kyuyo",
    status: "live",
    related: ["tedori"],
    priority: 11,
    emoji: "⏱️",
  },
];

// ---- ヘルパー ----
export function getCalculator(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** 公開済み（live）の計算機のみ。サイトマップ・実リンクに使用 */
export function liveCalculators(): Calculator[] {
  return CALCULATORS.filter((c) => c.status === "live").sort(
    (a, b) => a.priority - b.priority,
  );
}

/** priority順の全計算機（準備中も含む。トップの一覧表示用） */
export function allCalculatorsByPriority(): Calculator[] {
  return [...CALCULATORS].sort((a, b) => a.priority - b.priority);
}

/** カテゴリに属する計算機（priority順） */
export function calculatorsInCategory(categorySlug: string): Calculator[] {
  return CALCULATORS.filter((c) => c.category === categorySlug).sort(
    (a, b) => a.priority - b.priority,
  );
}

/** 関連する計算機を解決（存在するもののみ） */
export function relatedCalculators(slug: string): Calculator[] {
  const calc = getCalculator(slug);
  if (!calc) return [];
  return calc.related
    .map((s) => getCalculator(s))
    .filter((c): c is Calculator => c !== undefined);
}
