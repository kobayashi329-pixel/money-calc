"use client";

// 所得税 計算機 本体。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateShotoku } from "@/lib/shotoku/calculate";
import { yen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function ShotokuCalculator() {
  const [taxable, setTaxable] = useState(3_000_000);

  useSharedParams((get) => {
    applyNumber(get, "taxable", setTaxable);
  });

  const shareParams = { taxable };
  const result = useMemo(() => calculateShotoku(taxable), [taxable]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">課税所得を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">課税される所得金額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={taxable} onChange={setTaxable} max={500_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={20_000_000}
            step={100_000}
            value={Math.min(taxable, 20_000_000)}
            onChange={(e) => setTaxable(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <span className="mt-1 block text-xs text-slate-400">
            課税所得＝収入 − 給与所得控除（や経費）− 所得控除（基礎・社会保険料・扶養など）。
            年収から手取りを出したいときは<a href="/tedori" className="text-emerald-700 underline">年収手取り計算機</a>へ。
          </span>
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">所得税（復興特別所得税込み）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.total)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">
            適用税率（限界税率）{percent(result.rate, 0)}
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">課税所得（1,000円未満切捨て）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.taxable)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">所得税</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.incomeTax)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">復興特別所得税（2.1%）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.reconstruction)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">合計</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは課税所得に対する所得税の速算表による概算です。住民税は含みません。
          住宅ローン控除・配当控除などの税額控除は反映していません。正確な額は国税庁の資料や税務署にご確認ください。
        </p>
      </section>
    </div>
  );
}
