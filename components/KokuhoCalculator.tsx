"use client";

// 国民健康保険料 計算機 本体（標準モデル・料率は自治体の値に変更可）。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateKokuho, STANDARD_RATES, type KokuhoRates } from "@/lib/kokuho/calculate";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";
const numClass =
  "w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-right text-sm font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";
const cntClass =
  "w-20 rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function KokuhoCalculator() {
  const [income, setIncome] = useState(3_000_000);
  const [members, setMembers] = useState(1);
  const [kaigoMembers, setKaigoMembers] = useState(0);
  const [rates, setRates] = useState<KokuhoRates>({ ...STANDARD_RATES });

  useSharedParams((get) => {
    applyNumber(get, "income", setIncome);
    applyNumber(get, "members", setMembers);
    applyNumber(get, "kaigo", setKaigoMembers);
  });

  const shareParams = { income, members, kaigo: kaigoMembers };
  const result = useMemo(
    () => calculateKokuho({ income, members, kaigoMembers, rates }),
    [income, members, kaigoMembers, rates],
  );

  const setRate = (key: keyof KokuhoRates, val: number) =>
    setRates((prev) => ({ ...prev, [key]: val }));

  const RateRow = ({
    label,
    rateKey,
    capKey,
  }: {
    label: string;
    rateKey: keyof KokuhoRates;
    capKey: keyof KokuhoRates;
  }) => (
    <div className="flex items-center justify-between gap-2 border-t border-slate-100 py-1.5">
      <span className="text-xs text-slate-600">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          step={0.01}
          value={Math.round(rates[rateKey] * 10000) / 100}
          onChange={(e) => setRate(rateKey, Number(e.target.value) / 100)}
          className={numClass}
        />
        <span className="text-xs text-slate-400">%</span>
        <input
          type="number"
          step={100}
          value={rates[capKey]}
          onChange={(e) => setRate(capKey, Number(e.target.value))}
          className={numClass}
        />
        <span className="text-xs text-slate-400">円</span>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">前年の所得と加入人数を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">前年の所得（総所得金額等）</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={income} onChange={setIncome} max={50_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <span className="mt-1 block text-xs text-slate-400">
            給与の人は「年収 − 給与所得控除」、自営業は「売上 − 経費」。所得控除（社保・扶養等）は引きません
          </span>
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">加入人数（世帯）</span>
            <div className="mt-1 flex items-center gap-2">
              <input type="number" min={1} max={10} value={members} onChange={(e) => setMembers(Number(e.target.value))} className={cntClass} />
              <span className="shrink-0 text-slate-500">人</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">うち40〜64歳</span>
            <div className="mt-1 flex items-center gap-2">
              <input type="number" min={0} max={10} value={kaigoMembers} onChange={(e) => setKaigoMembers(Number(e.target.value))} className={cntClass} />
              <span className="shrink-0 text-slate-500">人</span>
            </div>
          </label>
        </div>

        <details className="mt-4 rounded-lg border border-slate-200 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">
            料率を自分の自治体の値に変更する（既定＝標準モデル・東京23区）
          </summary>
          <p className="mt-2 text-xs text-slate-400">左＝所得割率(%)／右＝均等割 または 限度額(円)</p>
          <div className="mt-1">
            <RateRow label="医療分 所得割 / 均等割" rateKey="iryoRate" capKey="iryoPerCapita" />
            <RateRow label="支援金分 所得割 / 均等割" rateKey="shienRate" capKey="shienPerCapita" />
            <RateRow label="介護分 所得割 / 均等割" rateKey="kaigoRate" capKey="kaigoPerCapita" />
          </div>
          <button
            type="button"
            onClick={() => setRates({ ...STANDARD_RATES })}
            className="mt-2 text-xs font-semibold text-emerald-700 hover:underline"
          >
            標準モデルに戻す
          </button>
        </details>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">年間の国民健康保険料の目安</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.total)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">
            月あたり 約 {yen(result.monthly)}（約{manYen(result.total)}/年）
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">所得割の基礎（所得 − 43万円）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.base)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">医療分</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.iryo)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">後期高齢者支援金分</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.shien)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">介護分（40〜64歳）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.kaigo)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">年間の合計</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは「標準モデル（東京23区）」による概算で、<strong>国保料は自治体で大きく異なります</strong>
          （平等割・資産割がある自治体や、料率が違う自治体も）。正確な額は、上の「料率を変更」に
          お住まいの自治体の値を入れるか、自治体の窓口・試算ページでご確認ください。
        </p>
      </section>
    </div>
  );
}
