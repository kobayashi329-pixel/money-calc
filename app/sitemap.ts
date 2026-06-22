import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { liveCalculators, CATEGORIES } from "@/lib/calculators";

// 検索エンジンにページ一覧を伝えるサイトマップ（/sitemap.xml）。
// レジストリ駆動: 公開済み計算機・カテゴリを自動収録。新計算機を足すと自動で載る。
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
  ];

  // 公開済み計算機
  for (const c of liveCalculators()) {
    entries.push({
      url: `${SITE_URL}/${c.slug}`,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // カテゴリページ
  for (const cat of CATEGORIES) {
    entries.push({
      url: `${SITE_URL}/c/${cat.slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // 固定ページ（信頼性ページ）
  for (const path of ["/about", "/privacy", "/disclaimer", "/contact"]) {
    entries.push({
      url: `${SITE_URL}${path}`,
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  return entries;
}
