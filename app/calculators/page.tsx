import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  CATEGORIES,
  calculatorsInCategory,
  liveCalculators,
} from "@/lib/calculators";
import { guidesInCategory, liveGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "計算機・ガイド一覧（サイトマップ）",
  description:
    "お金の計算機シリーズの全ツールと解説ガイドの一覧です。年収手取り・住宅ローン・ふるさと納税・NISA・iDeCo・相続税・退職金など、カテゴリ別にまとめています。",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsIndexPage() {
  const calcCount = liveCalculators().length;
  const guideCount = liveGuides().length;

  return (
    <div>
      <Breadcrumbs items={[{ name: "計算機・ガイド一覧" }]} />
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          計算機・ガイド一覧
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          お金の計算機シリーズの全ツール（{calcCount}種類）と解説ガイド（{guideCount}記事）の一覧です。
          カテゴリごとに、計算機と関連ガイドをまとめています。
        </p>
      </header>

      <div className="space-y-8">
        {CATEGORIES.map((cat) => {
          const calcs = calculatorsInCategory(cat.slug).filter((c) => c.status === "live");
          const guides = guidesInCategory(cat.slug);
          if (calcs.length === 0 && guides.length === 0) return null;
          return (
            <section key={cat.slug}>
              <h2 className="mb-2 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-slate-900">
                <Link href={`/c/${cat.slug}`} className="hover:text-emerald-700">
                  {cat.emoji} {cat.name}
                </Link>
              </h2>
              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-xs font-semibold text-slate-400">計算機</h3>
                  <ul className="space-y-1">
                    {calcs.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/${c.slug}`} className="text-sm text-emerald-700 hover:underline">
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {guides.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-xs font-semibold text-slate-400">解説ガイド</h3>
                    <ul className="space-y-1">
                      {guides.map((g) => (
                        <li key={g.slug}>
                          <Link href={`/guide/${g.slug}`} className="text-sm text-slate-600 hover:text-emerald-700 hover:underline">
                            {g.shortTitle}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-10 border-t border-slate-200 pt-6">
        <h2 className="mb-2 text-base font-bold text-slate-900">サイト情報</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {[
            ["/guide", "ガイド一覧"],
            ["/about", "運営者情報"],
            ["/editorial-policy", "編集・運営方針"],
            ["/sources", "計算の根拠・出典"],
            ["/privacy", "プライバシーポリシー"],
            ["/disclaimer", "免責事項"],
            ["/contact", "お問い合わせ"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="text-emerald-700 hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
