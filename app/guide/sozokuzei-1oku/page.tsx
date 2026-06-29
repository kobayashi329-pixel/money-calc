import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/sozokuzei-1oku.mdx";

const G = getGuide("sozokuzei-1oku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/sozokuzei-1oku" },
};

export default function Page() {
  return (
    <GuideLayout slug="sozokuzei-1oku">
      <Article />
    </GuideLayout>
  );
}
