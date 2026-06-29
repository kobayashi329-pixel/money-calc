import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/sozokuzei-ikura-kara.mdx";

const G = getGuide("sozokuzei-ikura-kara")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/sozokuzei-ikura-kara" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="sozokuzei-ikura-kara">
      <Article />
    </GuideLayout>
  );
}
