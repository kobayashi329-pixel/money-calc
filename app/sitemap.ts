import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 検索エンジンにページ一覧を伝えるサイトマップ（/sitemap.xml として配信される）。
// 計算機を追加したら、この配列にURLを足していく。
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/take-home`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
