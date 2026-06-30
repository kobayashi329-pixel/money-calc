import type { Metadata } from "next";
import { KuriageCalculator } from "@/components/KuriageCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/kuriage-hensai.mdx";

const CALC = getCalculator("kuriage-hensai")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "住宅ローン繰り上げ返済シミュレータ｜期間短縮型・返済額軽減型を比較",
  description: CALC.description,
  alternates: { canonical: "/kuriage-hensai" },
  openGraph: { images: ["/og/kuriage-hensai"] },
  twitter: { card: "summary_large_image", images: ["/og/kuriage-hensai"] },
};

export default function KuriagePage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/kuriage-hensai`,
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
          { name: "住宅ローン繰り上げ返済シミュレータ" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          住宅ローン繰り上げ返済シミュレータ
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          繰り上げ返済で<strong>利息がいくら減るか</strong>を、
          <strong>期間短縮型</strong>と<strong>返済額軽減型</strong>で比較できます。
          元利均等返済を前提とした概算です。
        </p>
      </header>

      <TrustNote />

      <KuriageCalculator />

      <RelatedCalculators slug="kuriage-hensai" />

      <RelatedGuides slug="kuriage-hensai" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
