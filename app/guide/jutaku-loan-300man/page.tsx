import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-loan-300man.mdx";

const G = getGuide("jutaku-loan-300man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-loan-300man" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-loan-300man">
      <Article />
    </GuideLayout>
  );
}
