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
  /** カテゴリページ用の解説文（200字程度・SEO/独自コンテンツ用）。任意。 */
  intro?: string;
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
  {
    slug: "kyuyo",
    name: "給与・手取り",
    description: "年収や月給から手取りを計算",
    intro:
      "会社員やパート・アルバイトの方が、額面の年収・月給から実際に使える「手取り」を把握するための計算機をまとめています。年収手取り計算機では、所得税・住民税・健康保険・厚生年金・雇用保険を差し引いた手取り額を内訳つきで確認でき、時給・月給・年収の相互換算にも対応。令和7年（2025年）の税制改正に対応した概算で、転職や働き方を考えるときの目安になります。",
    emoji: "💴",
  },
  {
    slug: "loan",
    name: "ローン・返済",
    description: "住宅・自動車・教育ローンの返済を試算",
    intro:
      "住宅ローンを中心に、借入・返済にまつわる計算機を集めたカテゴリです。毎月の返済額・総返済額・利息総額のシミュレーションに加え、繰り上げ返済（期間短縮型・返済額軽減型）の効果や、借り換えで諸費用を引いた正味メリットが出るかまで試算できます。元利均等・元金均等に対応し、無理のない借入や返済計画を考える際の目安としてお使いいただけます。",
    emoji: "🏠",
  },
  {
    slug: "zei",
    name: "税金",
    description: "ふるさと納税・消費税・贈与税などを計算",
    intro:
      "ふるさと納税の上限額、相続税、消費税など、暮らしにかかわる税金の計算機をまとめています。ふるさと納税では自己負担2,000円で済む寄付の上限を、相続税では基礎控除や配偶者の税額軽減を反映した納税額の目安を計算できます。いずれも国税庁などの公的資料に基づく概算で、確定申告や納税を検討する前の目安としてご活用ください。",
    emoji: "📑",
  },
  {
    slug: "toshi",
    name: "投資・資産形成",
    description: "NISA・iDeCoの積立をシミュレーション",
    intro:
      "NISA・iDeCoなど、将来に向けた資産形成の計算機をまとめたカテゴリです。毎月の積立額・利回り・期間から将来の資産額と運用益を試算でき、NISAでは運用益が非課税になるメリット額、iDeCoでは掛金の所得控除による節税額もあわせて確認できます。複利の効果を見ながら、無理のない積立プランを考える目安としてお使いいただけます。",
    emoji: "📈",
  },
  {
    slug: "nenkin",
    name: "年金・退職金",
    description: "退職金や年金の手取り・税金を計算",
    intro:
      "公的年金の受給見込み額や、退職金の手取り・税金を計算するカテゴリです。年金見込みでは老齢基礎年金と厚生年金の受給額を、繰上げ・繰下げ受給による増減もあわせて概算できます。退職金では退職所得控除や1/2課税を反映した手取りを計算。老後の収入を把握し、ライフプランを考える出発点としてご活用ください。",
    emoji: "🧾",
  },
  {
    slug: "life",
    name: "ライフプラン",
    description: "老後資金・教育資金・生涯のお金の計画をシミュレーション",
    intro:
      "老後資金・教育資金・生涯のお金の計画など、人生の大きなお金を見通すための計算機をまとめています。退職時に必要な老後資金と毎月の積立額、子どもの進路別の教育費、そして現在から想定寿命までの収入・支出・貯蓄残高を年表にするライフプラン表まで対応。ファイナンシャルプランナーに相談するようなテーマを、無料で試算できます。",
    emoji: "🗓️",
  },
  {
    slug: "teate",
    name: "手当・給付金",
    description: "失業・育休・病気のときに受け取れる手当や給付金を計算",
    intro:
      "退職・出産・病気など、働けない期間の収入を支える手当・給付金の計算機をまとめたカテゴリです。失業時の雇用保険（基本手当）の日額と給付日数、育児休業給付金（67%・50%）の総額、病気やケガで休んだときの傷病手当金（標準報酬日額の3分の2）を概算できます。ハローワークや協会けんぽなどの公的資料に基づく目安で、退職や休業の前に受け取れる金額を把握する出発点としてお使いいただけます。",
    emoji: "💼",
  },
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
  {
    slug: "jidoshazei",
    title: "自動車税 計算機（種別割）",
    shortTitle: "自動車税",
    description:
      "総排気量と初度登録時期から、自家用乗用車の自動車税（種別割）の年税額を計算。軽自動車・13年超の重課にも対応。",
    category: "zei",
    status: "live",
    related: ["kotei-shisanzei", "shohizei", "tedori"],
    priority: 12,
    emoji: "🚗",
  },
  {
    slug: "kotei-shisanzei",
    title: "固定資産税・都市計画税 計算機",
    shortTitle: "固定資産税",
    description:
      "土地・建物の固定資産税評価額から、固定資産税（1.4%）と都市計画税（0.3%）の年税額を計算。住宅用地の特例に対応。",
    category: "zei",
    status: "live",
    related: ["jutaku-loan", "jidoshazei", "sozokuzei"],
    priority: 13,
    emoji: "🏡",
  },
  {
    slug: "juuminzei",
    title: "住民税 計算機",
    shortTitle: "住民税",
    description:
      "年収と家族構成から、住民税（所得割10%＋均等割）の年額を計算。所得控除・社会保険料を反映した概算を内訳つきで表示。",
    category: "kyuyo",
    status: "live",
    related: ["tedori", "shahoken", "furusato-nozei"],
    priority: 14,
    emoji: "🏛️",
  },
  {
    slug: "shahoken",
    title: "社会保険料 計算機",
    shortTitle: "社会保険料",
    description:
      "年収と年齢から、健康保険・介護保険・厚生年金・雇用保険の本人負担分（年額・月額）を計算。都道府県別の健康保険料率に対応。",
    category: "kyuyo",
    status: "live",
    related: ["tedori", "juuminzei", "nenkin-mikomi"],
    priority: 15,
    emoji: "🩺",
  },
  {
    slug: "zouyozei",
    title: "贈与税 計算機（暦年課税）",
    shortTitle: "贈与税",
    description:
      "1年間の贈与額から、贈与税（暦年課税）の税額を計算。基礎控除110万円・特例税率/一般税率に対応し、税引後の手取りも表示。",
    category: "zei",
    status: "live",
    related: ["sozokuzei", "kotei-shisanzei", "tedori"],
    priority: 16,
    emoji: "🎁",
  },
  {
    slug: "zangyodai",
    title: "残業代 計算機（割増賃金）",
    shortTitle: "残業代",
    description:
      "月給と残業時間から、時間外（25%・60h超50%）・深夜（25%）・休日（35%）の割増賃金を計算。1時間あたりの基礎賃金も表示。",
    category: "kyuyo",
    status: "live",
    related: ["tedori", "jikyu-nenshu", "shahoken"],
    priority: 17,
    emoji: "⏰",
  },
  {
    slug: "shitsugyo-hoken",
    title: "失業保険（基本手当）計算機",
    shortTitle: "失業保険",
    description:
      "離職前の月給・年齢・被保険者期間・離職理由から、雇用保険の基本手当日額・給付日数・受給総額の目安を計算。",
    category: "teate",
    status: "live",
    related: ["ikukyu-kyufu", "shoubyo-teate", "tedori"],
    priority: 18,
    emoji: "📋",
  },
  {
    slug: "ikukyu-kyufu",
    title: "育児休業給付金 計算機",
    shortTitle: "育休給付金",
    description:
      "休業前の月給と育休の取得月数から、育児休業給付金（最初の6か月67%・以降50%）の月額と総額を計算。支給上限に対応。",
    category: "teate",
    status: "live",
    related: ["shitsugyo-hoken", "shoubyo-teate", "tedori"],
    priority: 19,
    emoji: "👶",
  },
  {
    slug: "shoubyo-teate",
    title: "傷病手当金 計算機",
    shortTitle: "傷病手当金",
    description:
      "標準報酬月額（月給）と休んだ日数から、傷病手当金（標準報酬日額の2/3）の1日あたり・受給総額の目安を計算。待期3日に対応。",
    category: "teate",
    status: "live",
    related: ["ikukyu-kyufu", "shitsugyo-hoken", "shahoken"],
    priority: 20,
    emoji: "🩹",
  },
  {
    slug: "shussan-teate",
    title: "出産手当金 計算機",
    shortTitle: "出産手当金",
    description:
      "標準報酬月額（月給）から、出産手当金（標準報酬日額の2/3×98日）の受給総額の目安を計算。単胎・多胎に対応。",
    category: "teate",
    status: "live",
    related: ["ikukyu-kyufu", "shoubyo-teate", "jido-teate"],
    priority: 21,
    emoji: "🤰",
  },
  {
    slug: "jido-teate",
    title: "児童手当 計算機（2024年10月拡充対応）",
    shortTitle: "児童手当",
    description:
      "子どもの人数と年齢から、児童手当の月額・年額を計算。2024年10月の拡充（高校生まで・第3子以降月3万円・所得制限なし）に対応。",
    category: "life",
    status: "live",
    related: ["ikukyu-kyufu", "kyoiku-shikin", "shussan-teate"],
    priority: 7.65,
    emoji: "👶",
  },
  {
    slug: "jutaku-loan-kojo",
    title: "住宅ローン控除 計算機",
    shortTitle: "住宅ローン控除",
    description:
      "年末のローン残高と住宅の性能から、住宅ローン控除（減税）の年間控除額を計算。控除率0.7%・住宅性能別の借入限度額・子育て世帯の上乗せに対応（2024・2025年入居）。",
    category: "loan",
    status: "live",
    related: ["jutaku-loan", "karikae", "tedori"],
    priority: 6.5,
    emoji: "🏡",
  },
  {
    slug: "shotokuzei",
    title: "所得税 計算機（速算表）",
    shortTitle: "所得税",
    description:
      "課税所得から所得税（速算表・超過累進）と復興特別所得税を計算。5〜45%の税率と控除額に対応し、限界税率も表示します。",
    category: "zei",
    status: "live",
    related: ["tedori", "juuminzei", "furusato-nozei"],
    priority: 10.5,
    emoji: "🧾",
  },
  {
    slug: "iryouhi-koujo",
    title: "医療費控除 計算機｜いくら戻るか計算",
    shortTitle: "医療費控除",
    description:
      "年間の医療費と所得から、医療費控除でいくら税金が戻るかを計算。10万円の足切り・補填額・所得税率＋住民税10%を反映した軽減額の目安を表示します。",
    category: "zei",
    status: "live",
    related: ["shotokuzei", "furusato-nozei", "tedori"],
    priority: 10.6,
    emoji: "💊",
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
