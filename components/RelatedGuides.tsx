import Link from "next/link";
import { guidesForCalculator } from "@/lib/guides";

// 計算機ページに表示する「関連ガイド」。その計算機を送客先とするガイドを並べる。
// ガイドが無ければ何も表示しない（レジストリ駆動で自動配線）。
const MAX_RELATED = 6;

export function RelatedGuides({ slug }: { slug: string }) {
  const all = guidesForCalculator(slug);
  if (all.length === 0) return null;
  const guides = all.slice(0, MAX_RELATED);
  const hasMore = all.length > MAX_RELATED;

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">関連ガイド・解説</h2>
        {hasMore && (
          <Link
            href="/guide"
            className="shrink-0 text-xs font-semibold text-emerald-700 hover:underline"
          >
            ガイドをすべて見る →
          </Link>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guide/${g.slug}`}
            className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md"
          >
            <span className="flex items-center gap-2 font-semibold text-slate-900">
              <span aria-hidden className="text-base">{g.emoji}</span>
              {g.shortTitle}
            </span>
            <span className="mt-1 flex-1 text-xs leading-5 text-slate-500">{g.description}</span>
            <span className="mt-2 text-xs font-semibold text-emerald-700">読む →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
