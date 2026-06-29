import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-30dai.mdx";

const G = getGuide("nisa-30dai")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-30dai" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-30dai">
      <Article />
    </GuideLayout>
  );
}
