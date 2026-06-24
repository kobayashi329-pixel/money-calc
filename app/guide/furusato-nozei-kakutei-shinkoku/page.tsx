import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { FurusatoCTA } from "@/components/FurusatoCTA";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-kakutei-shinkoku.mdx";

const G = getGuide("furusato-nozei-kakutei-shinkoku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-kakutei-shinkoku" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-kakutei-shinkoku">
      <Article />
      <FurusatoCTA />
    </GuideLayout>
  );
}
