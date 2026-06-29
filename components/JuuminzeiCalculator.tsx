"use client";

// 住民税 計算機 本体（クライアントコンポーネント）。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateJuuminzei } from "@/lib/juuminzei/calculate";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function JuuminzeiCalculator() {
  const [annualIncome, setAnnualIncome] = useState(5_000_000);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [dependents, setDependents] = useState(0);
  const [age, setAge] = useState(30);
  const [showDetails, setShowDetails] = useState(false);

  useSharedParams((get) => {
    applyNumber(get, "income", setAnnualIncome);
    applyNumber(get, "dep", setDependents);
    applyNumber(get, "age", setAge);
    const sp = get("spouse");
    if (sp != null) setHasSpouse(sp === "1");
    if (get("dep") || get("age") || sp != null) setShowDetails(true);
  });

  const shareParams = { income: annualIncome, spouse: hasSpouse ? 1 : 0, dep: dependents, age };

  const result = useMemo(
    () => calculateJuuminzei({ annualIncome, age, hasSpouse, dependents }),
    [annualIncome, age, hasSpouse, dependents],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">年収を入れるだけ</h2>

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
          <span className="text-sm font-medium text-slate-700">配偶者</span>
          <select
            value={hasSpouse ? "1" : "0"}
            onChange={(e) => setHasSpouse(e.target.value === "1")}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          >
            <option value="0">いない／共働き（配偶者控除なし）</option>
            <option value="1">いる（配偶者控除の対象）</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="mt-5 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          aria-expanded={showDetails}
        >
          <span>詳細設定（扶養・年齢）</span>
          <span className="text-slate-400">{showDetails ? "閉じる ▲" : "開く ▼"}</span>
        </button>

        {showDetails && (
          <div className="mt-4 space-y-5 border-t border-slate-100 pt-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">扶養人数（16歳以上・配偶者を除く）</span>
              <select
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>{i}人</option>
                ))}
              </select>
            </label>
            <label className="block">
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
              </div>
              <p className="mt-1 text-xs text-slate-400">40〜64歳は介護保険料の分だけ課税所得が下がります。</p>
            </label>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">住民税（年額）の目安</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.total)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">月あたり 約 {yen(Math.round(result.total / 12))}</div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">所得割（課税所得 × 10%）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.incomeLevy)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">均等割</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.perCapitaLevy)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">住民税の合計</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          計算の前提：給与所得 {manYen(result.employmentIncome)}、社会保険料控除 約{yen(result.socialInsurance)}、
          住民税の課税所得 {yen(result.taxableIncome)}。均等割は標準的な5,000円で計算しています。
        </p>

        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは概算です。住民税は前年の所得に対して翌年課税されます。自治体ごとの均等割額・税率の違い、
          住宅ローン控除・ふるさと納税などの税額控除は反映していません。正確な額は課税明細書・お住まいの自治体でご確認ください。
        </p>
      </section>
    </div>
  );
}
