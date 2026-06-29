import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/kakutei-shinkoku-yarikata.mdx";

const G = getGuide("kakutei-shinkoku-yarikata")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/kakutei-shinkoku-yarikata" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="kakutei-shinkoku-yarikata">
      <Article />
    </GuideLayout>
  );
}
