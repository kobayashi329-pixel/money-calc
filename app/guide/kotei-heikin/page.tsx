import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/kotei-heikin.mdx";

const G = getGuide("kotei-heikin")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/kotei-heikin" },
};

export default function Page() {
  return (
    <GuideLayout slug="kotei-heikin">
      <Article />
    </GuideLayout>
  );
}
