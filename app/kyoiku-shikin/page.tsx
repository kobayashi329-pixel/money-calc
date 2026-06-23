import type { Metadata } from "next";
import { KyoikuCalculator } from "@/components/KyoikuCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL } from "@/lib/site";
import Article from "@/content/kyoiku-shikin.mdx";

const CALC = getCalculator("kyoiku-shikin")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "教育資金シミュレーション｜幼稚園〜大学の教育費はいくら？",
  description: CALC.description,
  alternates: { canonical: "/kyoiku-shikin" },
};

export default function KyoikuPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/kyoiku-shikin`,
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
          { name: "教育資金シミュレーション" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          教育資金シミュレーション
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          幼稚園から大学までの進路（<strong>公立／私立</strong>）を選ぶと、
          <strong>教育費の総額</strong>を試算します。まとまった資金が必要な
          <strong>大学費用を貯める毎月の積立額</strong>も計算できます。
        </p>
      </header>

      <TrustNote />

      <KyoikuCalculator />

      <RelatedCalculators slug="kyoiku-shikin" />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
