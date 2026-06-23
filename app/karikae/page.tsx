import type { Metadata } from "next";
import { KarikaeCalculator } from "@/components/KarikaeCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL } from "@/lib/site";
import Article from "@/content/karikae.mdx";

const CALC = getCalculator("karikae")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "住宅ローン借り換え比較シミュレータ｜正味メリットを試算",
  description: CALC.description,
  alternates: { canonical: "/karikae" },
};

export default function KarikaePage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/karikae`,
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
          { name: "住宅ローン借り換え比較シミュレータ" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          住宅ローン借り換え比較シミュレータ
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          今のローンと借り換え後を比べて、毎月の返済額・総返済額がどれだけ減るか、
          <strong>諸費用を引いた正味のメリット</strong>を試算します。元利均等返済を前提とした概算です。
        </p>
      </header>

      <TrustNote />

      <KarikaeCalculator />

      <RelatedCalculators slug="karikae" />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
