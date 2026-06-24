import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { FurusatoCTA } from "@/components/FurusatoCTA";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-400man.mdx";

const G = getGuide("furusato-nozei-400man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-400man" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-400man">
      <Article />
      <FurusatoCTA />
    </GuideLayout>
  );
}
