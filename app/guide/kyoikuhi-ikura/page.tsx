import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/kyoikuhi-ikura.mdx";

const G = getGuide("kyoikuhi-ikura")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/kyoikuhi-ikura" },
};

export default function Page() {
  return (
    <GuideLayout slug="kyoikuhi-ikura">
      <Article />
    </GuideLayout>
  );
}
