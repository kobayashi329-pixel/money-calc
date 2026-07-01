import type { Metadata } from "next";
import { JidoCalculator } from "@/components/JidoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/jido-teate.mdx";

const CALC = getCalculator("jido-teate")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "児童手当 計算機（2024年10月拡充対応）｜月額・年額をシミュレーション",
  description: CALC.description,
  alternates: { canonical: "/jido-teate" },
  openGraph: { images: ["/og/jido-teate"] },
  twitter: { card: "summary_large_image", images: ["/og/jido-teate"] },
};

export default function JidoTeatePage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/jido-teate`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "児童手当 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">児童手当 計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          子どもの人数と年齢から、<strong>児童手当の月額・年額</strong>を計算します。
          2024年10月の拡充（<strong>高校生まで・第3子以降は月3万円・所得制限なし</strong>）に対応。
        </p>
      </header>

      <TrustNote />

      <JidoCalculator />

      <RelatedCalculators slug="jido-teate" />

      <RelatedGuides slug="jido-teate" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
