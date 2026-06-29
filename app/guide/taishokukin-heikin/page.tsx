import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/taishokukin-heikin.mdx";

const G = getGuide("taishokukin-heikin")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/taishokukin-heikin" },
};

export default function Page() {
  return (
    <GuideLayout slug="taishokukin-heikin">
      <Article />
    </GuideLayout>
  );
}
