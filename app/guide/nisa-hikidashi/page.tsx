import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-hikidashi.mdx";

const G = getGuide("nisa-hikidashi")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-hikidashi" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-hikidashi">
      <Article />
    </GuideLayout>
  );
}
