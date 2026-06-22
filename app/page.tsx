import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import {
  CATEGORIES,
  allCalculatorsByPriority,
  calculatorsInCategory,
  type Calculator,
} from "@/lib/calculators";

// ハブページ（計算機の一覧）。スポーク（各計算機）への入口。
// レジストリ(lib/calculators.ts)から自動生成。新計算機を足すと自動で反映される。

function CalcCard({ c }: { c: Calculator }) {
  const inner = (
    <div
      className={`flex h-full flex-col rounded-2xl border p-5 transition-shadow ${
        c.status === "live"
          ? "border-slate-200 bg-white shadow-sm hover:shadow-md"
          : "border-dashed border-slate-200 bg-slate-50"
      }`}
    >
      <div className="text-3xl">{c.emoji}</div>
      <h3 className="mt-2 font-bold text-slate-900">{c.shortTitle}</h3>
      <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">{c.description}</p>
      <div className="mt-3">
        {c.status === "live" ? (
          <span className="text-sm font-semibold text-emerald-700">計算する →</span>
        ) : (
          <span className="text-xs text-slate-400">準備中</span>
        )}
      </div>
    </div>
  );
  return c.status === "live" ? (
    <Link href={`/${c.slug}`} className="block">
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}

export default function Home() {
  const popular = allCalculatorsByPriority().slice(0, 3);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "年収手取り・住宅ローン・ふるさと納税など、お金にまつわる計算をブラウザだけでかんたんに。",
  };

  return (
    <div>
      <JsonLd data={websiteJsonLd} />

      {/* ヒーロー */}
      <section className="py-6 text-center sm:py-10">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          お金の計算を、ブラウザだけで。
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          年収手取り・住宅ローン・ふるさと納税など、暮らしのお金をかんたんに試算。
          計算はすべてあなたの端末内で完結し、入力内容はどこにも送信されません。
          すべて公的資料に基づく概算ツールです。
        </p>
      </section>

      {/* 人気・おすすめ */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">人気の計算機</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {popular.map((c) => (
            <CalcCard key={c.slug} c={c} />
          ))}
        </div>
      </section>

      {/* カテゴリ別 */}
      {CATEGORIES.map((cat) => {
        const calcs = calculatorsInCategory(cat.slug);
        if (calcs.length === 0) return null;
        return (
          <section key={cat.slug} className="mb-10">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {cat.emoji} {cat.name}
              </h2>
              <Link
                href={`/c/${cat.slug}`}
                className="text-sm text-emerald-700 hover:underline"
              >
                一覧 →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {calcs.map((c) => (
                <CalcCard key={c.slug} c={c} />
              ))}
            </div>
          </section>
        );
      })}

      {/* 信頼性・運営方針 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
        <h2 className="mb-2 text-base font-bold text-slate-900">
          正確さにこだわっています
        </h2>
        <p>
          税・社会保険の計算は、国税庁・総務省・協会けんぽなどの
          <strong>公的資料を出典</strong>とし、<strong>令和7年（2025年）の改正</strong>
          に対応しています。各ロジックは適用年度を明記し、テストで検証しています。
          それでも本ツールは概算です。重要な判断は専門家や公的機関にご確認ください。
        </p>
      </section>
    </div>
  );
}
