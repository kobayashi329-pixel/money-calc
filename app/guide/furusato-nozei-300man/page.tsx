import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { FurusatoCTA } from "@/components/FurusatoCTA";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-300man.mdx";

const G = getGuide("furusato-nozei-300man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-300man" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-300man">
      <Article />
      <FurusatoCTA />
    </GuideLayout>
  );
}
