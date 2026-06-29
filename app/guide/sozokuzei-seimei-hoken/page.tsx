import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/sozokuzei-seimei-hoken.mdx";

const G = getGuide("sozokuzei-seimei-hoken")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/sozokuzei-seimei-hoken" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="sozokuzei-seimei-hoken">
      <Article />
    </GuideLayout>
  );
}
