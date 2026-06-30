import type { Metadata } from "next";
import { IkukyuCalculator } from "@/components/IkukyuCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/ikukyu-kyufu.mdx";

const CALC = getCalculator("ikukyu-kyufu")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "育児休業給付金 計算機｜67%・50%の月額と総額をシミュレーション",
  description: CALC.description,
  alternates: { canonical: "/ikukyu-kyufu" },
  openGraph: { images: ["/og/ikukyu-kyufu"] },
  twitter: { card: "summary_large_image", images: ["/og/ikukyu-kyufu"] },
};

export default function IkukyuKyufuPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/ikukyu-kyufu`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "育児休業給付金 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">育児休業給付金 計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          休業前の月給と育休の取得月数から、育児休業給付金（<strong>最初の6か月は67%・以降50%</strong>）の
          月額と総額を計算します（令和7年8月改定の支給上限に対応）。
        </p>
      </header>

      <TrustNote />

      <IkukyuCalculator />

      <RelatedCalculators slug="ikukyu-kyufu" />

      <RelatedGuides slug="ikukyu-kyufu" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
