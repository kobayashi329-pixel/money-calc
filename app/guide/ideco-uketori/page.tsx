import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/ideco-uketori.mdx";

const G = getGuide("ideco-uketori")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/ideco-uketori" },
};

export default function Page() {
  return (
    <GuideLayout slug="ideco-uketori">
      <Article />
    </GuideLayout>
  );
}
