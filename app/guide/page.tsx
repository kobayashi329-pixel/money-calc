import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CATEGORIES } from "@/lib/calculators";
import {
  guideSeriesGroups,
  liveGuides,
  type Guide,
} from "@/lib/guides";

export const metadata: Metadata = {
  title: "お金のガイド・解説記事一覧",
  description: `年収別の手取り、ふるさと納税の上限額・やり方、NISAとiDeCoの違いなど、お金にまつわる疑問をわかりやすく解説。計算機とあわせて使えるガイド集です。`,
  alternates: { canonical: "/guide" },
};

// シリーズ内で常に表示する件数（超過分は折りたたみ）
const VISIBLE_PER_SERIES = 6;

/** 一覧用のスリムなガイドカード（emoji＋短いタイトル＋1行説明） */
function GuideCard({ g, lead }: { g: Guide; lead?: boolean }) {
  return (
    <Link
      href={`/guide/${g.slug}`}
      className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-emerald-300 hover:shadow-sm"
    >
      <span
        aria-hidden
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-base group-hover:bg-emerald-50"
      >
        {g.emoji}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-900">{g.shortTitle}</span>
          {lead && (
            <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
              代表記事
            </span>
          )}
        </span>
        <span className="mt-0.5 line-clamp-1 text-xs leading-5 text-slate-500">
          {g.description}
        </span>
      </span>
    </Link>
  );
}

export default function GuideIndexPage() {
  const count = liveGuides().length;

  // ガイドのあるカテゴリだけを「シリーズ単位」に束ねて表示する
  const sections = CATEGORIES.map((cat) => ({
    cat,
    ...guideSeriesGroups(cat.slug),
  })).filter((s) => s.groups.length > 0 || s.others.length > 0);

  return (
    <div>
      <Breadcrumbs items={[{ name: "ガイド" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          お金のガイド・解説記事
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          年収別の手取り、ふるさと納税の上限額・やり方、NISAとiDeCoの違いなど、お金にまつわる疑問を
          公的資料に基づいてわかりやすく解説します。記事から関連する計算機ですぐに試算できます。
          全<strong>{count}</strong>記事（順次追加中）。
        </p>
      </header>

      {/* カテゴリへのクイックナビ */}
      <nav
        aria-label="カテゴリ"
        className="mb-8 flex flex-wrap gap-2 border-y border-slate-100 py-3"
      >
        {sections.map(({ cat, groups, others }) => (
          <a
            key={cat.slug}
            href={`#${cat.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span aria-hidden>{cat.emoji}</span>
            {cat.name}
            <span className="text-xs text-slate-400">
              {groups.reduce((n, g) => n + g.items.length, 0) + others.length}
            </span>
          </a>
        ))}
      </nav>

      {sections.map(({ cat, groups, others }) => (
        <section key={cat.slug} id={cat.slug} className="mb-12 scroll-mt-24">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <h2 className="text-lg font-bold text-slate-900">
              {cat.emoji} {cat.name}
            </h2>
          </div>

          {/* シリーズ別グループ */}
          <div className="space-y-7">
            {groups.map((grp) => {
              const visible = grp.items.slice(0, VISIBLE_PER_SERIES);
              const hidden = grp.items.slice(VISIBLE_PER_SERIES);
              return (
                <div key={grp.key}>
                  <h3 className="mb-2.5 flex items-baseline gap-2 text-sm font-bold text-slate-700">
                    {grp.label}
                    <span className="text-xs font-medium text-slate-400">
                      {grp.items.length}記事
                    </span>
                  </h3>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {visible.map((g) => (
                      <GuideCard
                        key={g.slug}
                        g={g}
                        lead={g.slug === grp.lead.slug}
                      />
                    ))}
                  </div>
                  {hidden.length > 0 && (
                    <details className="mt-2.5 group">
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

            {/* どのシリーズにも属さない単発記事 */}
            {others.length > 0 && (
              <div>
                {groups.length > 0 && (
                  <h3 className="mb-2.5 flex items-baseline gap-2 text-sm font-bold text-slate-700">
                    その他
                    <span className="text-xs font-medium text-slate-400">
                      {others.length}記事
                    </span>
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
      ))}
    </div>
  );
}
