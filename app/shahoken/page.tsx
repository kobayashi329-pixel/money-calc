import type { Metadata } from "next";
import { ShahoCalculator } from "@/components/ShahoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/shahoken.mdx";

const CALC = getCalculator("shahoken")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "社会保険料 計算機｜年収から健康保険・厚生年金などの負担を試算",
  description: CALC.description,
  alternates: { canonical: "/shahoken" },
  openGraph: { images: ["/og/shahoken"] },
  twitter: { card: "summary_large_image", images: ["/og/shahoken"] },
};

export default function ShahokenPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/shahoken`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "社会保険料 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">社会保険料 計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          年収と年齢から、<strong>健康保険・介護保険・厚生年金・雇用保険</strong>の
          本人負担分（年額・月額）を計算します。都道府県別の健康保険料率に対応した概算です。
        </p>
      </header>

      <TrustNote />

      <ShahoCalculator />

      <RelatedCalculators slug="shahoken" />

      <RelatedGuides slug="shahoken" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
