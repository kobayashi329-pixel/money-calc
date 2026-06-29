import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-1000man.mdx";

const G = getGuide("nisa-1000man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-1000man" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-1000man">
      <Article />
    </GuideLayout>
  );
}
