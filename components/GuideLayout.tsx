import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { getGuide, relatedGuides, seriesNeighbors, guideSeriesInfo } from "@/lib/guides";
import { getCalculator, getCategory } from "@/lib/calculators";
import { getGuideFaq } from "@/lib/faq";
import { getGuideHeadings } from "@/lib/toc";
import { getGuideHowTo } from "@/lib/howto";
import { SITE_URL, SITE_NAME, AD_SLOTS, affiliateSlotForCategory } from "@/lib/site";
import { AdSlot } from "./AdSlot";
import { AffiliateCTA } from "./AffiliateCTA";

/** 「2026年6月24日」→「2026-06-24」。失敗時はサイト公開時期を返す。 */
function jpDateToISO(s: string): string {
  const m = s.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!m) return "2026-06-23";
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

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
  const faq = getGuideFaq(slug);
  const headings = getGuideHeadings(slug);
  const howto = getGuideHowTo(slug);
  const { prev, next } = seriesNeighbors(slug);
  const series = guideSeriesInfo(slug);
  const category = getCategory(guide.category);
  const updatedISO = jpDateToISO(guide.updated);
  const ogImage = `${SITE_URL}/og/${guide.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${SITE_URL}/guide/${guide.slug}`,
    image: [ogImage],
    datePublished: updatedISO,
    dateModified: updatedISO,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/guide/${guide.slug}` },
  };

  // よくある質問 → FAQPage 構造化データ
  const faqJsonLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  // 手順（ステップ）記事 → HowTo 構造化データ
  const howToJsonLd =
    howto.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: guide.title,
          description: guide.description,
          image: [ogImage],
          step: howto.map((s, i) => {
            // ステップ見出し型は対応する見出しのアンカーURLを付ける（番号リスト型は付けない）
            const h = headings.find((x) => x.text.includes(s.name));
            return {
              "@type": "HowToStep",
              position: i + 1,
              name: s.name,
              text: s.text,
              ...(h ? { url: `${SITE_URL}/guide/${guide.slug}#${h.id}` } : {}),
            };
          }),
        }
      : null;

  return (
    <article>
      <JsonLd data={articleJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      {howToJsonLd && <JsonLd data={howToJsonLd} />}
      <Breadcrumbs
        items={[
          { name: "ガイド", href: "/guide" },
          ...(category
            ? [{ name: category.name, href: `/guide#${guide.category}` }]
            : []),
          { name: guide.shortTitle },
        ]}
      />

      <header className="mb-2">
        <h1 className="text-2xl font-extrabold leading-snug text-slate-900 sm:text-3xl">
          {guide.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span>最終更新: {guide.updated}</span>
          <a
            href={`/pin/${guide.slug}`}
            target="_blank"
            rel="noopener"
            className="font-semibold text-emerald-700 hover:underline"
          >
            📌 画像で保存・シェア（SNS用）
          </a>
        </div>
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

      {/* シリーズのサブピラー：master記事は全記事一覧（ハブ）、各記事はmasterへの導線 */}
      {series?.isMaster && (
        <nav
          aria-label={`${series.label}シリーズの記事一覧`}
          className="my-5 rounded-xl border border-emerald-200 bg-white p-4"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-slate-800">
              📚 {series.label}シリーズ
            </span>
            <span className="text-xs text-slate-400">{series.items.length}記事</span>
          </div>
          <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
            {series.items
              .filter((g) => g.slug !== slug)
              .map((g) => (
                <li key={g.slug} className="text-sm leading-5">
                  <Link
                    href={`/guide/${g.slug}`}
                    className="text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    {g.emoji} {g.shortTitle}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      )}
      {series && !series.isMaster && (
        <div className="my-5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm">
          <Link
            href={`/guide/${series.master.slug}`}
            className="font-semibold text-emerald-700 hover:underline"
          >
            📚 {series.label}の総まとめ：{series.master.shortTitle} →
          </Link>
          <span className="ml-1.5 text-xs text-slate-400">
            （シリーズ全{series.items.length}記事）
          </span>
        </div>
      )}

      {/* 目次（H2が3つ以上ある記事のみ表示） */}
      {headings.length >= 3 && (
        <nav
          aria-label="目次"
          className="my-5 rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <div className="text-sm font-bold text-slate-700">目次</div>
          <ol className="mt-2 space-y-1.5">
            {headings.map((h, i) => (
              <li key={h.id} className="text-sm leading-5">
                <a
                  href={`#${h.id}`}
                  className="text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  <span className="mr-1.5 text-slate-400">{i + 1}.</span>
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* 本文（MDX） */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="space-y-4 text-sm leading-7 text-slate-700 [&_a]:text-emerald-700 [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:border-l-4 [&_h2]:border-emerald-500 [&_h2]:pl-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-5 [&_h3]:mb-1 [&_h3]:font-bold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-slate-900 [&_table]:w-full [&_table]:text-sm [&_th]:border-b [&_th]:border-slate-200 [&_th]:py-1.5 [&_th]:text-left [&_td]:border-b [&_td]:border-slate-100 [&_td]:py-1.5">
          {children}
        </div>
      </section>

      {/* アフィリエイト送客枠（住宅ローン・証券／提携後に表示） */}
      <AffiliateCTA slot={affiliateSlotForCategory(guide.category)} />

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

      {/* シリーズ前後ナビ（同じテーマの記事を回遊できるように） */}
      {(prev || next) && (
        <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="シリーズ内の前後の記事">
          {prev ? (
            <Link
              href={`/guide/${prev.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
            >
              <div className="text-xs text-slate-400">← 前の記事</div>
              <div className="mt-1 font-semibold text-slate-900">
                {prev.emoji} {prev.shortTitle}
              </div>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/guide/${next.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 text-right hover:shadow-md"
            >
              <div className="text-xs text-slate-400">次の記事 →</div>
              <div className="mt-1 font-semibold text-slate-900">
                {next.emoji} {next.shortTitle}
              </div>
            </Link>
          )}
        </nav>
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
