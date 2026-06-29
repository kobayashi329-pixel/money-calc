// =============================================================
//  記事(MDX)本文に埋め込まれた図解画像（/fig/...）のURLを抽出する。
//  画像サイトマップ(image sitemap)に載せて、画像検索の発見性を高める。
//  ビルド時にファイルを読むため Node ランタイム前提（SSG）。
// =============================================================
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** MDXファイルから <Figure src="/fig/..."> の画像URL（絶対URL）を取り出す */
export function figureUrlsInMdx(absPath: string, siteUrl: string): string[] {
  try {
    const raw = readFileSync(absPath, "utf8");
    const set = new Set<string>();
    for (const m of raw.matchAll(/src="(\/fig\/[a-z0-9-]+)"/g)) {
      set.add(siteUrl + m[1]);
    }
    return [...set];
  } catch {
    return [];
  }
}

/** ガイド記事の図解画像URL */
export function guideFigureUrls(slug: string, siteUrl: string): string[] {
  return figureUrlsInMdx(
    join(process.cwd(), "content", "guides", `${slug}.mdx`),
    siteUrl,
  );
}

/** 計算機ページ（解説MDX）の図解画像URL */
export function calculatorFigureUrls(slug: string, siteUrl: string): string[] {
  return figureUrlsInMdx(join(process.cwd(), "content", `${slug}.mdx`), siteUrl);
}
