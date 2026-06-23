import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nenshu-600man-tedori.mdx";

const G = getGuide("nenshu-600man-tedori")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nenshu-600man-tedori" },
};

export default function Page() {
  return (
    <GuideLayout slug="nenshu-600man-tedori">
      <Article />
    </GuideLayout>
  );
}
