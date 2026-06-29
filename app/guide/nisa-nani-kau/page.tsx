import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-nani-kau.mdx";

const G = getGuide("nisa-nani-kau")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-nani-kau" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-nani-kau">
      <Article />
    </GuideLayout>
  );
}
