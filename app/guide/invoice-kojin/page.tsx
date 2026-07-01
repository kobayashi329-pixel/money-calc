import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/invoice-kojin.mdx";

const G = getGuide("invoice-kojin")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/invoice-kojin" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="invoice-kojin">
      <Article />
    </GuideLayout>
  );
}
