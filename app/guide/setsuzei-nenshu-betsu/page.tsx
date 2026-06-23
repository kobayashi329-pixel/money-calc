import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/setsuzei-nenshu-betsu.mdx";

const G = getGuide("setsuzei-nenshu-betsu")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/setsuzei-nenshu-betsu" },
};

export default function Page() {
  return (
    <GuideLayout slug="setsuzei-nenshu-betsu">
      <Article />
    </GuideLayout>
  );
}
