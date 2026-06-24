import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { FurusatoCTA } from "@/components/FurusatoCTA";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-800man.mdx";

const G = getGuide("furusato-nozei-800man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-800man" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-800man">
      <Article />
      <FurusatoCTA />
    </GuideLayout>
  );
}
