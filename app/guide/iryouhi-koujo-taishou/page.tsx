import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/iryouhi-koujo-taishou.mdx";

const G = getGuide("iryouhi-koujo-taishou")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/iryouhi-koujo-taishou" },
  openGraph: { images: [`/og/${G.slug}`] },
  twitter: { card: "summary_large_image", images: [`/og/${G.slug}`] },
};

export default function Page() {
  return (
    <GuideLayout slug="iryouhi-koujo-taishou">
      <Article />
    </GuideLayout>
  );
}
