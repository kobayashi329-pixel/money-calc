"use client";

// 退職金の手取り・税金計算 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateTaishoku } from "@/lib/taishoku/calculate";
import { yen, manYen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { DonutChart, type DonutSegment } from "./DonutChart";

const COLORS = {
  takeHome: "#10b981", // emerald-500
  incomeTax: "#f59e0b", // amber-500
  residentTax: "#ef4444", // red-500
};

export function TaishokuCalculator() {
  const [severance, setSeverance] = useState(20_000_000);
  const [years, setYears] = useState(30);
  const [isOfficer, setIsOfficer] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const result = useMemo(
    () => calculateTaishoku({ severance, years, isOfficer }),
    [severance, years, isOfficer],
  );

  const takeHomeRate = result.severance > 0 ? result.takeHome / result.severance : 0;

  const donutSegments: DonutSegment[] = [
    { label: "手取り", value: result.takeHome, color: COLORS.takeHome },
    { label: "所得税", value: result.incomeTax, color: COLORS.incomeTax },
    { label: "住民税", value: result.residentTax, color: COLORS.residentTax },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">退職金と勤続年数を入力</h2>

        {/* 退職金 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">退職金の額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={severance} onChange={setSeverance} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={50_000_000}
            step={500_000}
            value={Math.min(severance, 50_000_000)}
            onChange={(e) => setSeverance(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">
            {manYen(severance)}
          </div>
        </label>

        {/* 勤続年数 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">勤続年数</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={50}
              value={years}
              onChange={(e) => setYears(Math.min(50, Math.max(1, Number(e.target.value))))}
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
          <p className="mt-1 text-xs text-slate-400">
            勤続年数が長いほど退職所得控除が大きくなり、税金は軽くなります（1年未満は切り上げ）。
          </p>
        </label>

        {/* 詳細設定 */}
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="mt-5 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          aria-expanded={showDetails}
        >
          <span>詳細設定（役員等の判定）</span>
          <span className="text-slate-400">{showDetails ? "閉じる ▲" : "開く ▼"}</span>
        </button>

        {showDetails && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={isOfficer}
                onChange={(e) => setIsOfficer(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-emerald-500"
              />
              <span className="text-sm text-slate-700">
                役員等で勤続5年以下
                <span className="mt-0.5 block text-xs text-slate-400">
                  該当する場合、1/2課税（退職所得を半分にする扱い）が適用されず、税負担が重くなります。
                  一般の従業員はチェック不要です。
                </span>
              </span>
            </label>
          </div>
        )}
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-slate-900">計算結果</h2>
        <p className="mb-4 text-xs text-slate-400">
          {result.taxYear}年（令和{result.taxYear - 2018}年）分の制度に基づく概算
        </p>

        {/* 手取り */}
        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">退職金の手取り（概算）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {yen(result.takeHome)}
          </div>
          <div className="mt-2 text-xs text-emerald-700/80">
            税金の合計 {yen(result.totalTax)}（手取り率 {percent(takeHomeRate)}）
          </div>
          {result.totalTax === 0 && (
            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              退職所得控除（{manYen(result.retirementDeduction)}）の範囲内のため、税金はかかりません。
            </p>
          )}
        </div>

        {/* ドーナツ */}
        <DonutChart
          segments={donutSegments}
          centerLabel="手取り率"
          centerValue={percent(takeHomeRate, 0)}
        />

        {/* 内訳 */}
        <table className="mt-6 w-full border-collapse text-sm">
          <tbody>
            <Row label="退職金" value={result.severance} bold />
            <Row label={`退職所得控除（勤続${result.yearsForDeduction}年）`} value={-result.retirementDeduction} color="text-slate-500" />
            <Row label="控除後の金額" value={result.afterDeduction} sub />
            <Row
              label={
                result.halfApplied === "full"
                  ? "課税退職所得（1/2課税）"
                  : result.halfApplied === "partial"
                    ? "課税退職所得（一部1/2課税）"
                    : "課税退職所得（1/2課税なし）"
              }
              value={result.taxableIncome}
              sub
            />
            <Row label="所得税（復興特別所得税込）" value={-result.incomeTax} color="text-amber-600" />
            <Row label="住民税（退職所得×10%）" value={-result.residentTax} color="text-red-500" />
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">手取り額</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">
                {yen(result.takeHome)}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは「退職一時金」を一括で受け取る場合の<strong>概算</strong>です。
          年金形式での受取、同じ年に複数の退職金がある場合、確定拠出年金（iDeCo・企業型DC）の一時金との
          重複期間の調整、「退職所得の受給に関する申告書」を出していない場合（一律20.42%源泉徴収）などは
          反映していません。正確な額は勤務先・税務署や専門家にご確認ください。
        </p>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  sub,
  color,
}: {
  label: string;
  value: number;
  bold?: boolean;
  sub?: boolean;
  color?: string;
}) {
  return (
    <tr className="border-t border-slate-100">
      <td className={`py-2 ${bold ? "font-bold text-slate-900" : sub ? "text-slate-500" : "text-slate-700"}`}>
        {label}
      </td>
      <td
        className={`py-2 text-right tabular-nums ${
          color ?? (bold ? "font-bold text-slate-900" : sub ? "text-slate-500" : "text-slate-700")
        }`}
      >
        {value < 0 ? `−${yen(-value)}` : yen(value)}
      </td>
    </tr>
  );
}
