import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { liveCalculators, CATEGORIES } from "@/lib/calculators";
import { liveGuides } from "@/lib/guides";

// 検索エンジンにページ一覧を伝えるサイトマップ（/sitemap.xml）。
// レジストリ駆動: 公開済み計算機・カテゴリを自動収録。新計算機を足すと自動で載る。
// lastModified はビルド時刻（＝最終デプロイ）を入れ、更新の鮮度を検索エンジンに伝える。
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/calculators`, lastModified, changeFrequency: "weekly", priority: 0.6 },
  ];

  // 公開済み計算機
  for (const c of liveCalculators()) {
    entries.push({
      url: `${SITE_URL}/${c.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // ガイド（コラム）一覧＋各記事
  entries.push({
    url: `${SITE_URL}/guide`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  });
  for (const g of liveGuides()) {
    entries.push({
      url: `${SITE_URL}/guide/${g.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // カテゴリページ
  for (const cat of CATEGORIES) {
    entries.push({
      url: `${SITE_URL}/c/${cat.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // 固定ページ（信頼性ページ）
  for (const path of ["/about", "/editorial-policy", "/sources", "/privacy", "/disclaimer", "/contact"]) {
    entries.push({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  return entries;
}
