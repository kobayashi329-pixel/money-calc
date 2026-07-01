import type { Metadata } from "next";
import { KokuhoCalculator } from "@/components/KokuhoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/kokumin-kenkohoken.mdx";

const CALC = getCalculator("kokumin-kenkohoken")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "国民健康保険料 計算機｜前年の所得から年額・月額を試算",
  description: CALC.description,
  alternates: { canonical: "/kokumin-kenkohoken" },
  openGraph: { images: ["/og/kokumin-kenkohoken"] },
  twitter: { card: "summary_large_image", images: ["/og/kokumin-kenkohoken"] },
};

export default function KokuhoPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/kokumin-kenkohoken`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "国民健康保険料 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">国民健康保険料 計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          前年の所得と加入人数から、<strong>国民健康保険料（医療分＋支援金分＋介護分）</strong>の年額・月額の目安を計算します。
          標準モデル（東京23区）を既定に、<strong>料率は自治体の値に変更</strong>できます。
        </p>
      </header>

      <TrustNote />

      <KokuhoCalculator />

      <RelatedCalculators slug="kokumin-kenkohoken" />

      <RelatedGuides slug="kokumin-kenkohoken" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
