import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nenshu-no-kabe.mdx";

const G = getGuide("nenshu-no-kabe")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nenshu-no-kabe" },
};

export default function Page() {
  return (
    <GuideLayout slug="nenshu-no-kabe">
      <Article />
    </GuideLayout>
  );
}
