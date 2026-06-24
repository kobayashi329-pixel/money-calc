import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-loan-pair.mdx";

const G = getGuide("jutaku-loan-pair")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-loan-pair" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-loan-pair">
      <Article />
    </GuideLayout>
  );
}
