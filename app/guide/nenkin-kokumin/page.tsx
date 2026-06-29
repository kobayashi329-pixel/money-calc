import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nenkin-kokumin.mdx";

const G = getGuide("nenkin-kokumin")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nenkin-kokumin" },
};

export default function Page() {
  return (
    <GuideLayout slug="nenkin-kokumin">
      <Article />
    </GuideLayout>
  );
}
