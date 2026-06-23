import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/rougo-2000man.mdx";

const G = getGuide("rougo-2000man")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/rougo-2000man" },
};

export default function Page() {
  return (
    <GuideLayout slug="rougo-2000man">
      <Article />
    </GuideLayout>
  );
}
