import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/daigaku-hiyou.mdx";

const G = getGuide("daigaku-hiyou")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/daigaku-hiyou" },
};

export default function Page() {
  return (
    <GuideLayout slug="daigaku-hiyou">
      <Article />
    </GuideLayout>
  );
}
