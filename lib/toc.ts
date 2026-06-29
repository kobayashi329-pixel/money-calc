// =============================================================
//  記事(MDX)の見出し(H2)を抽出して「目次(TOC)」を作る。
//  見出しID(headingId)は本パーサーと mdx-components.tsx の <h2> で
//  同じ関数を使うことで、目次リンク(#id)と本文見出しが必ず一致する。
//  ビルド時にファイルを読むため Node ランタイム前提（SSG）。
// =============================================================
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface Heading {
  id: string;
  text: string;
}

/** 見出しテキスト → アンカーID（Markdown装飾を除去・空白をハイフン化）。
 *  日本語はそのまま残す（HTML5のidとして有効・ブラウザのfragmentで一致する）。 */
export function headingId(text: string): string {
  return text
    .trim()
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** -> bold
    .replace(/[*`_#>]/g, "")
    .replace(/[()（）「」、。：:！？？!]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/** MDX本文からH2見出しの一覧を取り出す（コードフェンス内は除外）。 */
export function parseHeadings(raw: string): Heading[] {
  const out: Heading[] = [];
  let inFence = false;
  for (const line of raw.split("\n")) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    // H2のみ（"## " 始まり・"### " は除く）
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      const text = line.slice(3).trim();
      if (text) out.push({ id: headingId(text), text });
    }
  }
  return out;
}

/** スラッグからガイド記事の見出し一覧を取得 */
export function getGuideHeadings(slug: string): Heading[] {
  try {
    const raw = readFileSync(
      join(process.cwd(), "content", "guides", `${slug}.mdx`),
      "utf8",
    );
    return parseHeadings(raw);
  } catch {
    return [];
  }
}
