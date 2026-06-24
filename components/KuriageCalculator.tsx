"use client";

// 住宅ローン 繰り上げ返済 比較シミュレータ本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateKuriage } from "@/lib/kuriage/calculate";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

/** 月数を「○年○ヶ月」に */
function monthsToText(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y > 0 && m > 0) return `${y}年${m}ヶ月`;
  if (y > 0) return `${y}年`;
  return `${m}ヶ月`;
}

export function KuriageCalculator() {
  const [principal, setPrincipal] = useState(30_000_000);
  const [rateStr, setRateStr] = useState("1.0");
  const [years, setYears] = useState(35);
  const [prepay, setPrepay] = useState(1_000_000);
  const [prepayAfter, setPrepayAfter] = useState(5);

  useSharedParams((get) => {
    applyNumber(get, "amount", setPrincipal);
    applyNumber(get, "years", setYears);
    applyNumber(get, "prepay", setPrepay);
    applyNumber(get, "after", setPrepayAfter);
    const r = get("rate");
    if (r != null && Number.isFinite(Number(r))) setRateStr(r);
  });

  const shareParams = {
    amount: principal,
    rate: rateStr,
    years,
    prepay,
    after: prepayAfter,
  };

  const annualRatePercent = Number(rateStr) || 0;

  const result = useMemo(
    () =>
      calculateKuriage({
        principal,
        annualRatePercent,
        years,
        prepayAmount: prepay,
        prepayAfterYears: prepayAfter,
      }),
    [principal, annualRatePercent, years, prepay, prepayAfter],
  );

  const hasPrepay = result.prepayMonth > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">借入条件と繰上返済</h2>

        {/* 借入額 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">借入額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={principal} onChange={setPrincipal} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={1_000_000}
            max={100_000_000}
            step={1_000_000}
            value={Math.min(principal, 100_000_000)}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">
            {manYen(principal)}
          </div>
        </label>

        {/* 金利 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">金利（年率）</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={20}
              step={0.05}
              value={rateStr}
              onChange={(e) => setRateStr(e.target.value)}
              className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">％</span>
          </div>
        </label>

        {/* 返済期間 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">返済期間</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={50}
              value={years}
              onChange={(e) => setYears(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">年</span>
          </div>
        </label>

        <div className="my-5 border-t border-dashed border-slate-200" />

        {/* 繰上返済額 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">繰上返済額（1回）</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={prepay} onChange={setPrepay} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={10_000_000}
            step={100_000}
            value={Math.min(prepay, 10_000_000)}
            onChange={(e) => setPrepay(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">
            {manYen(prepay)}
          </div>
        </label>

        {/* 繰上時期 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">繰上返済をする時期</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-slate-500">借入から</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={years}
              value={prepayAfter}
              onChange={(e) => setPrepayAfter(Math.min(years, Math.max(1, Number(e.target.value))))}
              className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">年後</span>
          </div>
          <input
            type="range"
            min={1}
            max={years}
            step={1}
            value={Math.min(prepayAfter, years)}
            onChange={(e) => setPrepayAfter(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
        </label>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">繰上返済の効果</h2>
          <ShareButton params={shareParams} />
        </div>

        {!hasPrepay ? (
          <div className="rounded-xl bg-slate-50 p-5 text-center text-sm leading-6 text-slate-600">
            繰上返済額と時期を入力すると、<strong>期間短縮型</strong>と
            <strong>返済額軽減型</strong>の効果を比較できます。
          </div>
        ) : (
          <>
            {/* 基準 */}
            <div className="mb-4 rounded-xl bg-slate-50 p-3 text-center">
              <div className="text-xs text-slate-500">繰上返済をしない場合の利息総額</div>
              <div className="text-xl font-bold text-slate-700 tabular-nums">
                {yen(result.baseline.totalInterest)}
              </div>
              <div className="text-xs text-slate-400">
                毎月 {yen(result.baseline.monthlyPayment)} ／ {monthsToText(result.baseline.payoffMonths)}返済
              </div>
            </div>

            {/* 2方式の比較 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 期間短縮型 */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-sm font-bold text-emerald-800">期間短縮型</div>
                <div className="mt-1 text-xs text-emerald-700/70">毎月の返済額は変えず期間を縮める</div>
                <div className="mt-3 text-xs text-emerald-800">利息の軽減額</div>
                <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
                  {yen(result.shortenInterestSaved)}
                </div>
                <div className="mt-2 text-xs text-emerald-800">
                  返済期間が <strong>{monthsToText(result.shortenMonthsReduced)}</strong> 短縮
                </div>
              </div>

              {/* 返済額軽減型 */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="text-sm font-bold text-blue-800">返済額軽減型</div>
                <div className="mt-1 text-xs text-blue-700/70">期間は変えず毎月の額を下げる</div>
                <div className="mt-3 text-xs text-blue-800">利息の軽減額</div>
                <div className="text-2xl font-extrabold text-blue-700 tabular-nums">
                  {yen(result.reduceInterestSaved)}
                </div>
                <div className="mt-2 text-xs text-blue-800">
                  毎月の返済額が <strong>{yen(result.reduceMonthlyReduced)}</strong> 減
                  <span className="block text-blue-700/70">
                    （{yen(result.baseline.monthlyPayment)} → {yen(result.reduce.monthlyPayment)}）
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              💡 同じ金額・同じ時期なら、<strong>期間短縮型のほうが利息の軽減効果は大きく</strong>なります。
              一方、返済額軽減型は毎月の負担をすぐ軽くできるため、家計に余裕を持たせたい場合に向きます。
            </p>
          </>
        )}

        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-500">
              <th className="py-1 text-left font-medium"></th>
              <th className="py-1 text-right font-medium">利息総額</th>
              <th className="py-1 text-right font-medium">完済</th>
            </tr>
          </thead>
          <tbody>
            <ResultRow label="繰上なし" interest={result.baseline.totalInterest} months={result.baseline.payoffMonths} fmt={monthsToText} />
            <ResultRow label="期間短縮型" interest={result.shorten.totalInterest} months={result.shorten.payoffMonths} fmt={monthsToText} highlight="emerald" />
            <ResultRow label="返済額軽減型" interest={result.reduce.totalInterest} months={result.reduce.payoffMonths} fmt={monthsToText} highlight="blue" />
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは元利均等返済を前提とした<strong>概算</strong>です。実際は金融機関の計算方法・端数処理、
          繰上返済手数料、団信・保証料の扱いにより異なります。住宅ローン控除を受けている期間は、
          繰上返済で年末残高が減ると控除額も減る場合があります。詳細は金融機関にご確認ください。
        </p>
      </section>
    </div>
  );
}

function ResultRow({
  label,
  interest,
  months,
  fmt,
  highlight,
}: {
  label: string;
  interest: number;
  months: number;
  fmt: (m: number) => string;
  highlight?: "emerald" | "blue";
}) {
  const color =
    highlight === "emerald"
      ? "text-emerald-700"
      : highlight === "blue"
        ? "text-blue-700"
        : "text-slate-700";
  return (
    <tr className="border-t border-slate-100">
      <td className={`py-2 font-medium ${color}`}>{label}</td>
      <td className="py-2 text-right tabular-nums text-slate-700">{yen(interest)}</td>
      <td className="py-2 text-right tabular-nums text-slate-500">{fmt(months)}</td>
    </tr>
  );
}
