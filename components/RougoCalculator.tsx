"use client";

// 老後資金シミュレーション 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateRougo } from "@/lib/rougo/calculate";
import { yen, manYen } from "@/lib/format";
import { DonutChart, type DonutSegment } from "./DonutChart";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const COLORS = {
  savings: "#3b82f6", // blue-500 … 現在の貯蓄（運用後）
  allowance: "#8b5cf6", // violet-500 … 退職金
  toSave: "#f59e0b", // amber-500 … これから積み立てて作る分
};

function NumField({
  label,
  value,
  onChange,
  step = 10_000,
  suffix = "円",
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  suffix?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        {suffix === "円" ? (
          <MoneyInput
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          />
        ) : (
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={step}
            value={value}
            onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          />
        )}
        <span className="shrink-0 text-slate-500">{suffix}</span>
      </div>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </label>
  );
}

export function RougoCalculator() {
  const [currentAge, setCurrentAge] = useState(40);
  const [retireAge, setRetireAge] = useState(65);
  const [untilAge, setUntilAge] = useState(95);
  const [monthlyExpense, setMonthlyExpense] = useState(250_000);
  const [monthlyPension, setMonthlyPension] = useState(150_000);
  const [currentSavings, setCurrentSavings] = useState(5_000_000);
  const [retirementAllowance, setRetirementAllowance] = useState(10_000_000);
  const [specialReserve, setSpecialReserve] = useState(5_000_000);
  const [rateStr, setRateStr] = useState("3");

  useSharedParams((get) => {
    applyNumber(get, "ca", setCurrentAge);
    applyNumber(get, "ra", setRetireAge);
    applyNumber(get, "ua", setUntilAge);
    applyNumber(get, "exp", setMonthlyExpense);
    applyNumber(get, "pen", setMonthlyPension);
    applyNumber(get, "sav", setCurrentSavings);
    applyNumber(get, "allow", setRetirementAllowance);
    applyNumber(get, "reserve", setSpecialReserve);
    const r = get("rate");
    if (r != null && Number.isFinite(Number(r))) setRateStr(r);
  });

  const shareParams = {
    ca: currentAge,
    ra: retireAge,
    ua: untilAge,
    exp: monthlyExpense,
    pen: monthlyPension,
    sav: currentSavings,
    allow: retirementAllowance,
    reserve: specialReserve,
    rate: rateStr,
  };

  const savingRatePercent = Number(rateStr) || 0;

  const result = useMemo(
    () =>
      calculateRougo({
        currentAge,
        retireAge,
        untilAge,
        monthlyExpense,
        monthlyPension,
        currentSavings,
        retirementAllowance,
        specialReserve,
        savingRatePercent,
      }),
    [currentAge, retireAge, untilAge, monthlyExpense, monthlyPension, currentSavings, retirementAllowance, specialReserve, savingRatePercent],
  );

  const donutSegments: DonutSegment[] = [
    { label: "現在の貯蓄（運用後）", value: result.grownSavings, color: COLORS.savings },
    { label: "退職金", value: result.retirementAllowance, color: COLORS.allowance },
    { label: "これから積み立てる分", value: result.shortfall, color: COLORS.toSave },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">あなたの状況を入力</h2>

        <div className="space-y-5">
          {/* 年齢まわり */}
          <div className="grid grid-cols-3 gap-3">
            <NumField label="現在の年齢" value={currentAge} onChange={setCurrentAge} step={1} suffix="歳" />
            <NumField label="退職する年齢" value={retireAge} onChange={setRetireAge} step={1} suffix="歳" />
            <NumField label="何歳まで" value={untilAge} onChange={setUntilAge} step={1} suffix="歳" />
          </div>

          {/* 老後の収支 */}
          <NumField
            label="老後の毎月の生活費"
            value={monthlyExpense}
            onChange={setMonthlyExpense}
            hint="総務省の家計調査では高齢夫婦無職世帯の支出は月およそ25〜27万円が目安です。"
          />
          <NumField
            label="老後の毎月の年金収入"
            value={monthlyPension}
            onChange={setMonthlyPension}
            hint="ねんきん定期便やねんきんネットの見込み額を入力すると正確になります。"
          />

          {/* 準備 */}
          <div className="grid grid-cols-2 gap-3">
            <NumField label="現在の貯蓄額" value={currentSavings} onChange={setCurrentSavings} step={100_000} />
            <NumField label="退職金の見込み" value={retirementAllowance} onChange={setRetirementAllowance} step={100_000} />
          </div>

          {/* 詳細 */}
          <div className="grid grid-cols-2 gap-3">
            <NumField
              label="特別支出の予備費"
              value={specialReserve}
              onChange={setSpecialReserve}
              step={500_000}
              hint="介護・住宅修繕・医療など"
            />
            <label className="block">
              <span className="text-sm font-medium text-slate-700">想定利回り（年率）</span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={20}
                  step={0.5}
                  value={rateStr}
                  onChange={(e) => setRateStr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                />
                <span className="shrink-0 text-slate-500">％</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">退職までの貯蓄・運用</p>
            </label>
          </div>
        </div>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        {/* 退職時に必要な額 */}
        <div className="mb-5 rounded-xl bg-violet-50 p-4 text-center">
          <div className="text-sm text-violet-800">
            退職（{retireAge}歳）時に必要な老後資金
          </div>
          <div className="text-3xl font-extrabold text-violet-700 tabular-nums">
            {yen(result.totalNeeded)}
          </div>
          <p className="mt-1 text-xs text-violet-700/80">
            {untilAge}歳まで {result.retirementYears}年間、毎月の不足{" "}
            {yen(result.monthlyGap)} を補う前提（＋特別支出の予備費）
          </p>
        </div>

        {/* 不足 or 充足の主役表示 */}
        {result.isCovered ? (
          <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
            <div className="text-sm text-emerald-800">準備の見込み</div>
            <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
              準備OK（余裕 {yen(result.surplus)}）
            </div>
            <p className="mt-1 text-xs text-emerald-700/80">
              現在の貯蓄と退職金の見込みで、必要な老後資金に達する試算です。
            </p>
          </div>
        ) : (
          <div className="mb-5 rounded-xl bg-amber-50 p-4 text-center">
            <div className="text-sm text-amber-800">
              不足額 {yen(result.shortfall)} を埋めるには
            </div>
            <div className="text-3xl font-extrabold text-amber-700 tabular-nums">
              毎月 {yen(result.requiredMonthlySaving)}
            </div>
            <p className="mt-1 text-xs text-amber-700/80">
              退職まで {result.yearsUntilRetire}年間、年率{savingRatePercent}%で積み立てた場合
            </p>
          </div>
        )}

        {/* 必要額の内訳ドーナツ（準備済み＋これから） */}
        <DonutChart
          segments={donutSegments}
          centerLabel="必要額"
          centerValue={manYen(result.totalNeeded)}
        />

        {/* 内訳表 */}
        <table className="mt-6 w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 font-bold text-slate-900">退職時に必要な老後資金</td>
              <td className="py-2 text-right font-bold tabular-nums text-slate-900">{yen(result.totalNeeded)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">現在の貯蓄（運用後の見込み）</td>
              <td className="py-2 text-right tabular-nums text-slate-700">{yen(result.grownSavings)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">退職金の見込み</td>
              <td className="py-2 text-right tabular-nums text-slate-700">{yen(result.retirementAllowance)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-amber-700">
                {result.isCovered ? "余剰" : "不足額（これから準備）"}
              </td>
              <td className="py-2 text-right text-base font-bold tabular-nums text-amber-700">
                {result.isCovered ? yen(result.surplus) : yen(result.shortfall)}
              </td>
            </tr>
          </tbody>
        </table>

        {!result.isCovered && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-xs leading-5 text-emerald-800">
            毎月 {yen(result.requiredMonthlySaving)} の積立は、税制優遇のある制度が有利です。
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Link href="/nisa" className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700">
                NISAで試算 →
              </Link>
              <Link href="/ideco" className="rounded-lg border border-emerald-600 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100">
                iDeCoで試算 →
              </Link>
            </div>
          </div>
        )}

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは入力値に基づく<strong>概算</strong>です。物価上昇（インフレ）、年金額の将来の変動、
          運用成績の変動（元本割れの可能性）は考慮していません。前提を変えて複数のパターンで確認し、
          重要な判断はファイナンシャルプランナー等の専門家にご相談ください。
        </p>
      </section>
    </div>
  );
}
