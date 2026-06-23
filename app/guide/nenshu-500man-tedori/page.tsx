import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nenshu-500man-tedori.mdx";

const G = getGuide("nenshu-500man-tedori")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nenshu-500man-tedori" },
};

export default function Page() {
  return (
    <GuideLayout slug="nenshu-500man-tedori">
      <Article />
    </GuideLayout>
  );
}
