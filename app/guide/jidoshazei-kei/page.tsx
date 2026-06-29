import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jidoshazei-kei.mdx";

const G = getGuide("jidoshazei-kei")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jidoshazei-kei" },
};

export default function Page() {
  return (
    <GuideLayout slug="jidoshazei-kei">
      <Article />
    </GuideLayout>
  );
}
