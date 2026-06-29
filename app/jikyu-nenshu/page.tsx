import type { Metadata } from "next";
import { JikyuCalculator } from "@/components/JikyuCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/jikyu-nenshu.mdx";

const CALC = getCalculator("jikyu-nenshu")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "時給・月給・年収 換算機｜時給からいくら？を一発計算",
  description: CALC.description,
  alternates: { canonical: "/jikyu-nenshu" },
  openGraph: { images: ["/og/jikyu-nenshu"] },
  twitter: { card: "summary_large_image", images: ["/og/jikyu-nenshu"] },
};

export default function JikyuPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/jikyu-nenshu`,
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
          { name: "時給・月給・年収 換算機" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          時給・月給・年収 換算機
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          <strong>時給・日給・月給・年収</strong>を相互に換算します。
          「この時給だと年収はいくら？」を、労働時間・日数を指定して即計算できます。
        </p>
      </header>

      <TrustNote />

      <JikyuCalculator />

      <RelatedCalculators slug="jikyu-nenshu" />

      <RelatedGuides slug="jikyu-nenshu" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
