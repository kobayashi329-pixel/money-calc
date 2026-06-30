"use client";

// 失業保険（基本手当）計算機 本体。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateShitsugyo, type LeaveReason } from "@/lib/shitsugyo/calculate";
import { yen, manYen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";
const numClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function ShitsugyoCalculator() {
  const [age, setAge] = useState(40);
  const [monthlyWage, setMonthlyWage] = useState(300_000);
  const [insuredYears, setInsuredYears] = useState(10);
  const [reason, setReason] = useState<LeaveReason>("self");

  useSharedParams((get) => {
    applyNumber(get, "age", setAge);
    applyNumber(get, "wage", setMonthlyWage);
    applyNumber(get, "years", setInsuredYears);
    const r = get("reason");
    if (r === "self" || r === "company") setReason(r);
  });

  const shareParams = { age, wage: monthlyWage, years: insuredYears, reason };
  const result = useMemo(
    () => calculateShitsugyo({ age, monthlyWage, insuredYears, reason }),
    [age, monthlyWage, insuredYears, reason],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">離職時の条件を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            離職前6か月の平均月給（額面・賞与を除く）
          </span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={monthlyWage} onChange={setMonthlyWage} max={2_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">離職時の年齢</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min={18}
                max={64}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={numClass}
              />
              <span className="shrink-0 text-slate-500">歳</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">被保険者期間</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={45}
                value={insuredYears}
                onChange={(e) => setInsuredYears(Number(e.target.value))}
                className={numClass}
              />
              <span className="shrink-0 text-slate-500">年</span>
            </div>
          </label>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700">離職理由</span>
          <div className="mt-1 grid gap-2">
            {(
              [
                ["self", "自己都合・定年など", "一般の受給資格者。給付制限2か月あり"],
                ["company", "会社都合・倒産・解雇など", "特定受給資格者。給付日数が手厚い"],
              ] as const
            ).map(([val, label, desc]) => (
              <button
                key={val}
                type="button"
                onClick={() => setReason(val)}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  reason === val
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

        {result.days === 0 ? (
          <div className="mb-5 rounded-xl bg-amber-50 p-4 text-center text-sm text-amber-800">
            自己都合の場合、被保険者期間が原則<strong>1年以上</strong>ないと受給できません。
            会社都合（特定受給資格者）なら6か月以上で受給できる場合があります。
          </div>
        ) : (
          <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
            <div className="text-sm text-emerald-800">受給総額の目安</div>
            <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.total)}</div>
            <div className="mt-1 text-xs text-emerald-700/80">
              1日 {yen(result.benefitDaily)} × {result.days}日（約{manYen(result.total)}）
            </div>
          </div>
        )}

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">賃金日額（月給÷30）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.wageDaily)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">給付率</td>
              <td className="py-2 text-right tabular-nums text-slate-900">約 {percent(result.rate, 0)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">基本手当日額</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.benefitDaily)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">所定給付日数</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{result.days}日</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">受給総額の目安</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        {result.restrictionMonths > 0 && result.days > 0 && (
          <p className="mt-3 text-xs text-slate-500">
            ※自己都合退職は、待期7日に加えて原則<strong>2か月</strong>の給付制限後に支給開始です。
          </p>
        )}

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは概算です。基本手当日額の上限額・賃金日額の区分は毎年8月1日に改定されます
          （本ツールは令和7年8月1日時点）。実際の金額・給付日数・受給資格はハローワークにご確認ください。
        </p>
      </section>
    </div>
  );
}
