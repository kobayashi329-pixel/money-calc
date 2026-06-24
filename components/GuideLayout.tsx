import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { getGuide, relatedGuides } from "@/lib/guides";
import { getCalculator } from "@/lib/calculators";
import { SITE_URL, SITE_NAME, AD_SLOTS } from "@/lib/site";
import { AdSlot } from "./AdSlot";

// ガイド記事ページの共通レイアウト。
// パンくず・更新日・本文(MDX)・送客先の計算機・関連ガイド・構造化データを描画。
export function GuideLayout({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const guide = getGuide(slug)!;
  const targets = guide.targets
    .map((s) => getCalculator(s))
    .filter((c): c is NonNullable<typeof c> => !!c && c.status === "live");
  const related = relatedGuides(slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${SITE_URL}/guide/${guide.slug}`,
    dateModified: "2026-06-23",
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <article>
      <JsonLd data={articleJsonLd} />
      <Breadcrumbs
        items={[{ name: "ガイド", href: "/guide" }, { name: guide.shortTitle }]}
      />

      <header className="mb-2">
        <h1 className="text-2xl font-extrabold leading-snug text-slate-900 sm:text-3xl">
          {guide.title}
        </h1>
        <p className="mt-2 text-xs text-slate-400">最終更新: {guide.updated}</p>
      </header>

      {/* 送客先の計算機（記事冒頭の主要導線） */}
      {targets.length > 0 && (
        <div className="my-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-800">この記事に関連する計算機</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {targets.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                {c.emoji} {c.shortTitle}で計算 →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 本文（MDX） */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="space-y-4 text-sm leading-7 text-slate-700 [&_a]:text-emerald-700 [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:border-l-4 [&_h2]:border-emerald-500 [&_h2]:pl-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-5 [&_h3]:mb-1 [&_h3]:font-bold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-slate-900 [&_table]:w-full [&_table]:text-sm [&_th]:border-b [&_th]:border-slate-200 [&_th]:py-1.5 [&_th]:text-left [&_td]:border-b [&_td]:border-slate-100 [&_td]:py-1.5">
          {children}
        </div>
      </section>

      {/* 広告（記事末尾・承認後に表示） */}
      <AdSlot slot={AD_SLOTS.guideEnd} />

      {/* 関連ガイド */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-slate-900">関連ガイド</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
              >
                <div className="font-semibold text-slate-900">{g.shortTitle}</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">{g.description}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 計算機への再導線 */}
      {targets.length > 0 && (
        <section className="mt-8 rounded-2xl bg-slate-50 p-5 text-center">
          <p className="text-sm text-slate-600">実際の金額は、無料の計算機ですぐに試算できます。</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {targets.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                {c.emoji} {c.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
