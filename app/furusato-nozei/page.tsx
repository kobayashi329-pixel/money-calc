import type { Metadata } from "next";
import { FurusatoCalculator } from "@/components/FurusatoCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { JsonLd } from "@/components/JsonLd";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL } from "@/lib/site";
import Article from "@/content/furusato-nozei.mdx";

const CALC = getCalculator("furusato-nozei")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "ふるさと納税 上限額シミュレータ（2025年・令和7年版）",
  description: CALC.description,
  alternates: { canonical: "/furusato-nozei" },
};

export default function FurusatoPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/furusato-nozei`,
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
          { name: "ふるさと納税 上限額シミュレータ" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          ふるさと納税 上限額シミュレータ
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          年収と家族構成を入力すると、自己負担
          <strong>2,000円</strong>で全額が控除される
          <strong>寄付の上限額</strong>の目安を計算します。
          令和7年（2025年）の制度に基づく概算です。
        </p>
      </header>

      <FurusatoCalculator />

      {/* 関連する計算機（内部リンク） */}
      <RelatedCalculators slug="furusato-nozei" />

      {/* ===== 解説記事（MDX・SEO/審査用） ===== */}
      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
