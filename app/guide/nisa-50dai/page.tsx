import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-50dai.mdx";

const G = getGuide("nisa-50dai")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-50dai" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-50dai">
      <Article />
    </GuideLayout>
  );
}
