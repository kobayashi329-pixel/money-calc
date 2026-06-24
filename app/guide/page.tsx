import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CATEGORIES } from "@/lib/calculators";
import { guidesInCategory, liveGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "お金のガイド・解説記事一覧",
  description: `年収別の手取り、ふるさと納税の上限額・やり方、NISAとiDeCoの違いなど、お金にまつわる疑問をわかりやすく解説。計算機とあわせて使えるガイド集です。`,
  alternates: { canonical: "/guide" },
};

export default function GuideIndexPage() {
  const count = liveGuides().length;

  // ガイドのあるカテゴリだけを表示順に並べる
  const sections = CATEGORIES.map((cat) => ({
    cat,
    guides: guidesInCategory(cat.slug),
  })).filter((s) => s.guides.length > 0);

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

      {/* カテゴリへのクイックナビ（記事数が多いので素早く移動できるように） */}
      <nav
        aria-label="カテゴリ"
        className="mb-8 flex flex-wrap gap-2 border-y border-slate-100 py-3"
      >
        {sections.map(({ cat, guides }) => (
          <a
            key={cat.slug}
            href={`#${cat.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span aria-hidden>{cat.emoji}</span>
            {cat.name}
            <span className="text-xs text-slate-400">{guides.length}</span>
          </a>
        ))}
      </nav>

      {sections.map(({ cat, guides }) => (
        <section key={cat.slug} id={cat.slug} className="mb-10 scroll-mt-24">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {cat.emoji} {cat.name}
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {guides.length}記事
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="group flex h-full gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg group-hover:bg-emerald-50"
                >
                  {g.emoji}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-bold text-slate-900">{g.shortTitle}</span>
                  <span className="mt-1 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                    {g.description}
                  </span>
                  <span className="mt-3 text-sm font-semibold text-emerald-700">
                    読む →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
