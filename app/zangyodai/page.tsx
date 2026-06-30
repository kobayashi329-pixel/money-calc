import type { Metadata } from "next";
import { ZangyoCalculator } from "@/components/ZangyoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/zangyodai.mdx";

const CALC = getCalculator("zangyodai")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "残業代 計算機（割増賃金）｜時間外・深夜・休日の残業代を計算",
  description: CALC.description,
  alternates: { canonical: "/zangyodai" },
  openGraph: { images: ["/og/zangyodai"] },
  twitter: { card: "summary_large_image", images: ["/og/zangyodai"] },
};

export default function ZangyodaiPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/zangyodai`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "残業代 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">残業代 計算機（割増賃金）</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          月給と残業時間から、<strong>時間外（25%・月60時間超50%）・深夜（25%加算）・法定休日（35%）</strong>
          の割増賃金を計算します。1時間あたりの基礎賃金も表示します。
        </p>
      </header>

      <TrustNote />

      <ZangyoCalculator />

      <RelatedCalculators slug="zangyodai" />

      <RelatedGuides slug="zangyodai" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
