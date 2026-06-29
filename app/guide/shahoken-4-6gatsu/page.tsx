import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/shahoken-4-6gatsu.mdx";

const G = getGuide("shahoken-4-6gatsu")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/shahoken-4-6gatsu" },
};

export default function Page() {
  return (
    <GuideLayout slug="shahoken-4-6gatsu">
      <Article />
    </GuideLayout>
  );
}
