"use client";

// サイト内検索（計算機＋ガイドを対象に、クライアント側で絞り込み）。
// URLの ?q= を初期値に読み込む（SearchAction／sitelinks searchbox対応）。
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { liveCalculators } from "@/lib/calculators";
import { liveGuides } from "@/lib/guides";

type Item = { kind: "計算機" | "ガイド"; href: string; title: string; desc: string; text: string };

export function SearchClient() {
  const [q, setQ] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("q");
    if (p) setQ(p);
  }, []);

  const items = useMemo<Item[]>(() => {
    const calcs: Item[] = liveCalculators().map((c) => ({
      kind: "計算機",
      href: `/${c.slug}`,
      title: c.title,
      desc: c.description,
      text: `${c.title} ${c.shortTitle} ${c.description}`.toLowerCase(),
    }));
    const guides: Item[] = liveGuides().map((g) => ({
      kind: "ガイド",
      href: `/guide/${g.slug}`,
      title: g.title,
      desc: g.description,
      text: `${g.title} ${g.shortTitle} ${g.description}`.toLowerCase(),
    }));
    return [...calcs, ...guides];
  }, []);

  const query = q.trim().toLowerCase();
  // スペース区切りのAND検索
  const terms = query.split(/\s+/).filter(Boolean);
  const results = terms.length
    ? items.filter((i) => terms.every((t) => i.text.includes(t)))
    : [];

  return (
    <div>
      <label className="block">
        <span className="sr-only">サイト内検索</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="例: 年収 手取り／ふるさと納税／NISA"
          autoFocus
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
        />
      </label>

      <div className="mt-5">
        {query === "" ? (
          <p className="text-sm text-slate-500">
            キーワードを入力すると、計算機・ガイドから検索できます。
          </p>
        ) : results.length === 0 ? (
          <p className="text-sm text-slate-500">
            「{q}」に一致する結果は見つかりませんでした。別のキーワードでお試しください。
          </p>
        ) : (
          <>
            <p className="mb-3 text-xs text-slate-400">{results.length}件の結果</p>
            <ul className="space-y-3">
              {results.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
                  >
                    <span className="mr-2 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                      {r.kind}
                    </span>
                    <span className="font-semibold text-slate-900">{r.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{r.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
