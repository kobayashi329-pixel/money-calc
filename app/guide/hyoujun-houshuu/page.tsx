import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/hyoujun-houshuu.mdx";

const G = getGuide("hyoujun-houshuu")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/hyoujun-houshuu" },
};

export default function Page() {
  return (
    <GuideLayout slug="hyoujun-houshuu">
      <Article />
    </GuideLayout>
  );
}
