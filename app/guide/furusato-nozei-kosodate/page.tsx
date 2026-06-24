import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { FurusatoCTA } from "@/components/FurusatoCTA";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-kosodate.mdx";

const G = getGuide("furusato-nozei-kosodate")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-kosodate" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-kosodate">
      <Article />
      <FurusatoCTA />
    </GuideLayout>
  );
}
