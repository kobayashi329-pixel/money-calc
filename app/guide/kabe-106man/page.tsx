import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/kabe-106man.mdx";

const G = getGuide("kabe-106man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/kabe-106man" },
};

export default function Page() {
  return (
    <GuideLayout slug="kabe-106man">
      <Article />
    </GuideLayout>
  );
}
