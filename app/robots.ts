import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 検索エンジン向けの robots.txt（/robots.txt として配信される）。
// 全ページのクロールを許可し、サイトマップの場所を伝える。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
