import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/taishokukin-2000man.mdx";

const G = getGuide("taishokukin-2000man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/taishokukin-2000man" },
};

export default function Page() {
  return (
    <GuideLayout slug="taishokukin-2000man">
      <Article />
    </GuideLayout>
  );
}
