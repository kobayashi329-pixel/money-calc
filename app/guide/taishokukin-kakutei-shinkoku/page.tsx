import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/taishokukin-kakutei-shinkoku.mdx";

const G = getGuide("taishokukin-kakutei-shinkoku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/taishokukin-kakutei-shinkoku" },
};

export default function Page() {
  return (
    <GuideLayout slug="taishokukin-kakutei-shinkoku">
      <Article />
    </GuideLayout>
  );
}
