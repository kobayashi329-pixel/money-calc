import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/nenshu-tedori-ichiran.mdx";

const G = getGuide("nenshu-tedori-ichiran")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/nenshu-tedori-ichiran" },
};

export default function Page() {
  return (
    <GuideLayout slug="nenshu-tedori-ichiran">
      <Article />
    </GuideLayout>
  );
}
