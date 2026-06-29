import type { Metadata } from "next";
import { RougoCalculator } from "@/components/RougoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/rougo-shikin.mdx";

const CALC = getCalculator("rougo-shikin")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "老後資金シミュレーション｜退職時にいくら必要かを計算",
  description: CALC.description,
  alternates: { canonical: "/rougo-shikin" },
  openGraph: { images: ["/og/rougo-shikin"] },
  twitter: { card: "summary_large_image", images: ["/og/rougo-shikin"] },
};

export default function RougoPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/rougo-shikin`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs
        items={[
          { name: CAT.name, href: `/c/${CAT.slug}` },
          { name: "老後資金シミュレーション" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          老後資金シミュレーション
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          老後の生活費と年金収入から、<strong>退職時に必要な老後資金</strong>を計算し、
          不足を埋めるために<strong>今から毎月いくら積み立てればよいか</strong>まで試算します。
        </p>
      </header>

      <TrustNote />

      <RougoCalculator />

      <RelatedCalculators slug="rougo-shikin" />

      <RelatedGuides slug="rougo-shikin" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
