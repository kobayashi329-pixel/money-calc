import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nenkin-nenshu-betsu.mdx";

const G = getGuide("nenkin-nenshu-betsu")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nenkin-nenshu-betsu" },
};

export default function Page() {
  return (
    <GuideLayout slug="nenkin-nenshu-betsu">
      <Article />
    </GuideLayout>
  );
}
