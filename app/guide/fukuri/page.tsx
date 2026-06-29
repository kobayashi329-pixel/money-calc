import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/fukuri.mdx";

const G = getGuide("fukuri")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/fukuri" },
};

export default function Page() {
  return (
    <GuideLayout slug="fukuri">
      <Article />
    </GuideLayout>
  );
}
