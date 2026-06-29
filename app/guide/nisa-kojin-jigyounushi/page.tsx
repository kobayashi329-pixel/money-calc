import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nisa-kojin-jigyounushi.mdx";

const G = getGuide("nisa-kojin-jigyounushi")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nisa-kojin-jigyounushi" },
};

export default function Page() {
  return (
    <GuideLayout slug="nisa-kojin-jigyounushi">
      <Article />
    </GuideLayout>
  );
}
