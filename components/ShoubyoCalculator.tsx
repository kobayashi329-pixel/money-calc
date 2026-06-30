"use client";

// 傷病手当金 計算機 本体。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateShoubyo } from "@/lib/shoubyo/calculate";
import { yen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";
const numClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function ShoubyoCalculator() {
  const [standardMonthly, setStandardMonthly] = useState(300_000);
  const [daysOff, setDaysOff] = useState(30);

  useSharedParams((get) => {
    applyNumber(get, "monthly", setStandardMonthly);
    applyNumber(get, "days", setDaysOff);
  });

  const shareParams = { monthly: standardMonthly, days: daysOff };
  const result = useMemo(
    () => calculateShoubyo({ standardMonthly, daysOff }),
    [standardMonthly, daysOff],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">月給と休む日数を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            標準報酬月額（目安として月給を入力）
          </span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={standardMonthly} onChange={setStandardMonthly} max={2_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <span className="mt-1 block text-xs text-slate-400">
            正確には「支給開始日以前12か月の標準報酬月額の平均」。目安として直近の月給でOK
          </span>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">連続して休んだ日数</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={546}
              value={daysOff}
              onChange={(e) => setDaysOff(Number(e.target.value))}
              className={numClass}
            />
            <span className="shrink-0 text-slate-500">日</span>
          </div>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={Math.min(daysOff, 180)}
            onChange={(e) => setDaysOff(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <span className="mt-1 block text-xs text-slate-400">
            最初の連続3日間は「待期」で支給対象外。4日目から支給されます
          </span>
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">受給総額の目安</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.total)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">
            1日あたり {yen(result.benefitDaily)} × {result.paidDays}日
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">標準報酬日額（月額÷30）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.standardDaily)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">1日あたりの傷病手当金（×2/3）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.benefitDaily)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">支給対象日数（休み−待期3日）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{result.paidDays}日</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">受給総額の目安</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは協会けんぽの計算方法に基づく概算です。支給は同一傷病で通算1年6か月まで。
          会社から給与が支払われる場合は調整されます。正確な額は加入する健康保険（協会けんぽ・健保組合）にご確認ください。
        </p>
      </section>
    </div>
  );
}
