import type { Metadata } from "next";
import { LifePlanCalculator } from "@/components/LifePlanCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/life-plan.mdx";

const CALC = getCalculator("life-plan")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "ライフプラン表（生涯キャッシュフロー）｜貯蓄が尽きる年齢を試算",
  description: CALC.description,
  alternates: { canonical: "/life-plan" },
};

export default function LifePlanPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/life-plan`,
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
          { name: "ライフプラン表（生涯キャッシュフロー）" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          ライフプラン表（生涯キャッシュフロー）
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          現在から想定寿命まで、毎年の<strong>収入・支出・貯蓄残高</strong>を試算します。
          <strong>貯蓄が尽きる年齢</strong>が一目でわかる、生涯のお金の設計表です。
        </p>
      </header>

      <TrustNote />

      <LifePlanCalculator />

      <RelatedCalculators slug="life-plan" />

      <RelatedGuides slug="life-plan" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
