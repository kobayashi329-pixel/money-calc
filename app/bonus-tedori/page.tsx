import type { Metadata } from "next";
import { BonusCalculator } from "@/components/BonusCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/bonus-tedori.mdx";

const CALC = getCalculator("bonus-tedori")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "ボーナス手取り計算機｜賞与から社会保険料・所得税を引いた手取りを計算",
  description: CALC.description,
  alternates: { canonical: "/bonus-tedori" },
  openGraph: { images: ["/og/bonus-tedori"] },
  twitter: { card: "summary_large_image", images: ["/og/bonus-tedori"] },
};

export default function BonusTedoriPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/bonus-tedori`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs
        items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "ボーナス手取り計算機" }]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          ボーナス手取り計算機
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          賞与（ボーナス）の総支給額から、<strong>社会保険料（健康保険・厚生年金など）と所得税（源泉徴収）</strong>
          を差し引いた手取り額を計算します。前月の給与と扶養人数から源泉税率を求める、実際の給与計算に近い概算です。
        </p>
      </header>

      <TrustNote />

      <BonusCalculator />

      <RelatedCalculators slug="bonus-tedori" />

      <RelatedGuides slug="bonus-tedori" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
