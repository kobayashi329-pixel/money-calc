import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/sozokuzei-shoukibo-takuchi.mdx";

const G = getGuide("sozokuzei-shoukibo-takuchi")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/sozokuzei-shoukibo-takuchi" },
};

export default function Page() {
  return (
    <GuideLayout slug="sozokuzei-shoukibo-takuchi">
      <Article />
    </GuideLayout>
  );
}
