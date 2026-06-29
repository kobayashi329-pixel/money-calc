import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/zouyozei-rekinen.mdx";

const G = getGuide("zouyozei-rekinen")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/zouyozei-rekinen" },
};

export default function Page() {
  return (
    <GuideLayout slug="zouyozei-rekinen">
      <Article />
    </GuideLayout>
  );
}
