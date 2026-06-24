import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-nenshu-betsu.mdx";

const G = getGuide("furusato-nozei-nenshu-betsu")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-nenshu-betsu" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-nenshu-betsu">
      <Article />
    </GuideLayout>
  );
}
