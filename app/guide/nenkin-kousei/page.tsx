import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nenkin-kousei.mdx";

const G = getGuide("nenkin-kousei")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nenkin-kousei" },
};

export default function Page() {
  return (
    <GuideLayout slug="nenkin-kousei">
      <Article />
    </GuideLayout>
  );
}
