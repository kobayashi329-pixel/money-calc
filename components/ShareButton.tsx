"use client";

// 計算結果の共有ボタン＋URLパラメータ読み取りフック。
// - ShareButton: 現在の入力値をクエリ化したURLを、Web Share APIまたはクリップボードで共有。
// - useSharedParams: マウント後にURLのクエリを読み取り、共有されたリンクの入力値を復元する。
//   （SSG・useSearchParams非依存。初回は既定値→マウント後に上書きの軽いフラッシュのみ）
import { useEffect, useState } from "react";

export function useSharedParams(apply: (get: (key: string) => string | null) => void) {
  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    if ([...usp.keys()].length > 0) {
      apply((key) => usp.get(key));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** 共有URLに数値を復元するヘルパー（負値・非数は無視） */
export function applyNumber(
  get: (key: string) => string | null,
  key: string,
  setter: (n: number) => void,
) {
  const v = get(key);
  if (v == null) return;
  const n = Number(v);
  if (Number.isFinite(n) && n >= 0) setter(n);
}

export function ShareButton({
  params,
  label = "結果をシェア",
}: {
  params: Record<string, string | number>;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const buildUrl = () => {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) usp.set(k, String(v));
    const base =
      typeof window !== "undefined"
        ? window.location.origin + window.location.pathname
        : "";
    return `${base}?${usp.toString()}`;
  };

  const onClick = async () => {
    const url = buildUrl();
    // モバイルはネイティブ共有、それ以外はクリップボードへコピー
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        /* キャンセル時はコピーにフォールバック */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* クリップボード不可環境では何もしない */
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
    >
      {copied ? "コピーしました ✓" : `🔗 ${label}`}
    </button>
  );
}
