import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/juuminzei-ikura.mdx";

const G = getGuide("juuminzei-ikura")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/juuminzei-ikura" },
};

export default function Page() {
  return (
    <GuideLayout slug="juuminzei-ikura">
      <Article />
    </GuideLayout>
  );
}
