"use client";

// ボーナス（賞与）手取り計算機 本体（クライアントコンポーネント）。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateBonus } from "@/lib/bonus/calculate";
import { yen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";
const smallInputClass =
  "w-28 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function BonusCalculator() {
  const [bonusAmount, setBonusAmount] = useState(500_000);
  const [monthlySalary, setMonthlySalary] = useState(300_000);
  const [age, setAge] = useState(30);
  const [dependents, setDependents] = useState(0);

  useSharedParams((get) => {
    applyNumber(get, "bonus", setBonusAmount);
    applyNumber(get, "salary", setMonthlySalary);
    applyNumber(get, "age", setAge);
    applyNumber(get, "deps", setDependents);
  });

  const shareParams = { bonus: bonusAmount, salary: monthlySalary, age, deps: dependents };

  const result = useMemo(
    () => calculateBonus({ bonusAmount, monthlySalary, age, dependents }),
    [bonusAmount, monthlySalary, age, dependents],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">賞与と前月の給与を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">賞与の総支給額（額面）</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={bonusAmount} onChange={setBonusAmount} className={inputClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={3_000_000}
            step={10_000}
            value={Math.min(bonusAmount, 3_000_000)}
            onChange={(e) => setBonusAmount(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">前月の給与（額面・月給）</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={monthlySalary} onChange={setMonthlySalary} className={inputClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={1_500_000}
            step={10_000}
            value={Math.min(monthlySalary, 1_500_000)}
            onChange={(e) => setMonthlySalary(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <p className="mt-1 text-xs text-slate-400">
            賞与の所得税（源泉徴収）は、前月の給与額と扶養人数で決まる「算出率」で計算します。
          </p>
        </label>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">年齢</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={16}
                max={120}
                value={age}
                onChange={(e) => setAge(Math.max(0, Number(e.target.value)))}
                className={smallInputClass}
              />
              <span className="text-slate-500">歳</span>
            </div>
            {result.hasLongTermCare && (
              <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                介護保険料あり
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">扶養親族等の数</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={7}
                value={dependents}
                onChange={(e) =>
                  setDependents(Math.min(7, Math.max(0, Number(e.target.value))))
                }
                className={smallInputClass}
              />
              <span className="text-slate-500">人</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">扶養控除等申告書に記載の人数</p>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">ボーナスの手取り額</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {yen(result.takeHome)}
          </div>
          <div className="mt-1 text-xs text-emerald-700/80">
            総支給 {yen(result.bonusAmount)} の約 {percent(result.takeHomeRate, 1)}（差引 約{" "}
            {yen(result.bonusAmount - result.takeHome)}）
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">賞与の総支給額</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.bonusAmount)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-500">− 健康保険料</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.health)}</td>
            </tr>
            {result.hasLongTermCare && (
              <tr className="border-t border-slate-100">
                <td className="py-2 text-slate-500">− 介護保険料（40〜64歳）</td>
                <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.longTermCare)}</td>
              </tr>
            )}
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-500">− 厚生年金保険料</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.pension)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-500">− 雇用保険料</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.employment)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-500">
                − 所得税（源泉・税率{percent(result.incomeTaxRate, 3)}）
              </td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.incomeTax)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">＝ 手取り額</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">
                {yen(result.takeHome)}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
          社会保険料（本人負担）の合計は <strong>{yen(result.socialInsurance)}</strong>、所得税（源泉徴収）は{" "}
          <strong>{yen(result.incomeTax)}</strong> です。
          <br />
          ※ <strong>住民税は賞与から天引きされません</strong>（前年の所得をもとに、毎月の給与から徴収されるため）。
        </p>

        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 協会けんぽ（東京都）の料率に基づく概算です。健康保険料率は勤務先の健康保険組合・都道府県で異なり、
          源泉所得税は前月給与や扶養の状況で変わります。年末調整・確定申告で最終的な税額が精算されます。正確な額は給与明細でご確認ください。
        </p>
      </section>
    </div>
  );
}
