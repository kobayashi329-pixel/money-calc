import type { Metadata } from "next";
import { TaishokuCalculator } from "@/components/TaishokuCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { JsonLd } from "@/components/JsonLd";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL } from "@/lib/site";
import Article from "@/content/taishokukin.mdx";

const CALC = getCalculator("taishokukin")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "退職金の手取り・税金計算機（2025年・令和7年版）",
  description: CALC.description,
  alternates: { canonical: "/taishokukin" },
};

export default function TaishokuPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/taishokukin`,
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
          { name: "退職金の手取り・税金計算" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          退職金の手取り・税金計算
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          退職金の額と勤続年数から、<strong>退職所得控除</strong>・
          所得税・住民税を差し引いた<strong>手取り額</strong>を計算します。
          令和7年（2025年）の制度に基づく概算です。
        </p>
      </header>

      <TaishokuCalculator />

      <RelatedCalculators slug="taishokukin" />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
