import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "サイト内検索",
  description: "お金の計算機・解説ガイドをキーワードで検索できます。",
  alternates: { canonical: "/search" },
  // 検索結果ページは薄く重複しやすいため、インデックスはしない
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div>
      <Breadcrumbs items={[{ name: "サイト内検索" }]} />
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">サイト内検索</h1>
        <p className="mt-2 text-sm text-slate-600">
          計算機・解説ガイドをキーワードで検索できます。
        </p>
      </header>
      <SearchClient />
    </div>
  );
}
