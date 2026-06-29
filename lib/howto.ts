// =============================================================
//  「やり方・手順」記事の手順(ステップ)を抽出して HowTo 構造化データに使う。
//  対象は "## ステップN：…" / "## 手順N…" のように明示的な手順見出しを持つ記事のみ
//  （誤検出を避けるため、2ステップ以上そろっている記事だけを HowTo とみなす）。
//  ※Googleは2023年にHowToリッチリザルトを終了。Bing/AI/セマンティクス向けの実装。
//  ビルド時にファイルを読むため Node ランタイム前提（SSG）。
// =============================================================
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface HowToStep {
  name: string;
  text: string;
}

/** Markdownの装飾・リンクを除去してプレーンテキストにする */
function toPlainText(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const STEP_RE = /^##\s+(?:ステップ|手順|STEP)\s*\d*\s*[：:．.、]?\s*(.*)$/;

/** バッファ（手順見出し以降の本文）から最初の段落を本文テキストとして取り出す */
function firstParagraph(buf: string[]): string {
  const paras: string[] = [];
  let cur: string[] = [];
  for (const line of buf) {
    const t = line.trim();
    if (t === "") {
      if (cur.length) {
        paras.push(cur.join(" "));
        cur = [];
      }
      continue;
    }
    if (t.startsWith("#") || t.startsWith("|") || t.startsWith(">")) continue; // 小見出し・表・引用は除く
    cur.push(t);
  }
  if (cur.length) paras.push(cur.join(" "));
  return toPlainText(paras[0] ?? "");
}

/** MDX本文から手順(ステップ)を抽出する */
export function parseHowTo(raw: string): HowToStep[] {
  const steps: HowToStep[] = [];
  let cur: { name: string; buf: string[] } | null = null;
  let inFence = false;

  const flush = () => {
    if (cur && cur.name) {
      steps.push({ name: toPlainText(cur.name), text: firstParagraph(cur.buf) });
    }
    cur = null;
  };

  for (const line of raw.split("\n")) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = line.match(STEP_RE);
    if (m) {
      flush();
      cur = { name: m[1] || "", buf: [] };
    } else if (line.startsWith("## ")) {
      // 手順以外のH2が来たら手順区間は終了
      flush();
    } else if (cur) {
      cur.buf.push(line);
    }
  }
  flush();

  // 本文が取れた手順が2つ以上そろっている場合のみ HowTo とみなす
  const valid = steps.filter((s) => s.name && s.text);
  return valid.length >= 2 ? valid : [];
}

/** スラッグからガイド記事の手順を取得 */
export function getGuideHowTo(slug: string): HowToStep[] {
  try {
    const raw = readFileSync(
      join(process.cwd(), "content", "guides", `${slug}.mdx`),
      "utf8",
    );
    return parseHowTo(raw);
  } catch {
    return [];
  }
}
