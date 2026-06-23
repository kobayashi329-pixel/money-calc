import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/setsuzei-700man.mdx";

const G = getGuide("setsuzei-700man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/setsuzei-700man" },
};

export default function Page() {
  return (
    <GuideLayout slug="setsuzei-700man">
      <Article />
    </GuideLayout>
  );
}
