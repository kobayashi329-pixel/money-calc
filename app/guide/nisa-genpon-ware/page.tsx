import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-genpon-ware.mdx";

const G = getGuide("nisa-genpon-ware")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-genpon-ware" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-genpon-ware">
      <Article />
    </GuideLayout>
  );
}
