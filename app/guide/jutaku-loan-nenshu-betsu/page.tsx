import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-loan-nenshu-betsu.mdx";

const G = getGuide("jutaku-loan-nenshu-betsu")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-loan-nenshu-betsu" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-loan-nenshu-betsu">
      <Article />
    </GuideLayout>
  );
}
