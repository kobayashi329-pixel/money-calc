import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-tsumitate-toushiwaku.mdx";

const G = getGuide("nisa-tsumitate-toushiwaku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-tsumitate-toushiwaku" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-tsumitate-toushiwaku">
      <Article />
    </GuideLayout>
  );
}
