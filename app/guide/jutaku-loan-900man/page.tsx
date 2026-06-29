import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-loan-900man.mdx";

const G = getGuide("jutaku-loan-900man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-loan-900man" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-loan-900man">
      <Article />
    </GuideLayout>
  );
}
