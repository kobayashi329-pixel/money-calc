import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nenkin-kurisage.mdx";

const G = getGuide("nenkin-kurisage")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nenkin-kurisage" },
};

export default function Page() {
  return (
    <GuideLayout slug="nenkin-kurisage">
      <Article />
    </GuideLayout>
  );
}
