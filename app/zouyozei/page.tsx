import type { Metadata } from "next";
import { ZouyoCalculator } from "@/components/ZouyoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/zouyozei.mdx";

const CALC = getCalculator("zouyozei")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "贈与税 計算機（暦年課税）｜贈与額から税額・手取りを試算",
  description: CALC.description,
  alternates: { canonical: "/zouyozei" },
};

export default function ZouyozeiPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/zouyozei`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "贈与税 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">贈与税 計算機（暦年課税）</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          1年間の贈与額から、<strong>贈与税（暦年課税）</strong>の税額を計算します。
          基礎控除<strong>110万円</strong>・特例税率／一般税率に対応し、税引後の手取りも表示します。
        </p>
      </header>

      <TrustNote />

      <ZouyoCalculator />

      <RelatedCalculators slug="zouyozei" />

      <RelatedGuides slug="zouyozei" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
