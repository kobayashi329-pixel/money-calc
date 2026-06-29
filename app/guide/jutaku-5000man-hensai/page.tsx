import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-5000man-hensai.mdx";

const G = getGuide("jutaku-5000man-hensai")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-5000man-hensai" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-5000man-hensai">
      <Article />
    </GuideLayout>
  );
}
