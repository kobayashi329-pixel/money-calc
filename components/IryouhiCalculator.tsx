"use client";

// 医療費控除 計算機 本体。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateIryouhi } from "@/lib/iryouhi/calculate";
import { yen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function IryouhiCalculator() {
  const [medicalCost, setMedicalCost] = useState(300_000);
  const [compensation, setCompensation] = useState(0);
  const [taxableIncome, setTaxableIncome] = useState(3_000_000);

  useSharedParams((get) => {
    applyNumber(get, "cost", setMedicalCost);
    applyNumber(get, "hoken", setCompensation);
    applyNumber(get, "taxable", setTaxableIncome);
  });

  const shareParams = { cost: medicalCost, hoken: compensation, taxable: taxableIncome };
  const result = useMemo(
    () => calculateIryouhi({ medicalCost, compensation, taxableIncome }),
    [medicalCost, compensation, taxableIncome],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">医療費と所得を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">1年間に支払った医療費の合計</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={medicalCost} onChange={setMedicalCost} max={20_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <span className="mt-1 block text-xs text-slate-400">
            本人＋生計を同じくする家族の分の合計（通院の交通費なども対象）
          </span>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">保険金などで補填された額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={compensation} onChange={setCompensation} max={20_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <span className="mt-1 block text-xs text-slate-400">
            高額療養費・生命保険の入院給付金・出産育児一時金など（なければ0）
          </span>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">課税される所得金額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={taxableIncome} onChange={setTaxableIncome} max={100_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <span className="mt-1 block text-xs text-slate-400">
            所得税率の判定に使います。年収からの手取りは<a href="/tedori" className="text-emerald-700 underline">年収手取り計算機</a>へ
          </span>
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">軽減される税金の目安</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.refund)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">
            {result.deduction > 0
              ? <>医療費控除 {yen(result.deduction)} × 税率 {percent(result.totalRate, 0)}</>
              : "控除の対象になる医療費がありません"}
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">支払った医療費 − 補填</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(Math.max(0, medicalCost - compensation))}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">足切り額（10万円 or 所得5%）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">−{yen(result.threshold)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">医療費控除額</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.deduction)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">軽減率（所得税{percent(result.incomeRate, 0)}＋住民税10%）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{percent(result.totalRate, 0)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">軽減される税金の目安</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.refund)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは概算です。足切り額は総所得金額等が200万円未満の場合は「総所得×5%」で、本ツールは課税所得で近似しています。
          セルフメディケーション税制との併用はできません。医療費控除は確定申告が必要です。正確な額は税務署・税理士にご確認ください。
        </p>
      </section>
    </div>
  );
}
