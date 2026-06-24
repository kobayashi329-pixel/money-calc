import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { FurusatoCTA } from "@/components/FurusatoCTA";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-onestop.mdx";

const G = getGuide("furusato-nozei-onestop")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-onestop" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-onestop">
      <Article />
      <FurusatoCTA />
    </GuideLayout>
  );
}
