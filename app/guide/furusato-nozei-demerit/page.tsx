import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { FurusatoCTA } from "@/components/FurusatoCTA";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-demerit.mdx";

const G = getGuide("furusato-nozei-demerit")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-demerit" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-demerit">
      <Article />
      <FurusatoCTA />
    </GuideLayout>
  );
}
