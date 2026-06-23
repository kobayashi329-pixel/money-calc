import type { Metadata } from "next";
import { TakeHomeCalculator } from "@/components/TakeHomeCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL } from "@/lib/site";
import Article from "@/content/tedori.mdx";

const CALC = getCalculator("tedori")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "年収手取り計算機（2025年・令和7年版）",
  description: CALC.description,
  alternates: { canonical: "/tedori" },
};

export default function TedoriPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/tedori`,
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
          { name: "年収手取り計算機" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          年収手取り計算機
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          額面年収を入力すると、所得税・住民税・社会保険料を差し引いた
          <strong>手取り額</strong>を内訳つきで計算します。
          令和7年（2025年）の制度に基づく概算です。
        </p>
      </header>

      <TrustNote />

      <TakeHomeCalculator />

      {/* 関連する計算機（内部リンク） */}
      <RelatedCalculators slug="tedori" />

      {/* ===== 解説記事（MDX・SEO/審査用） ===== */}
      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
