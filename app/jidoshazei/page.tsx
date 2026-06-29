import type { Metadata } from "next";
import { JidoshazeiCalculator } from "@/components/JidoshazeiCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/jidoshazei.mdx";

const CALC = getCalculator("jidoshazei")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "自動車税 計算機（種別割）｜排気量別の年税額・軽自動車対応",
  description: CALC.description,
  alternates: { canonical: "/jidoshazei" },
  openGraph: { images: ["/og/jidoshazei"] },
  twitter: { card: "summary_large_image", images: ["/og/jidoshazei"] },
};

export default function JidoshazeiPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/jidoshazei`,
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
          { name: "自動車税 計算機" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          自動車税 計算機（種別割）
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          自家用乗用車の<strong>自動車税（種別割）</strong>の年税額を、
          <strong>総排気量</strong>と<strong>初度登録の時期</strong>から計算します。
          軽自動車・<strong>13年超の重課</strong>にも対応しています。
        </p>
      </header>

      <TrustNote />

      <JidoshazeiCalculator />

      <RelatedCalculators slug="jidoshazei" />

      <RelatedGuides slug="jidoshazei" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
