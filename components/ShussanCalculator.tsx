"use client";

// 出産手当金 計算機 本体。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateShussan } from "@/lib/shussan/calculate";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function ShussanCalculator() {
  const [standardMonthly, setStandardMonthly] = useState(300_000);
  const [multiple, setMultiple] = useState(false);

  useSharedParams((get) => {
    applyNumber(get, "monthly", setStandardMonthly);
    const m = get("multiple");
    if (m === "1") setMultiple(true);
  });

  const shareParams = { monthly: standardMonthly, multiple: multiple ? 1 : 0 };
  const result = useMemo(
    () => calculateShussan({ standardMonthly, multiple }),
    [standardMonthly, multiple],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">月給と妊娠の種類を入力</h2>

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

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700">妊娠の種類</span>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(
              [
                [false, "単胎（1人）", "産前42日＋産後56日＝98日"],
                [true, "多胎（双子など）", "産前98日＋産後56日＝154日"],
              ] as const
            ).map(([val, label, desc]) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setMultiple(val)}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  multiple === val
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="block font-semibold">{label}</span>
                <span className="block text-xs text-slate-400">{desc}</span>
              </button>
            ))}
          </div>
        </div>
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
            1日 {yen(result.benefitDaily)} × {result.days}日（約{manYen(result.total)}）
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">標準報酬日額（月額÷30）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.standardDaily)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">1日あたりの出産手当金（×2/3）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.benefitDaily)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">支給対象日数</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{result.days}日</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">受給総額の目安</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは協会けんぽの計算方法に基づく概算です。支給日数は出産予定日と実際の出産日のズレで増減します。
          会社から給与が支払われる場合は調整されます。正確な額は加入する健康保険（協会けんぽ・健保組合）にご確認ください。
        </p>
      </section>
    </div>
  );
}
