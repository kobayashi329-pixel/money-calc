import type { Metadata } from "next";
import { ShoubyoCalculator } from "@/components/ShoubyoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/shoubyo-teate.mdx";

const CALC = getCalculator("shoubyo-teate")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "傷病手当金 計算機｜1日あたり・受給総額の目安を計算",
  description: CALC.description,
  alternates: { canonical: "/shoubyo-teate" },
  openGraph: { images: ["/og/shoubyo-teate"] },
  twitter: { card: "summary_large_image", images: ["/og/shoubyo-teate"] },
};

export default function ShoubyoTeatePage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/shoubyo-teate`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "傷病手当金 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">傷病手当金 計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          標準報酬月額（月給）と休んだ日数から、<strong>傷病手当金（標準報酬日額の2/3）</strong>の
          1日あたり・受給総額の目安を計算します（待期3日・通算1年6か月に対応）。
        </p>
      </header>

      <TrustNote />

      <ShoubyoCalculator />

      <RelatedCalculators slug="shoubyo-teate" />

      <RelatedGuides slug="shoubyo-teate" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
