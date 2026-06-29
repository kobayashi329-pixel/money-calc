// =============================================================
//  ガイド記事(MDX)の「よくある質問」を抽出し、FAQPage 構造化データに使う。
//  各記事の本文から ## よくある質問 セクションの ### 質問 / 回答 を取り出す。
//  ビルド時にファイルを読むため Node ランタイム前提（SSG）。
// =============================================================
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface FaqItem {
  q: string;
  a: string;
}

/** Markdownの装飾・リンクを除去してプレーンテキストにする */
function toPlainText(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** MDX本文から「よくある質問」のQ&Aを抽出する */
export function parseFaq(raw: string): FaqItem[] {
  const marker = "## よくある質問";
  const start = raw.indexOf(marker);
  if (start < 0) return [];
  let section = raw.slice(start + marker.length);

  // セクションの終端（次のH2 / 出典 / 免責のblockquote）で切る
  const enders = ["\n## ", "\n### 出典", "\n> "];
  let end = section.length;
  for (const e of enders) {
    const i = section.indexOf(e);
    if (i >= 0) end = Math.min(end, i);
  }
  section = section.slice(0, end);

  // ### で各Q&Aに分割（先頭の空チャンクは除く）
  const chunks = section.split(/\n###\s+/).slice(1);
  const items: FaqItem[] = [];
  for (const c of chunks) {
    const nl = c.indexOf("\n");
    const q = toPlainText(nl < 0 ? c : c.slice(0, nl));
    const a = toPlainText(nl < 0 ? "" : c.slice(nl + 1));
    if (q && a) items.push({ q, a });
  }
  return items;
}

/** スラッグからガイド記事のFAQを取得（content/guides/<slug>.mdx を読む） */
export function getGuideFaq(slug: string): FaqItem[] {
  try {
    const raw = readFileSync(
      join(process.cwd(), "content", "guides", `${slug}.mdx`),
      "utf8",
    );
    return parseFaq(raw);
  } catch {
    return [];
  }
}
