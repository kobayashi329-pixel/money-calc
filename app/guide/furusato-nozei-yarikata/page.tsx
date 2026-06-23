import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-yarikata.mdx";

const G = getGuide("furusato-nozei-yarikata")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-yarikata" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-yarikata">
      <Article />
    </GuideLayout>
  );
}
