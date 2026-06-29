import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/kotei-shinchiku.mdx";

const G = getGuide("kotei-shinchiku")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/kotei-shinchiku" },
};

export default function Page() {
  return (
    <GuideLayout slug="kotei-shinchiku">
      <Article />
    </GuideLayout>
  );
}
