import type { Metadata } from "next";
import { KoteiCalculator } from "@/components/KoteiCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/kotei-shisanzei.mdx";

const CALC = getCalculator("kotei-shisanzei")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "固定資産税・都市計画税 計算機｜評価額から年税額を試算",
  description: CALC.description,
  alternates: { canonical: "/kotei-shisanzei" },
  openGraph: { images: ["/og/kotei-shisanzei"] },
  twitter: { card: "summary_large_image", images: ["/og/kotei-shisanzei"] },
};

export default function KoteiPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/kotei-shisanzei`,
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
          { name: "固定資産税・都市計画税 計算機" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          固定資産税・都市計画税 計算機
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          土地・建物の<strong>固定資産税評価額</strong>から、
          <strong>固定資産税（1.4%）</strong>と<strong>都市計画税（0.3%）</strong>
          の年税額を計算します。住宅用地の特例・新築軽減に対応しています。
        </p>
      </header>

      <TrustNote />

      <KoteiCalculator />

      <RelatedCalculators slug="kotei-shisanzei" />

      <RelatedGuides slug="kotei-shisanzei" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
