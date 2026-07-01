import type { Metadata } from "next";
import { ShotokuCalculator } from "@/components/ShotokuCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/shotokuzei.mdx";

const CALC = getCalculator("shotokuzei")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "所得税 計算機（速算表）｜課税所得から所得税を計算",
  description: CALC.description,
  alternates: { canonical: "/shotokuzei" },
  openGraph: { images: ["/og/shotokuzei"] },
  twitter: { card: "summary_large_image", images: ["/og/shotokuzei"] },
};

export default function ShotokuzeiPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/shotokuzei`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "所得税 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">所得税 計算機（速算表）</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          課税所得から、<strong>所得税（速算表・超過累進）と復興特別所得税</strong>を計算します。
          5〜45%の税率と控除額に対応し、限界税率も表示します。
        </p>
      </header>

      <TrustNote />

      <ShotokuCalculator />

      <RelatedCalculators slug="shotokuzei" />

      <RelatedGuides slug="shotokuzei" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
