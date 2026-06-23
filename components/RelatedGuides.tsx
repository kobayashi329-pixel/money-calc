import Link from "next/link";
import { guidesForCalculator } from "@/lib/guides";

// 計算機ページに表示する「関連ガイド」。その計算機を送客先とするガイドを並べる。
// ガイドが無ければ何も表示しない（レジストリ駆動で自動配線）。
export function RelatedGuides({ slug }: { slug: string }) {
  const guides = guidesForCalculator(slug);
  if (guides.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-bold text-slate-900">関連ガイド・解説</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guide/${g.slug}`}
            className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
          >
            <span className="font-semibold text-slate-900">{g.shortTitle}</span>
            <span className="mt-1 flex-1 text-xs leading-5 text-slate-500">{g.description}</span>
            <span className="mt-2 text-xs font-semibold text-emerald-700">読む →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
