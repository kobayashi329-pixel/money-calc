import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/sozokuzei-shinkoku.mdx";

const G = getGuide("sozokuzei-shinkoku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/sozokuzei-shinkoku" },
};

export default function Page() {
  return (
    <GuideLayout slug="sozokuzei-shinkoku">
      <Article />
    </GuideLayout>
  );
}
