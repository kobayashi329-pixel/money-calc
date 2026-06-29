import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/sozokuzei-niji.mdx";

const G = getGuide("sozokuzei-niji")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/sozokuzei-niji" },
};

export default function Page() {
  return (
    <GuideLayout slug="sozokuzei-niji">
      <Article />
    </GuideLayout>
  );
}
