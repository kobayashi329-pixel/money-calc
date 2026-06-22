import type { Metadata } from "next";
import { TakeHomeCalculator } from "@/components/TakeHomeCalculator";
import Article from "@/content/take-home.mdx";

export const metadata: Metadata = {
  title: "年収手取り計算機（2025年・令和7年版）",
  description:
    "額面年収から所得税・住民税・社会保険料を差し引いた手取り額を、内訳とグラフで試算。令和7年（2025年）の制度・公的資料に基づく概算ツール。",
};

export default function TakeHomePage() {
  return (
    <article>
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          年収手取り計算機
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          額面年収を入力すると、所得税・住民税・社会保険料を差し引いた
          <strong>手取り額</strong>を内訳つきで計算します。
          令和7年（2025年）の制度に基づく概算です。
        </p>
      </header>

      <TakeHomeCalculator />

      {/* ===== 解説記事（MDX・SEO/審査用） ===== */}
      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Article />
      </section>
    </article>
  );
}
