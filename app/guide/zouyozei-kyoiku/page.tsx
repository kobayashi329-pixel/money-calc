import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/zouyozei-kyoiku.mdx";

const G = getGuide("zouyozei-kyoiku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/zouyozei-kyoiku" },
};

export default function Page() {
  return (
    <GuideLayout slug="zouyozei-kyoiku">
      <Article />
    </GuideLayout>
  );
}
