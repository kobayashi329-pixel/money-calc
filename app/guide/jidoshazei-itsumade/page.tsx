import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jidoshazei-itsumade.mdx";

const G = getGuide("jidoshazei-itsumade")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jidoshazei-itsumade" },
};

export default function Page() {
  return (
    <GuideLayout slug="jidoshazei-itsumade">
      <Article />
    </GuideLayout>
  );
}
