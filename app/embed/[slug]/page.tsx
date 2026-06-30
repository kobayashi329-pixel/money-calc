import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EMBEDDABLE } from "@/components/embeddableCalculators";
import { getCalculator, liveCalculators } from "@/lib/calculators";
import { SITE_URL, SITE_NAME } from "@/lib/site";

// 外部サイトへの埋め込み（iframe）用の軽量ページ。
// 計算機本体だけを表示し、末尾に出典リンク（被リンク）を付ける。
// 検索結果には出さない（noindex）＝正規ページはcanonicalで本体URLを指す。

export function generateStaticParams() {
  return liveCalculators()
    .filter((c) => EMBEDDABLE[c.slug])
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) return {};
  return {
    title: `${calc.title}（埋め込み）`,
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE_URL}/${slug}` },
  };
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  const Calc = EMBEDDABLE[slug];
  if (!calc || !Calc) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Calc />

      {/* 出典・運営元への導線（埋め込み先からの被リンク） */}
      <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        <span>
          🧮 <strong className="text-slate-700">{calc.title}</strong>
        </span>
        <a
          href={`${SITE_URL}/${slug}?utm_source=embed`}
          target="_blank"
          rel="noopener"
          className="shrink-0 font-semibold text-emerald-700 hover:underline"
        >
          Powered by {SITE_NAME} →
        </a>
      </div>
    </div>
  );
}
