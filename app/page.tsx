import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import {
  CATEGORIES,
  allCalculatorsByPriority,
  calculatorsInCategory,
  liveCalculators,
  type Calculator,
} from "@/lib/calculators";

// ハブページ（計算機の一覧）。スポーク（各計算機）への入口。
// レジストリ(lib/calculators.ts)から自動生成。新計算機を足すと自動で反映される。

// よくある質問（FAQ）。SEO（FAQPage構造化データ）と信頼性の両方を狙う。
const FAQ: { q: string; a: string }[] = [
  {
    q: "お金の計算機は無料で使えますか？",
    a: "はい。すべての計算機を無料・登録不要でご利用いただけます。回数制限もありません。",
  },
  {
    q: "入力した年収や金額は保存・送信されますか？",
    a: "いいえ。計算はすべてお使いのブラウザ内で完結し、入力内容がサーバーに送信・保存されることはありません。安心してご利用いただけます。",
  },
  {
    q: "計算結果はどれくらい正確ですか？",
    a: "国税庁・総務省・協会けんぽなどの公的資料をもとに計算し、既知の数値とテストで照合しています。ただし個別の控除や自治体ごとの料率により実際の額とは差が出るため、結果は概算としてご利用ください。",
  },
  {
    q: "令和7年（2025年）の税制改正に対応していますか？",
    a: "はい。給与所得控除や基礎控除の見直しなど、令和7年分の改正に対応しています。各計算機に適用年度を明記しています。",
  },
  {
    q: "スマートフォンでも使えますか？",
    a: "はい。スマホ・タブレット・パソコンのどのブラウザでもご利用いただけます。アプリのインストールは不要です。",
  },
];

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
  const liveCount = liveCalculators().length;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "年収手取り・住宅ローン・ふるさと納税・NISA・iDeCo・相続税・退職金など、お金の計算を無料でまとめて行えるシミュレーションサイト。",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* ヒーロー */}
      <section className="py-6 text-center sm:py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          お金の計算機｜年収手取り・住宅ローン・税金を無料で計算
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          年収の<strong>手取り計算</strong>、<strong>住宅ローン</strong>の返済シミュレーション、
          <strong>ふるさと納税</strong>の上限額、<strong>NISA・iDeCo</strong>の積立、
          <strong>相続税</strong>や<strong>退職金</strong>の試算まで——暮らしのお金にまつわる計算を、
          無料・登録不要でまとめて。すべての計算はあなたの端末内（ブラウザ）で完結し、
          入力内容はどこにも送信されません。
        </p>
        {/* 信頼バッジ */}
        <ul className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2 text-xs font-medium text-slate-600">
          {[
            `計算機${liveCount}種類`,
            "完全無料・登録不要",
            "入力は送信されません",
            "公的資料に基づく",
            "令和7年（2025年）対応",
          ].map((label) => (
            <li key={label} className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              ✓ {label}
            </li>
          ))}
        </ul>
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
                {cat.emoji} {cat.name}の計算機
              </h2>
              <Link
                href={`/c/${cat.slug}`}
                className="text-sm text-emerald-700 hover:underline"
              >
                一覧 →
              </Link>
            </div>
            <p className="mb-3 text-sm text-slate-500">{cat.description}。</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {calcs.map((c) => (
                <CalcCard key={c.slug} c={c} />
              ))}
            </div>
          </section>
        );
      })}

      {/* よくある質問（FAQ） */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900">よくある質問</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-slate-200 bg-white p-4"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-800 marker:hidden">
                <span className="text-emerald-600">Q. </span>
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-7 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 信頼性・運営方針 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
        <h2 className="mb-2 text-base font-bold text-slate-900">
          公的資料に基づく、正確さにこだわった計算機
        </h2>
        <p>
          税金・社会保険の計算は、国税庁・総務省・協会けんぽ・日本年金機構などの
          <strong>公的資料を出典</strong>とし、<strong>令和7年（2025年）の改正</strong>
          に対応しています。各計算ロジックは適用年度を明記し、既知の数値と照合するテストで検証しています。
          それでも本サイトの計算結果は概算です。実際の税額・保険料はお住まいの自治体や個別の事情により
          異なるため、重要な判断の際は税理士・社会保険労務士などの専門家や公的機関にご確認ください。
        </p>
      </section>
    </div>
  );
}
