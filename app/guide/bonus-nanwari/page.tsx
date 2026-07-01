import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/bonus-nanwari.mdx";

const G = getGuide("bonus-nanwari")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/bonus-nanwari" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="bonus-nanwari">
      <Article />
    </GuideLayout>
  );
}
