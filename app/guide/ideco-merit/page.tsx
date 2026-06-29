import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/ideco-merit.mdx";

const G = getGuide("ideco-merit")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/ideco-merit" },
};

export default function Page() {
  return (
    <GuideLayout slug="ideco-merit">
      <Article />
    </GuideLayout>
  );
}
