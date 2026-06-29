import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/kabe-130man.mdx";

const G = getGuide("kabe-130man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/kabe-130man" },
};

export default function Page() {
  return (
    <GuideLayout slug="kabe-130man">
      <Article />
    </GuideLayout>
  );
}
