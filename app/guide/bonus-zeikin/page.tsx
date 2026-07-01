import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/bonus-zeikin.mdx";

const G = getGuide("bonus-zeikin")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/bonus-zeikin" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="bonus-zeikin">
      <Article />
    </GuideLayout>
  );
}
