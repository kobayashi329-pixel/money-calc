import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/zouyozei-ikura.mdx";

const G = getGuide("zouyozei-ikura")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/zouyozei-ikura" },
};

export default function Page() {
  return (
    <GuideLayout slug="zouyozei-ikura">
      <Article />
    </GuideLayout>
  );
}
