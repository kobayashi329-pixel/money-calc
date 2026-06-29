import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { FurusatoCTA } from "@/components/FurusatoCTA";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-450man.mdx";

const G = getGuide("furusato-nozei-450man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-450man" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-450man">
      <Article />
      <FurusatoCTA />
    </GuideLayout>
  );
}
