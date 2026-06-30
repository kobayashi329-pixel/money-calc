"use client";

// 育児休業給付金 計算機 本体。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateIkukyu } from "@/lib/ikukyu/calculate";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";
const numClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function IkukyuCalculator() {
  const [monthlyWage, setMonthlyWage] = useState(300_000);
  const [months, setMonths] = useState(12);

  useSharedParams((get) => {
    applyNumber(get, "wage", setMonthlyWage);
    applyNumber(get, "months", setMonths);
  });

  const shareParams = { wage: monthlyWage, months };
  const result = useMemo(
    () => calculateIkukyu({ monthlyWage, months }),
    [monthlyWage, months],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">休業前の月給と育休期間を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            休業前の月給（額面・賞与を除く）
          </span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={monthlyWage} onChange={setMonthlyWage} max={2_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={100_000}
            max={600_000}
            step={10_000}
            value={Math.min(Math.max(monthlyWage, 100_000), 600_000)}
            onChange={(e) => setMonthlyWage(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <span className="mt-1 block text-xs text-slate-400">
            正確には「休業開始前6か月の賃金÷180×30」。目安として月給でOK
          </span>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">育児休業を取得する月数</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={24}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className={numClass}
            />
            <span className="shrink-0 text-slate-500">か月</span>
          </div>
          <input
            type="range"
            min={1}
            max={24}
            step={1}
            value={Math.min(months, 24)}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <span className="mt-1 block text-xs text-slate-400">
            最初の6か月（180日）は67%、それ以降は50%で計算します
          </span>
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">受給総額の目安（育休 {months}か月）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.total)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">約 {manYen(result.total)}</div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">最初の6か月（支給率67%）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">
                月 {yen(result.monthly67)}
              </td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">7か月目以降（支給率50%）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">
                月 {yen(result.monthly50)}
              </td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">内訳</td>
              <td className="py-2 text-right tabular-nums text-slate-900">
                67%×{result.months67}か月＋50%×{result.months50}か月
              </td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">受給総額の目安</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        {result.capped && (
          <p className="mt-3 text-xs text-slate-500">
            ※支給額が上限（67%：323,811円／50%：241,650円・令和7年8月〜）に達しています。
          </p>
        )}

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは概算です。育児休業給付金は非課税で社会保険料も免除されるため、
          手取りベースでは休業前の約8割になることもあります。2025年4月からの「出生後休業支援給付金」（最大28日間13%上乗せ）は別途。
          正確な額はハローワークにご確認ください。
        </p>
      </section>
    </div>
  );
}
