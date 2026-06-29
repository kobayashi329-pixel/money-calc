import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/fuyou-ikura.mdx";

const G = getGuide("fuyou-ikura")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/fuyou-ikura" },
};

export default function Page() {
  return (
    <GuideLayout slug="fuyou-ikura">
      <Article />
    </GuideLayout>
  );
}
