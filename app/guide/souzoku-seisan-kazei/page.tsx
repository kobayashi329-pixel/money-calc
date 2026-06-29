import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/souzoku-seisan-kazei.mdx";

const G = getGuide("souzoku-seisan-kazei")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/souzoku-seisan-kazei" },
};

export default function Page() {
  return (
    <GuideLayout slug="souzoku-seisan-kazei">
      <Article />
    </GuideLayout>
  );
}
