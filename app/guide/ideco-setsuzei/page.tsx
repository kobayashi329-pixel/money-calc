import type { Metadata } from "next";
import { GuideLayout } from "@/components/GuideLayout";
import { getGuide } from "@/lib/guides";
import Article from "@/content/guides/ideco-setsuzei.mdx";

const G = getGuide("ideco-setsuzei")!;

export const metadata: Metadata = {
  title: G.title,
  description: G.description,
  alternates: { canonical: "/guide/ideco-setsuzei" },
};

export default function Page() {
  return (
    <GuideLayout slug="ideco-setsuzei">
      <Article />
    </GuideLayout>
  );
}
