import type { Metadata } from "next";
import { IdecoCalculator } from "@/components/IdecoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/ideco.mdx";

const CALC = getCalculator("ideco")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "iDeCo節税・積立シミュレータ（2025年・令和7年版）",
  description: CALC.description,
  alternates: { canonical: "/ideco" },
  openGraph: { images: ["/og/ideco"] },
  twitter: { card: "summary_large_image", images: ["/og/ideco"] },
};

export default function IdecoPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/ideco`,
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
          { name: "iDeCo節税・積立シミュレータ" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          iDeCo節税・積立シミュレータ
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          年収・加入区分・掛金から、掛金の所得控除による
          <strong>毎年の節税額</strong>と、65歳時点の
          <strong>積立評価額</strong>を試算します。令和7年（2025年）の制度に基づく概算です。
        </p>
      </header>

      <TrustNote />

      <IdecoCalculator />

      <RelatedCalculators slug="ideco" />

      <RelatedGuides slug="ideco" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
