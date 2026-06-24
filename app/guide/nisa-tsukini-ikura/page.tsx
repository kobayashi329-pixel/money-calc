import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-tsukini-ikura.mdx";

const G = getGuide("nisa-tsukini-ikura")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-tsukini-ikura" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-tsukini-ikura">
      <Article />
    </GuideLayout>
  );
}
