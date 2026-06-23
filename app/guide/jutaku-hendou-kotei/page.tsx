import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/jutaku-hendou-kotei.mdx";

const G = getGuide("jutaku-hendou-kotei")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/jutaku-hendou-kotei" },
};

export default function Page() {
  return (
    <GuideLayout slug="jutaku-hendou-kotei">
      <Article />
    </GuideLayout>
  );
}
