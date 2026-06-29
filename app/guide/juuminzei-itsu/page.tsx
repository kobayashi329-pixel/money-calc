import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/juuminzei-itsu.mdx";

const G = getGuide("juuminzei-itsu")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/juuminzei-itsu" },
};

export default function Page() {
  return (
    <GuideLayout slug="juuminzei-itsu">
      <Article />
    </GuideLayout>
  );
}
