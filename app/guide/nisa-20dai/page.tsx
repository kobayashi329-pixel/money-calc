import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-20dai.mdx";

const G = getGuide("nisa-20dai")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-20dai" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-20dai">
      <Article />
    </GuideLayout>
  );
}
