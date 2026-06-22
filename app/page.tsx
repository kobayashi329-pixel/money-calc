import Link from "next/link";

// ハブページ（計算機の一覧）。スポーク（各計算機）への入口。
interface CalcCard {
  href: string;
  title: string;
  desc: string;
  emoji: string;
  ready: boolean;
}

const CALCULATORS: CalcCard[] = [
  {
    href: "/take-home",
    title: "年収手取り計算機",
    desc: "額面年収から、所得税・住民税・社会保険料を引いた手取りを内訳付きで試算。",
    emoji: "💴",
    ready: true,
  },
  {
    href: "#",
    title: "住宅ローンシミュレータ",
    desc: "毎月の返済額・総返済額・繰上返済の効果を計算（準備中）。",
    emoji: "🏠",
    ready: false,
  },
  {
    href: "#",
    title: "ふるさと納税 上限額シミュレータ",
    desc: "年収・家族構成から、自己負担2,000円で済む寄付上限の目安を計算（準備中）。",
    emoji: "🎁",
    ready: false,
  },
];

export default function Home() {
  return (
    <div>
      <section className="py-6 text-center sm:py-10">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          お金の計算を、ブラウザだけで。
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          年収手取り・住宅ローン・ふるさと納税など、暮らしのお金をかんたんに試算。
          計算はすべてあなたの端末内で完結し、入力内容はどこにも送信されません。
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {CALCULATORS.map((c) => {
          const inner = (
            <div
              className={`flex h-full flex-col rounded-2xl border p-5 transition-shadow ${
                c.ready
                  ? "border-slate-200 bg-white shadow-sm hover:shadow-md"
                  : "border-dashed border-slate-200 bg-slate-50"
              }`}
            >
              <div className="text-3xl">{c.emoji}</div>
              <h2 className="mt-2 font-bold text-slate-900">{c.title}</h2>
              <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">{c.desc}</p>
              <div className="mt-3">
                {c.ready ? (
                  <span className="text-sm font-semibold text-emerald-700">
                    計算する →
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">準備中</span>
                )}
              </div>
            </div>
          );
          return c.ready ? (
            <Link key={c.title} href={c.href} className="block">
              {inner}
            </Link>
          ) : (
            <div key={c.title}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
