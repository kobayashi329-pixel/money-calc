import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nenshu-300man-tedori.mdx";

const G = getGuide("nenshu-300man-tedori")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nenshu-300man-tedori" },
};

export default function Page() {
  return (
    <GuideLayout slug="nenshu-300man-tedori">
      <Article />
    </GuideLayout>
  );
}
