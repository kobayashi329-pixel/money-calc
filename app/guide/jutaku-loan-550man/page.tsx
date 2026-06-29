import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-loan-550man.mdx";

const G = getGuide("jutaku-loan-550man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-loan-550man" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-loan-550man">
      <Article />
    </GuideLayout>
  );
}
