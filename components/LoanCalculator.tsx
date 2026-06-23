"use client";

// 住宅ローン返済シミュレータ本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateLoan, type RepaymentMethod } from "@/lib/loan/calculate";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { DonutChart, type DonutSegment } from "./DonutChart";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const COLORS = {
  principal: "#10b981", // emerald-500 元本
  interest: "#f59e0b", // amber-500 利息
};

export function LoanCalculator() {
  const [principal, setPrincipal] = useState(30_000_000);
  const [rateStr, setRateStr] = useState("1.0");
  const [years, setYears] = useState(35);
  const [method, setMethod] = useState<RepaymentMethod>("equal-payment");

  useSharedParams((get) => {
    applyNumber(get, "amount", setPrincipal);
    applyNumber(get, "years", setYears);
    const rate = get("rate");
    if (rate != null && Number.isFinite(Number(rate))) setRateStr(rate);
    const m = get("method");
    if (m === "equal-payment" || m === "equal-principal") setMethod(m);
  });

  const shareParams = {
    amount: principal,
    rate: rateStr,
    years,
    method,
  };

  const annualRatePercent = Number(rateStr) || 0;

  const result = useMemo(
    () => calculateLoan({ principal, annualRatePercent, years, method }),
    [principal, annualRatePercent, years, method],
  );

  const donutSegments: DonutSegment[] = [
    { label: "借入元本", value: result.principal, color: COLORS.principal },
    { label: "利息総額", value: result.totalInterest, color: COLORS.interest },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">借入条件を入力</h2>

        {/* 借入額 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">借入額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={principal} onChange={setPrincipal} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={1_000_000}
            max={100_000_000}
            step={1_000_000}
            value={Math.min(principal, 100_000_000)}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">
            {manYen(principal)}
          </div>
        </label>

        {/* 金利 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">金利（年率）</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={20}
              step={0.05}
              value={rateStr}
              onChange={(e) => setRateStr(e.target.value)}
              className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">％</span>
          </div>
        </label>

        {/* 返済期間 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">返済期間</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={50}
              value={years}
              onChange={(e) =>
                setYears(Math.min(50, Math.max(1, Number(e.target.value))))
              }
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">年</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
        </label>

        {/* 返済方式 */}
        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-slate-700">返済方式</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                ["equal-payment", "元利均等", "毎月の返済額が一定"],
                ["equal-principal", "元金均等", "返済額が徐々に減る"],
              ] as const
            ).map(([val, label, desc]) => (
              <button
                key={val}
                type="button"
                onClick={() => setMethod(val)}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  method === val
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="block font-semibold">{label}</span>
                <span className="block text-xs text-slate-400">{desc}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        {/* 毎月返済額 */}
        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">毎月の返済額</div>
          {method === "equal-payment" ? (
            <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
              {yen(result.monthlyPayment)}
            </div>
          ) : (
            <div className="text-emerald-700">
              <span className="text-2xl font-extrabold tabular-nums">
                {yen(result.firstPayment)}
              </span>
              <span className="mx-1 text-sm">→</span>
              <span className="text-2xl font-extrabold tabular-nums">
                {yen(result.lastPayment)}
              </span>
              <div className="mt-0.5 text-xs text-emerald-800">初回 → 最終回</div>
            </div>
          )}
        </div>

        {/* 元本 vs 利息 ドーナツ */}
        <DonutChart
          segments={donutSegments}
          centerLabel="総返済額"
          centerValue={manYen(result.totalPayment)}
        />

        {/* サマリ表 */}
        <table className="mt-6 w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">借入額</td>
              <td className="py-2 text-right font-semibold tabular-nums text-slate-900">
                {yen(result.principal)}
              </td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">利息総額</td>
              <td className="py-2 text-right font-semibold tabular-nums text-amber-600">
                {yen(result.totalInterest)}
              </td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">総返済額</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">
                {yen(result.totalPayment)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 残高推移 */}
        {result.yearlyBalance.length > 1 && (
          <div className="mt-6">
            <div className="mb-2 text-sm font-medium text-slate-700">
              ローン残高の推移
            </div>
            <BalanceChart
              points={result.yearlyBalance}
              principal={result.principal}
            />
          </div>
        )}

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは<strong>概算</strong>です。実際の返済額は、金融機関の計算方法・端数処理、
          ボーナス返済・保証料・団信などにより異なります。借入の判断は金融機関にご確認ください。
        </p>
      </section>
    </div>
  );
}

// 残高推移の簡易ラインチャート（依存なしのSVG）
function BalanceChart({
  points,
  principal,
}: {
  points: { year: number; balance: number }[];
  principal: number;
}) {
  const W = 320;
  const H = 120;
  const pad = 4;
  const maxYear = points[points.length - 1].year;
  const xs = (year: number) => pad + ((year - 0) / maxYear) * (W - pad * 2);
  const ys = (bal: number) =>
    H - pad - (principal > 0 ? bal / principal : 0) * (H - pad * 2);

  // 始点(0年=借入額)を加える
  const path = [{ year: 0, balance: principal }, ...points];
  const line = path.map((p) => `${xs(p.year)},${ys(p.balance)}`).join(" ");
  const area = `${xs(0)},${ys(0)} ${line} ${xs(maxYear)},${ys(0)}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="ローン残高の推移">
      <polygon points={area} fill="#10b98122" />
      <polyline points={line} fill="none" stroke="#10b981" strokeWidth={2} />
      <text x={pad} y={H - 6} className="fill-slate-400" style={{ fontSize: 9 }}>
        0年
      </text>
      <text
        x={W - pad}
        y={H - 6}
        textAnchor="end"
        className="fill-slate-400"
        style={{ fontSize: 9 }}
      >
        {maxYear}年
      </text>
    </svg>
  );
}
