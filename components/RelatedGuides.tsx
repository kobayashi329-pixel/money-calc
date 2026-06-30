import Link from "next/link";
import { guidesForCalculator, guidesForCalculatorGrouped, type Guide } from "@/lib/guides";

// 計算機ページに表示する「関連ガイド」。その計算機を送客先とするガイドを
// シリーズ単位にまとめて全件見せ、計算機を“クラスターのピラー”にする。
// （多いシリーズは折りたたみ。ガイドが無ければ何も表示しない＝レジストリ駆動で自動配線）

const VISIBLE_PER_SERIES = 4;

function GuideCard({ g }: { g: Guide }) {
  return (
    <Link
      href={`/guide/${g.slug}`}
      className="group flex gap-2.5 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-emerald-300 hover:shadow-sm"
    >
      <span
        aria-hidden
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-sm group-hover:bg-emerald-50"
      >
        {g.emoji}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold text-slate-900">{g.shortTitle}</span>
        <span className="mt-0.5 line-clamp-1 text-xs leading-5 text-slate-500">
          {g.description}
        </span>
      </span>
    </Link>
  );
}

export function RelatedGuides({ slug }: { slug: string }) {
  const all = guidesForCalculator(slug);
  if (all.length === 0) return null;
  const { groups, others } = guidesForCalculatorGrouped(slug);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">
          関連ガイド・解説
          <span className="ml-2 text-sm font-medium text-slate-400">{all.length}記事</span>
        </h2>
        <Link
          href="/guide"
          className="shrink-0 text-xs font-semibold text-emerald-700 hover:underline"
        >
          ガイドをすべて見る →
        </Link>
      </div>

      <div className="space-y-6">
        {groups.map((grp) => {
          const visible = grp.items.slice(0, VISIBLE_PER_SERIES);
          const hidden = grp.items.slice(VISIBLE_PER_SERIES);
          return (
            <div key={grp.key}>
              <h3 className="mb-2 flex items-baseline gap-2 text-sm font-bold text-slate-700">
                {grp.label}
                <span className="text-xs font-medium text-slate-400">{grp.items.length}記事</span>
              </h3>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {visible.map((g) => (
                  <GuideCard key={g.slug} g={g} />
                ))}
              </div>
              {hidden.length > 0 && (
                <details className="mt-2.5">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-emerald-700 hover:underline">
                    ＋ ほかの{hidden.length}記事を表示
                  </summary>
                  <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                    {hidden.map((g) => (
                      <GuideCard key={g.slug} g={g} />
                    ))}
                  </div>
                </details>
              )}
            </div>
          );
        })}

        {others.length > 0 && (
          <div>
            {groups.length > 0 && (
              <h3 className="mb-2 flex items-baseline gap-2 text-sm font-bold text-slate-700">
                その他
                <span className="text-xs font-medium text-slate-400">{others.length}記事</span>
              </h3>
            )}
            <div className="grid gap-2.5 sm:grid-cols-2">
              {others.map((g) => (
                <GuideCard key={g.slug} g={g} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
