import type { Metadata } from "next";
import { JuuminzeiCalculator } from "@/components/JuuminzeiCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { TrustNote } from "@/components/TrustNote";
import { getCalculator, getCategory } from "@/lib/calculators";
import { SITE_URL, AD_SLOTS } from "@/lib/site";
import Article from "@/content/juuminzei.mdx";

const CALC = getCalculator("juuminzei")!;
const CAT = getCategory(CALC.category)!;

export const metadata: Metadata = {
  title: "住民税 計算機｜年収から所得割・均等割の年額を試算",
  description: CALC.description,
  alternates: { canonical: "/juuminzei" },
  openGraph: { images: ["/og/juuminzei"] },
  twitter: { card: "summary_large_image", images: ["/og/juuminzei"] },
};

export default function JuuminzeiPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: CALC.title,
    url: `${SITE_URL}/juuminzei`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    description: CALC.description,
  };

  return (
    <article>
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={[{ name: CAT.name, href: `/c/${CAT.slug}` }, { name: "住民税 計算機" }]} />

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">住民税 計算機</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          年収と家族構成から、<strong>住民税（所得割10%＋均等割）</strong>の年額を計算します。
          所得控除・社会保険料を反映した概算を、内訳つきで表示します。
        </p>
      </header>

      <TrustNote />

      <JuuminzeiCalculator />

      <RelatedCalculators slug="juuminzei" />

      <RelatedGuides slug="juuminzei" />

      <AdSlot slot={AD_SLOTS.calcBottom} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
