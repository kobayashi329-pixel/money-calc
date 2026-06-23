"use client";

// 時給・月給・年収 換算機 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateJikyu, type WageUnit } from "@/lib/jikyu/calculate";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";

const UNITS: { key: WageUnit; label: string }[] = [
  { key: "hourly", label: "時給" },
  { key: "daily", label: "日給" },
  { key: "monthly", label: "月給" },
  { key: "annual", label: "年収" },
];

export function JikyuCalculator() {
  const [value, setValue] = useState(1_500);
  const [unit, setUnit] = useState<WageUnit>("hourly");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerMonth, setDaysPerMonth] = useState(20);

  const result = useMemo(
    () => calculateJikyu({ value, unit, hoursPerDay, daysPerMonth }),
    [value, unit, hoursPerDay, daysPerMonth],
  );

  const cards: { key: WageUnit; label: string; value: number }[] = [
    { key: "hourly", label: "時給", value: result.hourly },
    { key: "daily", label: "日給", value: result.daily },
    { key: "monthly", label: "月給", value: result.monthly },
    { key: "annual", label: "年収", value: result.annual },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">金額を入力</h2>

        {/* 換算元の単位 */}
        <div className="mb-3 grid grid-cols-4 gap-2">
          {UNITS.map((u) => (
            <button
              key={u.key}
              type="button"
              onClick={() => setUnit(u.key)}
              className={`rounded-lg border px-2 py-2 text-center text-sm font-semibold ${
                unit === u.key
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {UNITS.find((u) => u.key === unit)!.label}の金額
          </span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={value} onChange={setValue} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
        </label>

        <div className="my-5 border-t border-dashed border-slate-200" />

        {/* 労働条件 */}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">1日の労働時間</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min={1}
                max={24}
                step={0.5}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Math.min(24, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              />
              <span className="text-slate-500">時間</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">1ヶ月の労働日数</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={31}
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(Math.min(31, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              />
              <span className="text-slate-500">日</span>
            </div>
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          月 {result.hoursPerDay * result.daysPerMonth} 時間で換算しています（週休2日・1日8時間なら月20日が目安）。
        </p>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">換算結果</h2>

        <div className="grid grid-cols-2 gap-3">
          {cards.map((c) => (
            <div
              key={c.key}
              className={`rounded-xl border p-4 text-center ${
                c.key === unit ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-xs text-slate-500">
                {c.label}
                {c.key === unit && <span className="ml-1 text-emerald-600">（入力）</span>}
              </div>
              <div className="text-xl font-extrabold text-slate-800 tabular-nums">
                {yen(c.value)}
              </div>
              {c.key === "annual" && (
                <div className="text-xs text-slate-400">{manYen(c.value)}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">この年収の手取りは？</div>
          <Link
            href="/tedori"
            className="mt-1 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            年収 {manYen(result.annual)} の手取りを計算する →
          </Link>
        </div>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは入力した労働時間・日数をもとにした単純換算です。残業代・賞与・各種手当は含みません。
          実際の給与は雇用契約により異なります。手取り額は税金・社会保険料が引かれた後の金額になります。
        </p>
      </section>
    </div>
  );
}
