import type { Metadata } from "next";
import { IryouhiCalculator } from "@/components/IryouhiCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { EmbedCite } from "@/components/EmbedCite";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/iryouhi-koujo.mdx";

const CALC = getCalculator("iryouhi-koujo")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "医療費控除 計算機｜いくら戻るかシミュレーション",
  description: CALC.description,
  alternates: { canonical: "/iryouhi-koujo" },
  openGraph: { images: ["/og/iryouhi-koujo"] },
  twitter: { card: "summary_large_image", images: ["/og/iryouhi-koujo"] },
};

export default function IryouhiKoujoPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/iryouhi-koujo`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "医療費控除 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">医療費控除 計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          1年間の医療費と所得から、<strong>医療費控除でいくら税金が戻るか</strong>を計算します。
          10万円の足切り・保険金の補填・所得税率＋住民税10%を反映した軽減額の目安を表示します。
        </p>
      </header>

      <TrustNote />

      <IryouhiCalculator />

      <RelatedCalculators slug="iryouhi-koujo" />

      <RelatedGuides slug="iryouhi-koujo" />

      <EmbedCite slug={CALC.slug} title={CALC.title} />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
