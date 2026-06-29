import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-2500man-hensai.mdx";

const G = getGuide("jutaku-2500man-hensai")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-2500man-hensai" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-2500man-hensai">
      <Article />
    </GuideLayout>
  );
}
