import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/furusato-nozei-700man.mdx";

const G = getGuide("furusato-nozei-700man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/furusato-nozei-700man" },
};

export default function Page() {
  return (
    <GuideLayout slug="furusato-nozei-700man">
      <Article />
    </GuideLayout>
  );
}
