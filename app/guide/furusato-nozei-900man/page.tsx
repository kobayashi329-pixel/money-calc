import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { FurusatoCTA } from "@/components/FurusatoCTA";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-900man.mdx";

const G = getGuide("furusato-nozei-900man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-900man" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-900man">
      <Article />
      <FurusatoCTA />
    </GuideLayout>
  );
}
