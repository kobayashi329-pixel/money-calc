import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-seichou-toushiwaku.mdx";

const G = getGuide("nisa-seichou-toushiwaku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-seichou-toushiwaku" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-seichou-toushiwaku">
      <Article />
    </GuideLayout>
  );
}
