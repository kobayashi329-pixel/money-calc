"use client";

// 公的年金 受給見込み額シミュレーション 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateNenkin } from "@/lib/nenkin/calculate";
import { yen, manYen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { DonutChart, type DonutSegment } from "./DonutChart";

const COLORS = {
  basic: "#3b82f6", // blue-500 … 老齢基礎年金
  kosei: "#10b981", // emerald-500 … 老齢厚生年金
};

export function NenkinCalculator() {
  const [kisoYears, setKisoYears] = useState(40);
  const [kouseiYears, setKouseiYears] = useState(40);
  const [avgAnnualIncome, setAvgAnnualIncome] = useState(5_000_000);
  const [startAge, setStartAge] = useState(65);

  const result = useMemo(
    () => calculateNenkin({ kisoYears, kouseiYears, avgAnnualIncome, startAge }),
    [kisoYears, kouseiYears, avgAnnualIncome, startAge],
  );

  const donutSegments: DonutSegment[] = [
    { label: "老齢基礎年金", value: result.basicAnnual, color: COLORS.basic },
    { label: "老齢厚生年金", value: result.koseiAnnual, color: COLORS.kosei },
  ];

  const diffPercent = Math.round((result.factor - 1) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">加入状況を入力</h2>

        {/* 国民年金（基礎年金）の納付年数 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            国民年金（基礎年金）の納付年数
          </span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={avgAnnualIncome} onChange={setAvgAnnualIncome} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={12_000_000}
            step={100_000}
            value={Math.min(avgAnnualIncome, 12_000_000)}
            onChange={(e) => setAvgAnnualIncome(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">{manYen(avgAnnualIncome)}</div>
        </label>

        {/* 受給開始年齢 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">受給開始年齢</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={60}
              max={75}
              value={startAge}
              onChange={(e) => setStartAge(Math.min(75, Math.max(60, Number(e.target.value))))}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">歳</span>
            {startAge !== 65 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  startAge < 65 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {startAge < 65 ? "繰上げ" : "繰下げ"} {diffPercent > 0 ? "+" : ""}
                {diffPercent}%
              </span>
            )}
          </div>
          <input
            type="range"
            min={60}
            max={75}
            value={startAge}
            onChange={(e) => setStartAge(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <p className="mt-1 text-xs text-slate-400">
            65歳が基準。早めると1ヶ月0.4%減（60歳で−24%）、遅らせると1ヶ月0.7%増（75歳で+84%）。
          </p>
        </label>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-slate-900">受給見込み額（概算）</h2>
        <p className="mb-4 text-xs text-slate-400">令和7年度（2025年度）の年金額・乗率に基づく概算</p>

        {/* 月額 */}
        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">{startAge}歳から受け取る年金（月額の目安）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {yen(result.totalMonthly)}
          </div>
          <div className="mt-1 text-xs text-emerald-700/80">
            年額 {yen(result.totalAnnual)}
            {startAge !== 65 && (
              <>（65歳開始なら年 {yen(result.totalAnnualAt65)}）</>
            )}
          </div>
        </div>

        {/* ドーナツ（基礎 vs 厚生） */}
        <DonutChart
          segments={donutSegments}
          centerLabel="年額"
          centerValue={manYen(result.totalAnnual)}
        />

        {/* 内訳表 */}
        <table className="mt-6 w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.basic }} />
                  老齢基礎年金
                </span>
              </td>
              <td className="py-2 text-right tabular-nums text-slate-700">{yen(result.basicAnnual)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.kosei }} />
                  老齢厚生年金
                </span>
              </td>
              <td className="py-2 text-right tabular-nums text-slate-700">{yen(result.koseiAnnual)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">合計（年額）</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.totalAnnual)}</td>
            </tr>
          </tbody>
        </table>

        {/* 老後資金への導線 */}
        <div className="mt-4 rounded-lg bg-violet-50 p-3 text-center text-xs leading-5 text-violet-800">
          この年金収入（月 {yen(result.totalMonthly)}）をもとに、老後資金が足りるか試算できます。
          <div className="mt-2">
            <Link href="/rougo-shikin" className="inline-block rounded-lg bg-violet-600 px-3 py-1.5 font-semibold text-white hover:bg-violet-700">
              老後資金シミュレーションへ →
            </Link>
          </div>
        </div>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは<strong>概算</strong>です。厚生年金は「平均年収 × 5.481/1000 × 加入年数」で近似しており、
          実際は標準報酬月額の上限・過去の賃金の再評価・加給年金・経過的加算などで変わります。
          正確な見込み額は<strong>ねんきん定期便・ねんきんネット</strong>でご確認ください。
        </p>
      </section>
    </div>
  );
}
