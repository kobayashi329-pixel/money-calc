import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/ideco-demerit.mdx";

const G = getGuide("ideco-demerit")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/ideco-demerit" },
};

export default function Page() {
  return (
    <GuideLayout slug="ideco-demerit">
      <Article />
    </GuideLayout>
  );
}
