import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jikyu-1000-1500.mdx";

const G = getGuide("jikyu-1000-1500")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jikyu-1000-1500" },
};

export default function Page() {
  return (
    <GuideLayout slug="jikyu-1000-1500">
      <Article />
    </GuideLayout>
  );
}
