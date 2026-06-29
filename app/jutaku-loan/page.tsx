import type { Metadata } from "next";
import { LoanCalculator } from "@/components/LoanCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/jutaku-loan.mdx";

const CALC = getCalculator("jutaku-loan")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "住宅ローン返済シミュレータ（毎月の返済額・総返済額）",
  description: CALC.description,
  alternates: { canonical: "/jutaku-loan" },
  openGraph: { images: ["/og/jutaku-loan"] },
  twitter: { card: "summary_large_image", images: ["/og/jutaku-loan"] },
};

export default function JutakuLoanPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/jutaku-loan`,
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
          { name: "住宅ローンシミュレータ" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          住宅ローン返済シミュレータ
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          借入額・金利・返済期間を入力すると、<strong>毎月の返済額・総返済額・利息総額</strong>
          を即計算します。元利均等・元金均等の両方式に対応。
        </p>
      </header>

      <TrustNote />

      <LoanCalculator />

      <RelatedCalculators slug="jutaku-loan" />

      <RelatedGuides slug="jutaku-loan" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
