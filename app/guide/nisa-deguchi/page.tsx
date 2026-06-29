import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-deguchi.mdx";

const G = getGuide("nisa-deguchi")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-deguchi" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-deguchi">
      <Article />
    </GuideLayout>
  );
}
