import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/ideco-kakekin-jougen.mdx";

const G = getGuide("ideco-kakekin-jougen")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/ideco-kakekin-jougen" },
};

export default function Page() {
  return (
    <GuideLayout slug="ideco-kakekin-jougen">
      <Article />
    </GuideLayout>
  );
}
