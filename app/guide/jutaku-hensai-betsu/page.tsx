import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-hensai-betsu.mdx";

const G = getGuide("jutaku-hensai-betsu")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-hensai-betsu" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-hensai-betsu">
      <Article />
    </GuideLayout>
  );
}
