import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-3000man-hensai.mdx";

const G = getGuide("jutaku-3000man-hensai")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-3000man-hensai" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-3000man-hensai">
      <Article />
    </GuideLayout>
  );
}
