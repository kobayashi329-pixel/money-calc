import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/setsuzei-freelance.mdx";

const G = getGuide("setsuzei-freelance")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/setsuzei-freelance" },
};

export default function Page() {
  return (
    <GuideLayout slug="setsuzei-freelance">
      <Article />
    </GuideLayout>
  );
}
