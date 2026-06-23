import type { Metadata } from "next";
import { NisaCalculator } from "@/components/NisaCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { JsonLd } from "@/components/JsonLd";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL } from "@/lib/site";
import Article from "@/content/nisa.mdx";

const CALC = getCalculator("nisa")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "NISA積立シミュレータ｜将来の資産額・運用益を試算",
  description: CALC.description,
  alternates: { canonical: "/nisa" },
};

export default function NisaPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/nisa`,
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
          { name: "NISA積立シミュレータ" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          NISA積立シミュレータ
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          毎月の積立額・利回り・期間から、将来の
          <strong>資産額と運用益</strong>を試算します。NISAなら運用益が
          <strong>非課税</strong>。そのメリット額も表示します。
        </p>
      </header>

      <NisaCalculator />

      <RelatedCalculators slug="nisa" />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
