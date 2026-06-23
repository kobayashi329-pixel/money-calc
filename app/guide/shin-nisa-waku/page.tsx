import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/shin-nisa-waku.mdx";

const G = getGuide("shin-nisa-waku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/shin-nisa-waku" },
};

export default function Page() {
  return (
    <GuideLayout slug="shin-nisa-waku">
      <Article />
    </GuideLayout>
  );
}
