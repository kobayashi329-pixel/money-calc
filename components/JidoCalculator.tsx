"use client";

// 児童手当 計算機 本体（2024年10月拡充後）。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateJido } from "@/lib/jido/calculate";
import { yen, manYen } from "@/lib/format";
import { ShareButton, useSharedParams } from "./ShareButton";

const numClass =
  "w-20 rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function JidoCalculator() {
  const [ages, setAges] = useState<number[]>([3, 1]);

  useSharedParams((get) => {
    const a = get("ages");
    if (a) {
      const parsed = a
        .split(",")
        .map((x) => Number(x))
        .filter((n) => Number.isFinite(n) && n >= 0 && n <= 22);
      if (parsed.length) setAges(parsed.slice(0, 6));
    }
  });

  const shareParams = { ages: ages.join(",") };
  const result = useMemo(() => calculateJido(ages), [ages]);

  const setCount = (n: number) => {
    setAges((prev) => {
      const next = [...prev];
      while (next.length < n) next.push(0);
      return next.slice(0, n);
    });
  };
  const setAge = (i: number, v: number) => {
    setAges((prev) => prev.map((a, idx) => (idx === i ? v : a)));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">子どもの人数と年齢を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">子どもの人数</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`h-10 w-10 rounded-lg border text-sm font-semibold ${
                  ages.length === n
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </label>

        <div className="mt-5 space-y-2">
          {ages.map((age, i) => (
            <label key={i} className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-700">
                {i + 1}人目の年齢
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={22}
                  value={age}
                  onChange={(e) => setAge(i, Number(e.target.value))}
                  className={numClass}
                />
                <span className="shrink-0 text-slate-500">歳</span>
              </div>
            </label>
          ))}
          <p className="mt-1 text-xs text-slate-400">
            ※年齢の高い子から第1子・第2子…と数えます。第3子以降は一律月3万円。
            大学生年代（22歳まで）は支給対象外ですが「第◯子」の数えには含めます。
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">児童手当の月額合計</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.monthlyTotal)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">
            年額 約 {manYen(result.annualTotal)}（偶数月に2か月分ずつ支給）
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            {result.children.map((c, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-2 text-slate-700">
                  第{c.birthOrder}子（{c.age}歳）
                </td>
                <td className="py-2 text-right tabular-nums text-slate-900">
                  {c.monthly > 0 ? `月 ${yen(c.monthly)}` : "支給対象外"}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">月額合計</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.monthlyTotal)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 2024年10月拡充後のルールに基づく概算です（所得制限なし）。第3子の数え方（22歳年度末までを算定）や
          支給対象は個別の事情で異なります。正確な額はお住まいの自治体にご確認ください。
        </p>
      </section>
    </div>
  );
}
