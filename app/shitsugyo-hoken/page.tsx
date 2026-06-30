import type { Metadata } from "next";
import { ShitsugyoCalculator } from "@/components/ShitsugyoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/shitsugyo-hoken.mdx";

const CALC = getCalculator("shitsugyo-hoken")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "失業保険（基本手当）計算機｜日額・給付日数・受給総額の目安",
  description: CALC.description,
  alternates: { canonical: "/shitsugyo-hoken" },
  openGraph: { images: ["/og/shitsugyo-hoken"] },
  twitter: { card: "summary_large_image", images: ["/og/shitsugyo-hoken"] },
};

export default function ShitsugyoHokenPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/shitsugyo-hoken`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "失業保険 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">失業保険（基本手当）計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          離職前の月給・年齢・被保険者期間・離職理由から、雇用保険の<strong>基本手当日額・給付日数・受給総額</strong>
          の目安を計算します（令和7年8月改定の上限額に対応）。
        </p>
      </header>

      <TrustNote />

      <ShitsugyoCalculator />

      <RelatedCalculators slug="shitsugyo-hoken" />

      <RelatedGuides slug="shitsugyo-hoken" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
