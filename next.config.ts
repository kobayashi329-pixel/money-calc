import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // .md / .mdx もページ・コンポーネントとして扱う
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // 旧URL（英語スラッグ）からローマ字スラッグへ恒久リダイレクト（SEO評価を引き継ぐ）
  async redirects() {
    return [
      { source: "/take-home", destination: "/tedori", permanent: true },
    ];
  },
};

const withMDX = createMDX({
  options: {
    // Turbopack では設定がシリアライズ可能である必要があるため、
    // プラグインは import 済み関数ではなく「文字列名」で指定する。
    // remark-gfm: Markdown のテーブル・打ち消し線などGFM記法を有効化。
    remarkPlugins: [["remark-gfm"]],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
