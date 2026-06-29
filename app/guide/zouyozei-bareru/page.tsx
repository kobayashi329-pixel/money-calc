import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/zouyozei-bareru.mdx";

const G = getGuide("zouyozei-bareru")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/zouyozei-bareru" },
};

export default function Page() {
  return (
    <GuideLayout slug="zouyozei-bareru">
      <Article />
    </GuideLayout>
  );
}
