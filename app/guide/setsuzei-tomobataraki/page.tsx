import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/setsuzei-tomobataraki.mdx";

const G = getGuide("setsuzei-tomobataraki")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/setsuzei-tomobataraki" },
};

export default function Page() {
  return (
    <GuideLayout slug="setsuzei-tomobataraki">
      <Article />
    </GuideLayout>
  );
}
