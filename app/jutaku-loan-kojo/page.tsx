import type { Metadata } from "next";
import { JuloanKojoCalculator } from "@/components/JuloanKojoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/jutaku-loan-kojo.mdx";

const CALC = getCalculator("jutaku-loan-kojo")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "住宅ローン控除 計算機｜年間の控除額をシミュレーション（2025年）",
  description: CALC.description,
  alternates: { canonical: "/jutaku-loan-kojo" },
  openGraph: { images: ["/og/jutaku-loan-kojo"] },
  twitter: { card: "summary_large_image", images: ["/og/jutaku-loan-kojo"] },
};

export default function JuloanKojoPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/jutaku-loan-kojo`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "住宅ローン控除 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">住宅ローン控除 計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          年末のローン残高と住宅の性能から、<strong>住宅ローン控除（減税）の年間の控除額</strong>を計算します。
          控除率<strong>0.7%</strong>・住宅性能別の借入限度額・子育て世帯の上乗せに対応（2024・2025年入居）。
        </p>
      </header>

      <TrustNote />

      <JuloanKojoCalculator />

      <RelatedCalculators slug="jutaku-loan-kojo" />

      <RelatedGuides slug="jutaku-loan-kojo" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
