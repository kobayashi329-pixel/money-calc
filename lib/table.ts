// =============================================================
//  ガイド記事(MDX)の最初の Markdown 表（早見表）を抽出する。
//  SNS用の縦長画像（/pin/<slug>）で「早見表の画像化」に使う。
//  ビルド時にファイルを読むため Node ランタイム前提。
// =============================================================
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

/** Markdownの装飾・リンクを除去してプレーンテキストにする */
function clean(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

/** "| a | b | c |" → ["a","b","c"] */
function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => clean(c));
}

/** 区切り行（| --- | --- |）か判定 */
function isSeparator(line: string): boolean {
  return /^\s*\|?[\s:|-]*-{2,}[\s:|-]*\|?\s*$/.test(line) && line.includes("-");
}

/** MDX本文から最初の表を抽出（無ければ null） */
export function parseFirstTable(raw: string): ParsedTable | null {
  const lines = raw.split("\n");
  let inFence = false;
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // ヘッダー行 + 次が区切り行 = 表の開始
    if (line.trim().startsWith("|") && isSeparator(lines[i + 1])) {
      const headers = splitRow(line);
      const rows: string[][] = [];
      for (let j = i + 2; j < lines.length; j++) {
        const r = lines[j];
        if (!r.trim().startsWith("|")) break;
        rows.push(splitRow(r));
      }
      if (headers.length >= 2 && rows.length >= 1) return { headers, rows };
    }
  }
  return null;
}

/** スラッグからガイド記事の最初の表を取得 */
export function getGuideTable(slug: string): ParsedTable | null {
  try {
    const raw = readFileSync(
      join(process.cwd(), "content", "guides", `${slug}.mdx`),
      "utf8",
    );
    return parseFirstTable(raw);
  } catch {
    return null;
  }
}
