// =============================================================
//  「やり方・手順」記事の手順(ステップ)を抽出して HowTo 構造化データに使う。
//  2通りの書き方に対応する（誤検出を避け、2ステップ以上の記事だけを HowTo とみなす）：
//   A) "## ステップN：…" のように手順そのものを見出しにしているパターン
//   B) "## 〜の手順／流れ／やり方／申請方法…" のH2直下に番号リスト(1. 2. …)があるパターン
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

// ---- パターンA: "## ステップN：…" 見出し ----
const STEP_RE = /^##\s+(?:ステップ|手順|STEP)\s*\d*\s*[：:．.、]?\s*(.*)$/;

/** 手順見出し以降の本文から最初の段落を本文テキストとして取り出す */
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
    if (t.startsWith("#") || t.startsWith("|") || t.startsWith(">")) continue;
    cur.push(t);
  }
  if (cur.length) paras.push(cur.join(" "));
  return toPlainText(paras[0] ?? "");
}

function parseStepHeadings(raw: string): HowToStep[] {
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
      flush();
    } else if (cur) {
      cur.buf.push(line);
    }
  }
  flush();
  return steps.filter((s) => s.name && s.text);
}

// ---- パターンB: 手順系H2の直下の番号リスト ----
// 手順とみなすH2のキーワード（「必要なケース」等の単なる箇条書きは対象外にするため限定）
const HOWTO_H2_RE =
  /^##\s+.*(手順|やり方|流れ|始め方|申請方法|申請の流れ|進め方|登録方法|設定方法|申し込み方法|もらい方|受け取り方).*$/;

/** 番号リスト1項目 → HowToStep（先頭の一文を見出しに、全文を本文に） */
function listItemToStep(item: string): HowToStep {
  const plain = toPlainText(item);
  // 「：」「。」などの手前までを見出しに（短い太字だけだと貧弱なため本文先頭を使う）
  const name = (plain.split(/[：:。．]/)[0] || plain).trim().slice(0, 60);
  return { name, text: plain };
}

function parseOrderedSteps(raw: string): HowToStep[] {
  const items: string[] = [];
  let inFence = false;
  let collecting = false;
  let cur: string | null = null;

  for (const line of raw.split("\n")) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (line.startsWith("## ")) {
      if (collecting) break; // 手順H2の次のH2で終了
      collecting = HOWTO_H2_RE.test(line);
      continue;
    }
    if (!collecting) continue;

    const m = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (m) {
      if (cur !== null) items.push(cur);
      cur = m[2];
    } else if (cur !== null && /^\s+\S/.test(line)) {
      // インデントされた継続行は直前の項目に連結
      cur += " " + line.trim();
    }
  }
  if (cur !== null) items.push(cur);

  return items
    .map(listItemToStep)
    .filter((s) => s.name && s.text);
}

/** MDX本文から手順(ステップ)を抽出する（A→Bの順に試す） */
export function parseHowTo(raw: string): HowToStep[] {
  const byHeadings = parseStepHeadings(raw);
  if (byHeadings.length >= 2) return byHeadings;
  const byList = parseOrderedSteps(raw);
  return byList.length >= 2 ? byList : [];
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
