import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/zouyozei-oyako.mdx";

const G = getGuide("zouyozei-oyako")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/zouyozei-oyako" },
};

export default function Page() {
  return (
    <GuideLayout slug="zouyozei-oyako">
      <Article />
    </GuideLayout>
  );
}
