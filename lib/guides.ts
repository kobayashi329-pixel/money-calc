// =============================================================
//  ガイド（コラム）レジストリ — 計算機への送客クラスター
//  情報意図のキーワードを獲得し、本文・末尾から計算機（マネーページ）へ
//  内部リンクで送客する。計算機レジストリ(lib/calculators.ts)と同設計。
//  ここに1エントリ＋MDX(content/guides/<slug>.mdx)＋page.tsxを足すと、
//  一覧・sitemap・各計算機の「関連ガイド」内部リンクが自動配線される。
// =============================================================

export interface Guide {
  /** URLスラッグ（/guide/<slug>） */
  slug: string;
  /** 記事タイトル（H1・title） */
  title: string;
  /** 一覧カード用の短い名前 */
  shortTitle: string;
  /** 一覧・meta用の説明 */
  description: string;
  /** 所属カテゴリ（計算機と共通の6カテゴリ） */
  category: string;
  /** この記事が送客する計算機のslug（相互リンク用） */
  targets: string[];
  /** 関連ガイドのslug */
  related: string[];
  /** 公開状態 */
  status: "live" | "planned";
  /** 最終更新（鮮度表示用） */
  updated: string;
  emoji: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "nenshu-500man-tedori",
    title: "年収500万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収500万の手取り",
    description:
      "年収500万円の手取りは約390万円・月約32万円。所得税・住民税・社会保険料の内訳と、手取りを増やす方法を解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-400man-tedori", "nenshu-600man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "nenshu-400man-tedori",
    title: "年収400万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収400万の手取り",
    description:
      "年収400万円の手取りは約317万円・月約26万円。所得税・住民税・社会保険料の内訳をわかりやすく解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-500man-tedori", "nenshu-600man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "nenshu-600man-tedori",
    title: "年収600万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収600万の手取り",
    description:
      "年収600万円の手取りは約463万円・月約38万円。所得税・住民税・社会保険料の内訳と節税の選択肢を解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-500man-tedori", "nenshu-400man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "furusato-nozei-yarikata",
    title: "ふるさと納税のやり方・始め方｜ワンストップ特例と確定申告の違い",
    shortTitle: "ふるさと納税のやり方",
    description:
      "ふるさと納税の手順を初心者向けに解説。上限額の確認、寄付、ワンストップ特例制度と確定申告の違い、期限までをまとめます。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🎁",
  },
  {
    slug: "nisa-ideco-dochira",
    title: "NISAとiDeCoの違いは？どっちから始めるべきか目的別に解説",
    shortTitle: "NISAとiDeCoの違い",
    description:
      "新NISAとiDeCoの違いを一覧で比較。所得控除・引き出しの自由度・非課税メリットから、どっちを優先すべきかを目的別に解説します。",
    category: "toshi",
    targets: ["nisa", "ideco"],
    related: [],
    status: "live",
    updated: "2026年6月23日",
    emoji: "📈",
  },
];

// ---- ヘルパー ----
export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** 公開済みガイド */
export function liveGuides(): Guide[] {
  return GUIDES.filter((g) => g.status === "live");
}

/** カテゴリ内の公開済みガイド */
export function guidesInCategory(categorySlug: string): Guide[] {
  return liveGuides().filter((g) => g.category === categorySlug);
}

/** ある計算機に紐づく公開済みガイド（計算機ページの「関連ガイド」用） */
export function guidesForCalculator(calcSlug: string): Guide[] {
  return liveGuides().filter((g) => g.targets.includes(calcSlug));
}

/** 関連ガイドを解決（存在する公開済みのみ） */
export function relatedGuides(slug: string): Guide[] {
  const g = getGuide(slug);
  if (!g) return [];
  return g.related
    .map((s) => getGuide(s))
    .filter((x): x is Guide => x !== undefined && x.status === "live");
}
