import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/kuriage-karikae-dochira.mdx";

const G = getGuide("kuriage-karikae-dochira")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/kuriage-karikae-dochira" },
};

export default function Page() {
  return (
    <GuideLayout slug="kuriage-karikae-dochira">
      <Article />
    </GuideLayout>
  );
}
