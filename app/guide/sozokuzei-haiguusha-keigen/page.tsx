import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/sozokuzei-haiguusha-keigen.mdx";

const G = getGuide("sozokuzei-haiguusha-keigen")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/sozokuzei-haiguusha-keigen" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="sozokuzei-haiguusha-keigen">
      <Article />
    </GuideLayout>
  );
}
