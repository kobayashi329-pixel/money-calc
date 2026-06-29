"use client";

// 社会保険料 計算機 本体（クライアントコンポーネント）。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateShaho } from "@/lib/shaho/calculate";
import { yen, manYen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function ShahoCalculator() {
  const [annualIncome, setAnnualIncome] = useState(5_000_000);
  const [age, setAge] = useState(30);

  useSharedParams((get) => {
    applyNumber(get, "income", setAnnualIncome);
    applyNumber(get, "age", setAge);
  });

  const shareParams = { income: annualIncome, age };

  const result = useMemo(
    () => calculateShaho({ annualIncome, age }),
    [annualIncome, age],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">年収と年齢を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">額面年収（賞与込み）</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={annualIncome} onChange={setAnnualIncome} className={inputClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={20_000_000}
            step={100_000}
            value={Math.min(annualIncome, 20_000_000)}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">{manYen(annualIncome)}</div>
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">年齢</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={18}
              max={120}
              value={age}
              onChange={(e) => setAge(Math.max(0, Number(e.target.value)))}
              className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">歳</span>
            {result.hasLongTermCare && (
              <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">介護保険料あり</span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-400">40〜64歳は介護保険料が加わります。健康保険料率は東京都（協会けんぽ）の標準で計算します。</p>
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">社会保険料（本人負担・年額）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.total)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">
            月あたり 約 {yen(result.monthly)}（年収の約 {percent(result.rate, 1)}）
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">健康保険料</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.health)}</td>
            </tr>
            {result.hasLongTermCare && (
              <tr className="border-t border-slate-100">
                <td className="py-2 text-slate-700">介護保険料（40〜64歳）</td>
                <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.longTermCare)}</td>
              </tr>
            )}
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">厚生年金保険料</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.pension)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">雇用保険料</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.employment)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">社会保険料の合計（年額）</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは協会けんぽ（東京都）の料率に基づく概算です。標準報酬月額の等級・上限を近似で扱っており、
          勤務先の健康保険組合・都道府県により実際の額は異なります。正確な額は給与明細や勤務先でご確認ください。
        </p>
      </section>
    </div>
  );
}
