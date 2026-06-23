import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/taishokukin-zeikin.mdx";

const G = getGuide("taishokukin-zeikin")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/taishokukin-zeikin" },
};

export default function Page() {
  return (
    <GuideLayout slug="taishokukin-zeikin">
      <Article />
    </GuideLayout>
  );
}
