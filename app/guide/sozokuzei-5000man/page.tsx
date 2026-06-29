import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/sozokuzei-5000man.mdx";

const G = getGuide("sozokuzei-5000man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/sozokuzei-5000man" },
};

export default function Page() {
  return (
    <GuideLayout slug="sozokuzei-5000man">
      <Article />
    </GuideLayout>
  );
}
