"use client";

// 住宅ローン控除 計算機 本体。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateJuloanKojo, type HousePerformance } from "@/lib/juloankojo/calculate";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

const PERFS: [HousePerformance, string][] = [
  ["choki", "認定長期優良・低炭素住宅"],
  ["zeh", "ZEH水準 省エネ住宅"],
  ["shoene", "省エネ基準適合住宅"],
  ["other", "その他（省エネ基準未達）"],
];

export function JuloanKojoCalculator() {
  const [balance, setBalance] = useState(30_000_000);
  const [newBuild, setNewBuild] = useState(true);
  const [performance, setPerformance] = useState<HousePerformance>("choki");
  const [kosodate, setKosodate] = useState(false);

  useSharedParams((get) => {
    applyNumber(get, "balance", setBalance);
    if (get("new") === "0") setNewBuild(false);
    const p = get("perf");
    if (p === "choki" || p === "zeh" || p === "shoene" || p === "other") setPerformance(p);
    if (get("kosodate") === "1") setKosodate(true);
  });

  const shareParams = {
    balance,
    new: newBuild ? 1 : 0,
    perf: performance,
    kosodate: kosodate ? 1 : 0,
  };
  const result = useMemo(
    () => calculateJuloanKojo({ balance, newBuild, performance, kosodate }),
    [balance, newBuild, performance, kosodate],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">住宅ローンと住宅の条件を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">年末のローン残高</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={balance} onChange={setBalance} max={100_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
        </label>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {(
            [
              [true, "新築・買取再販"],
              [false, "中古（既存住宅）"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setNewBuild(val)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                newBuild === val
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <span className="text-sm font-medium text-slate-700">住宅の省エネ性能</span>
          <div className="mt-1 grid gap-2">
            {PERFS.map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setPerformance(val)}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  performance === val
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {newBuild && (
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={kosodate}
              onChange={(e) => setKosodate(e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            子育て世帯・若者夫婦世帯（借入限度額が上乗せ）
          </label>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        {result.ineligible ? (
          <div className="mb-5 rounded-xl bg-amber-50 p-4 text-center text-sm text-amber-800">
            2024年以降に新築で入居する場合、<strong>省エネ基準を満たさない住宅は原則として住宅ローン控除の対象外</strong>です。
          </div>
        ) : (
          <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
            <div className="text-sm text-emerald-800">1年間の控除額（最大）</div>
            <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.annual)}</div>
            <div className="mt-1 text-xs text-emerald-700/80">
              {result.years}年間の合計 最大 約{manYen(result.totalMax)}（残高一定と仮定）
            </div>
          </div>
        )}

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">借入限度額</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.limit)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">控除の対象額（残高と限度額の小）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.target)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">控除率</td>
              <td className="py-2 text-right tabular-nums text-slate-900">0.7%</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">控除期間</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{result.years}年</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">1年間の控除額（最大）</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.annual)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは2024・2025年入居の基準による概算です。実際の控除額は、その年に納めた
          <strong>所得税＋住民税（上限97,500円/年）</strong>が上限です。残高は毎年減るため控除額も年々下がります。
          正確な額は税務署・税理士にご確認ください。
        </p>
      </section>
    </div>
  );
}
