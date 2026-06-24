import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/bonus-tedori.mdx";

const G = getGuide("bonus-tedori")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/bonus-tedori" },
};

export default function Page() {
  return (
    <GuideLayout slug="bonus-tedori">
      <Article />
    </GuideLayout>
  );
}
