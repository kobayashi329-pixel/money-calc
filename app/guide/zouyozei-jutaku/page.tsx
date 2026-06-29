import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/zouyozei-jutaku.mdx";

const G = getGuide("zouyozei-jutaku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/zouyozei-jutaku" },
};

export default function Page() {
  return (
    <GuideLayout slug="zouyozei-jutaku">
      <Article />
    </GuideLayout>
  );
}
