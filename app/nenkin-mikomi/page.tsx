import type { Metadata } from "next";
import { NenkinCalculator } from "@/components/NenkinCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/nenkin-mikomi.mdx";

const CALC = getCalculator("nenkin-mikomi")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "公的年金 受給見込み額シミュレーション（令和7年度）｜将来もらえる年金を計算",
  description: CALC.description,
  alternates: { canonical: "/nenkin-mikomi" },
  openGraph: { images: ["/og/nenkin-mikomi"] },
  twitter: { card: "summary_large_image", images: ["/og/nenkin-mikomi"] },
};

export default function NenkinPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/nenkin-mikomi`,
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
          { name: "公的年金 受給見込み額シミュレーション" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          公的年金 受給見込み額シミュレーション
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          加入年数と平均年収から、将来受け取れる<strong>老齢基礎年金</strong>と
          <strong>老齢厚生年金</strong>の見込み額を概算します。
          <strong>繰上げ・繰下げ受給</strong>による増減も確認できます。令和7年度の年金額に基づく概算です。
        </p>
      </header>

      <TrustNote />

      <NenkinCalculator />

      <RelatedCalculators slug="nenkin-mikomi" />

      <RelatedGuides slug="nenkin-mikomi" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
