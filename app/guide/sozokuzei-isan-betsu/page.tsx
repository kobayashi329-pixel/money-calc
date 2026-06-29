import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/sozokuzei-isan-betsu.mdx";

const G = getGuide("sozokuzei-isan-betsu")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/sozokuzei-isan-betsu" },
};

export default function Page() {
  return (
    <GuideLayout slug="sozokuzei-isan-betsu">
      <Article />
    </GuideLayout>
  );
}
