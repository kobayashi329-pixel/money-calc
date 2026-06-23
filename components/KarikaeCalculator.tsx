"use client";

// 住宅ローン借り換え比較 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateKarikae } from "@/lib/karikae/calculate";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";

export function KarikaeCalculator() {
  const [balance, setBalance] = useState(20_000_000);
  const [remainingYears, setRemainingYears] = useState(25);
  const [curRateStr, setCurRateStr] = useState("1.5");
  const [newRateStr, setNewRateStr] = useState("0.7");
  const [fee, setFee] = useState(600_000);

  const currentRatePercent = Number(curRateStr) || 0;
  const newRatePercent = Number(newRateStr) || 0;

  const result = useMemo(
    () =>
      calculateKarikae({
        balance,
        remainingYears,
        currentRatePercent,
        newRatePercent,
        fee,
      }),
    [balance, remainingYears, currentRatePercent, newRatePercent, fee],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">今のローンと借換条件</h2>

        {/* 残高 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">現在のローン残高</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={balance} onChange={setBalance} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={1_000_000}
            max={80_000_000}
            step={1_000_000}
            value={Math.min(balance, 80_000_000)}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">
            {manYen(balance)}
          </div>
        </label>

        {/* 残り期間 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">残りの返済期間</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={fee} onChange={setFee} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            事務手数料・保証料・登記費用などの合計。借入額の2〜3%程度（例: 残高2000万なら40〜60万円）が目安です。
          </p>
        </label>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">借り換えの効果</h2>

        {/* 正味メリット */}
        <div className={`mb-5 rounded-xl p-4 text-center ${result.worthIt ? "bg-emerald-50" : "bg-slate-100"}`}>
          <div className={`text-sm ${result.worthIt ? "text-emerald-800" : "text-slate-600"}`}>
            諸費用を引いた正味のメリット
          </div>
          <div className={`text-3xl font-extrabold tabular-nums ${result.worthIt ? "text-emerald-700" : "text-slate-500"}`}>
            {result.netBenefit >= 0 ? yen(result.netBenefit) : `−${yen(-result.netBenefit)}`}
          </div>
          <p className={`mt-2 text-xs leading-5 ${result.worthIt ? "text-emerald-700/80" : "text-slate-500"}`}>
            {result.worthIt
              ? "借り換えで得になる可能性が高い条件です（総返済額の軽減 − 諸費用）。"
              : "この条件では諸費用が軽減額を上回り、借り換えメリットは出ません。"}
          </p>
        </div>

        {/* 毎月返済額の比較 */}
        <div className="mb-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs text-slate-500">今の毎月返済額</div>
            <div className="text-xl font-bold text-slate-700 tabular-nums">
              {yen(result.current.monthlyPayment)}
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="text-xs text-emerald-800">借換後の毎月返済額</div>
            <div className="text-xl font-bold text-emerald-700 tabular-nums">
              {yen(result.refinanced.monthlyPayment)}
            </div>
          </div>
        </div>

        {result.monthlyReduction !== 0 && (
          <p className="mb-4 text-center text-sm text-slate-600">
            毎月{" "}
            {result.monthlyReduction > 0 ? (
              <strong className="text-emerald-700">{yen(result.monthlyReduction)} 安く</strong>
            ) : (
              <strong className="text-red-600">{yen(-result.monthlyReduction)} 高く</strong>
            )}
            なります
          </p>
        )}

        {/* 比較表 */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-500">
              <th className="py-1 text-left font-medium"></th>
              <th className="py-1 text-right font-medium">総返済額</th>
              <th className="py-1 text-right font-medium">利息総額</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-700">今のまま</td>
              <td className="py-2 text-right tabular-nums text-slate-700">{yen(result.current.totalPayment)}</td>
              <td className="py-2 text-right tabular-nums text-slate-500">{yen(result.current.totalInterest)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 font-medium text-emerald-700">借り換え後</td>
              <td className="py-2 text-right tabular-nums text-emerald-700">{yen(result.refinanced.totalPayment)}</td>
              <td className="py-2 text-right tabular-nums text-emerald-600">{yen(result.refinanced.totalInterest)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-700">総返済額の差</td>
              <td className="py-2 text-right font-semibold tabular-nums text-emerald-700">{yen(result.totalSaved)}</td>
              <td className="py-2 text-right text-xs tabular-nums text-slate-400">諸費用 −{yen(result.fee)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは元利均等返済を前提に、<strong>残高と残期間を変えずに金利だけ借り換えた</strong>場合の概算です。
          実際の諸費用は金融機関・商品で大きく異なり、団信の条件変更や保証料の返戻、住宅ローン控除への影響もあります。
          借り換えの判断は各金融機関の正式な見積もりでご確認ください。
        </p>
      </section>
    </div>
  );
}
