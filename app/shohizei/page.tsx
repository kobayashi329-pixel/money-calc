import type { Metadata } from "next";
import { ShohizeiCalculator } from "@/components/ShohizeiCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/shohizei.mdx";

const CALC = getCalculator("shohizei")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "消費税・インボイス計算機｜税込・税抜の変換、8%/10%対応",
  description: CALC.description,
  alternates: { canonical: "/shohizei" },
};

export default function ShohizeiPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/shohizei`,
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
          { name: "消費税・インボイス計算機" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          消費税・インボイス計算機
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          <strong>税抜⇔税込</strong>の変換と消費税額を計算します。
          軽減税率<strong>8%</strong>・標準税率<strong>10%</strong>、
          端数処理（切り捨て・四捨五入・切り上げ）に対応しています。
        </p>
      </header>

      <TrustNote />

      <ShohizeiCalculator />

      <RelatedCalculators slug="shohizei" />

      <RelatedGuides slug="shohizei" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
