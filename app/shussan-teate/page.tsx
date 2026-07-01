import type { Metadata } from "next";
import { ShussanCalculator } from "@/components/ShussanCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/shussan-teate.mdx";

const CALC = getCalculator("shussan-teate")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "出産手当金 計算機｜受給総額の目安をシミュレーション",
  description: CALC.description,
  alternates: { canonical: "/shussan-teate" },
  openGraph: { images: ["/og/shussan-teate"] },
  twitter: { card: "summary_large_image", images: ["/og/shussan-teate"] },
};

export default function ShussanTeatePage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/shussan-teate`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "出産手当金 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">出産手当金 計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          標準報酬月額（月給）から、<strong>出産手当金（標準報酬日額の2/3×98日）</strong>の
          受給総額の目安を計算します。単胎（98日）・多胎（154日）に対応。
        </p>
      </header>

      <TrustNote />

      <ShussanCalculator />

      <RelatedCalculators slug="shussan-teate" />

      <RelatedGuides slug="shussan-teate" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
