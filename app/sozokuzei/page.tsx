import type { Metadata } from "next";
import { SozokuCalculator } from "@/components/SozokuCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/sozokuzei.mdx";

const CALC = getCalculator("sozokuzei")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "相続税計算機｜基礎控除・配偶者の税額軽減に対応",
  description: CALC.description,
  alternates: { canonical: "/sozokuzei" },
  openGraph: { images: ["/og/sozokuzei"] },
  twitter: { card: "summary_large_image", images: ["/og/sozokuzei"] },
};

export default function SozokuPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/sozokuzei`,
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
          { name: "相続税計算機" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          相続税計算機
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          遺産の総額と家族構成から、<strong>基礎控除</strong>・
          <strong>相続税の総額</strong>・<strong>配偶者の税額軽減</strong>を反映した
          納税額の目安を計算します。
        </p>
      </header>

      <TrustNote />

      <SozokuCalculator />

      <RelatedCalculators slug="sozokuzei" />

      <RelatedGuides slug="sozokuzei" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
