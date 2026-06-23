import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CATEGORIES } from "@/lib/calculators";
import { guidesInCategory, liveGuides } from "@/lib/guides";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "お金のガイド・解説記事一覧",
  description: `年収別の手取り、ふるさと納税のやり方、NISAとiDeCoの違いなど、お金にまつわる疑問をわかりやすく解説。計算機とあわせて使えるガイド集です。`,
  alternates: { canonical: "/guide" },
};

export default function GuideIndexPage() {
  const count = liveGuides().length;
  return (
    <div>
      <Breadcrumbs items={[{ name: "ガイド" }]} />
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          お金のガイド・解説記事
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          年収別の手取り、ふるさと納税のやり方、NISAとiDeCoの違いなど、お金にまつわる疑問を
          公的資料に基づいてわかりやすく解説します。記事から関連する計算機ですぐに試算できます。
          全{count}記事（順次追加中）。
        </p>
      </header>

      {CATEGORIES.map((cat) => {
        const guides = guidesInCategory(cat.slug);
        if (guides.length === 0) return null;
        return (
          <section key={cat.slug} className="mb-8">
            <h2 className="mb-3 text-lg font-bold text-slate-900">
              {cat.emoji} {cat.name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
                >
                  <h3 className="font-bold text-slate-900">{g.shortTitle}</h3>
                  <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">{g.description}</p>
                  <span className="mt-3 text-sm font-semibold text-emerald-700">読む →</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
