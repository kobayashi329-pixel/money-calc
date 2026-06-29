import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-demerit.mdx";

const G = getGuide("nisa-demerit")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-demerit" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-demerit">
      <Article />
    </GuideLayout>
  );
}
