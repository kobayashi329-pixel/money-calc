import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/shokibo-kyosai.mdx";

const G = getGuide("shokibo-kyosai")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/shokibo-kyosai" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="shokibo-kyosai">
      <Article />
    </GuideLayout>
  );
}
