"use client";

// 残業代（割増賃金）計算機 本体。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateZangyo } from "@/lib/zangyo/calculate";
import { yen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";
const numClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function ZangyoCalculator() {
  const [baseWage, setBaseWage] = useState(300_000);
  const [monthlyHours, setMonthlyHours] = useState(160);
  const [overtimeHours, setOvertimeHours] = useState(20);
  const [nightHours, setNightHours] = useState(0);
  const [holidayHours, setHolidayHours] = useState(0);

  useSharedParams((get) => {
    applyNumber(get, "wage", setBaseWage);
    applyNumber(get, "hours", setMonthlyHours);
    applyNumber(get, "ot", setOvertimeHours);
    applyNumber(get, "night", setNightHours);
    applyNumber(get, "holiday", setHolidayHours);
  });

  const shareParams = {
    wage: baseWage,
    hours: monthlyHours,
    ot: overtimeHours,
    night: nightHours,
    holiday: holidayHours,
  };

  const result = useMemo(
    () =>
      calculateZangyo({
        baseWage,
        monthlyHours,
        overtimeHours,
        nightHours,
        holidayHours,
      }),
    [baseWage, monthlyHours, overtimeHours, nightHours, holidayHours],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">給与と残業時間を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            月の基礎賃金（基本給＋対象手当）
          </span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={baseWage} onChange={setBaseWage} max={3_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <span className="mt-1 block text-xs text-slate-400">
            ※家族手当・通勤手当・住宅手当などは基礎賃金に含めません
          </span>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">月平均の所定労働時間</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={320}
              value={monthlyHours}
              onChange={(e) => setMonthlyHours(Number(e.target.value))}
              className={numClass}
            />
            <span className="shrink-0 text-slate-500">時間</span>
          </div>
          <span className="mt-1 block text-xs text-slate-400">
            目安：年間休日120日・1日8時間なら約163時間
          </span>
        </label>

        <div className="mt-5 grid gap-3">
          {(
            [
              ["時間外労働", overtimeHours, setOvertimeHours, "法定の8時間/日・40時間/週を超えた分"],
              ["うち深夜（22〜5時）", nightHours, setNightHours, "時間外と重なる深夜の時間"],
              ["法定休日労働", holidayHours, setHolidayHours, "週1日の法定休日に働いた時間"],
            ] as const
          ).map(([label, val, setter, desc]) => (
            <label key={label} className="block">
              <span className="text-sm font-medium text-slate-700">{label}（月）</span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={300}
                  value={val}
                  onChange={(e) => setter(Number(e.target.value))}
                  className={numClass}
                />
                <span className="shrink-0 text-slate-500">時間</span>
              </div>
              <span className="mt-1 block text-xs text-slate-400">{desc}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">1か月の残業代の目安</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.total)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">
            1時間あたりの基礎賃金 {yen(result.hourlyWage)}
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">時間外（25%増）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.payOvertime)}</td>
            </tr>
            {result.payOvertimeOver60 > 0 && (
              <tr className="border-t border-slate-100">
                <td className="py-2 text-slate-700">時間外 月60時間超（50%増）</td>
                <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.payOvertimeOver60)}</td>
              </tr>
            )}
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">深夜割増（25%加算）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.payNight)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">法定休日（35%増）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.payHoliday)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">残業代の合計</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは概算です。基礎賃金に含める手当の範囲、変形労働時間制、固定残業代（みなし残業）、
          管理監督者の扱いなどで実際の金額は変わります。正確な計算は勤務先や労働基準監督署にご確認ください。
        </p>
      </section>
    </div>
  );
}
