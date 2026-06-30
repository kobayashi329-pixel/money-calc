"use client";

// 計算機ページの「このツールを紹介・引用する」ボックス。
// ブログ等に貼れるリンクHTML／埋め込みiframeをワンクリックでコピーできる。
// 被リンク獲得の摩擦を下げるための導線。
import { useState } from "react";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { EMBEDDABLE } from "./embeddableCalculators";

function CopyRow({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* クリップボード不可の環境は手動コピー */
    }
  };
  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          {copied ? "コピーしました ✓" : "コピー"}
        </button>
      </div>
      <textarea
        readOnly
        value={code}
        onFocus={(e) => e.currentTarget.select()}
        rows={code.length > 90 ? 3 : 2}
        className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-[11px] leading-5 text-slate-700"
      />
    </div>
  );
}

export function EmbedCite({ slug, title }: { slug: string; title: string }) {
  const pageUrl = `${SITE_URL}/${slug}`;
  const linkCode = `<a href="${pageUrl}">${title}｜${SITE_NAME}</a>`;
  const embedCode = `<iframe src="${SITE_URL}/embed/${slug}" width="100%" height="820" style="border:1px solid #e2e8f0;border-radius:12px" title="${title}" loading="lazy"></iframe>`;
  const canEmbed = !!EMBEDDABLE[slug];

  return (
    <section className="mt-10">
      <details className="rounded-2xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer list-none font-bold text-slate-900">
          🔗 このツールを紹介・引用する（リンク・埋め込み自由）
        </summary>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          ブログやサイトで自由にリンク・紹介いただけます（出典の明記をお願いします）。
          下のコードをコピーしてお使いください。
        </p>

        <CopyRow label="リンク（HTML）" code={linkCode} />
        {canEmbed && (
          <CopyRow label="埋め込み（iframe・計算機をそのまま設置）" code={embedCode} />
        )}

        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-xs font-semibold text-slate-600">SNS用シェア画像（縦長）</span>
          <a
            href={`/pin/${slug}`}
            target="_blank"
            rel="noopener"
            className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            画像を開く ↗
          </a>
          <span className="text-[11px] text-slate-400">Pinterest・Instagram向け</span>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-slate-400">
          ※埋め込みは計算機の高さに合わせて height を調整してください。
          掲載のご連絡は不要です。出典・引用の方針は
          <a href="/press" className="text-emerald-700 underline">掲載・引用について</a>をご覧ください。
        </p>
      </details>
    </section>
  );
}
