import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-loan-atamakin.mdx";

const G = getGuide("jutaku-loan-atamakin")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-loan-atamakin" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-loan-atamakin">
      <Article />
    </GuideLayout>
  );
}
