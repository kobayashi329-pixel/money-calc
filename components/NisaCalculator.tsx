"use client";

// NISA積立シミュレータ本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateNisa } from "@/lib/nisa/calculate";
import { yen, manYen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { DonutChart, type DonutSegment } from "./DonutChart";
import { AssetGrowthChart } from "./AssetGrowthChart";

const COLORS = {
  principal: "#3b82f6", // blue-500 元本
  gain: "#10b981", // emerald-500 運用益
};

export function NisaCalculator() {
  const [monthly, setMonthly] = useState(30_000);
  const [rateStr, setRateStr] = useState("5");
  const [years, setYears] = useState(20);

  const annualRatePercent = Number(rateStr) || 0;

  const result = useMemo(
    () => calculateNisa({ monthlyContribution: monthly, annualRatePercent, years }),
    [monthly, annualRatePercent, years],
  );

  const donutSegments: DonutSegment[] = [
    { label: "元本（積立額）", value: result.totalPrincipal, color: COLORS.principal },
    { label: "運用益", value: result.totalGain, color: COLORS.gain },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">積立条件を入力</h2>

        {/* 毎月の積立額 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">毎月の積立額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={monthly} onChange={setMonthly} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={100_000}
            step={1_000}
            value={Math.min(monthly, 100_000)}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">
            年 {manYen(result.annualContribution)}
          </div>
        </label>

        {/* 想定利回り */}
        <label className="mt-5 block">
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
              className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">％</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            全世界株・S&amp;P500の長期実績はおおむね年3〜7%程度（将来を保証するものではありません）。
          </p>
        </label>

        {/* 積立期間 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">積立期間</span>
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
        </label>

        {/* NISA枠の注意 */}
        {(result.exceedsAnnualTsumitate || result.exceedsLifetime) && (
          <div className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            {result.exceedsAnnualTotal ? (
              <>
                年間の積立額が <strong>NISAの年間投資枠360万円</strong>を超えています。超える分はNISA口座では積み立てられません。
              </>
            ) : result.exceedsAnnualTsumitate ? (
              <>
                年間の積立額が<strong>つみたて投資枠120万円</strong>を超えています。超える分は「成長投資枠」（年240万円）の利用が必要です。
              </>
            ) : null}
            {result.exceedsLifetime && (
              <>
                {result.exceedsAnnualTsumitate ? " " : ""}
                また、元本の合計が<strong>生涯非課税限度額1,800万円</strong>を超えています。
              </>
            )}
          </div>
        )}
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">計算結果</h2>

        {/* 将来評価額 */}
        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">{years}年後の評価額（概算）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {yen(result.finalValue)}
          </div>
          <div className="mt-3 flex items-stretch justify-center gap-4 border-t border-emerald-200 pt-3">
            <div className="flex-1">
              <div className="text-xs text-emerald-800">元本</div>
              <div className="text-lg font-bold text-emerald-700 tabular-nums">
                {yen(result.totalPrincipal)}
              </div>
            </div>
            <div className="w-px self-stretch bg-emerald-200" />
            <div className="flex-1">
              <div className="text-xs text-emerald-800">運用益</div>
              <div className="text-lg font-bold text-emerald-700 tabular-nums">
                {yen(result.totalGain)}
              </div>
            </div>
          </div>
        </div>

        {/* 非課税メリット（NISAの主役） */}
        <div className="mb-5 rounded-xl bg-rose-50 p-4 text-center">
          <div className="text-sm text-rose-800">NISAの非課税メリット</div>
          <div className="text-2xl font-extrabold text-rose-700 tabular-nums">
            ＋{yen(result.taxSaved)}
          </div>
          <p className="mt-1 text-xs leading-5 text-rose-700/80">
            課税口座なら運用益に約20.315%（{yen(result.taxSaved)}）が課税されますが、
            NISAなら<strong>まるごと非課税</strong>。受取額は{" "}
            <strong>{yen(result.finalValue)}</strong>（課税口座だと約{" "}
            {yen(result.taxableFinalValue)}）。
          </p>
        </div>

        {/* 元本 vs 運用益 ドーナツ */}
        <DonutChart
          segments={donutSegments}
          centerLabel="評価額"
          centerValue={manYen(result.finalValue)}
        />

        {/* 資産推移 */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">資産の推移</span>
            <span className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-sm" style={{ background: COLORS.principal }} />
                元本
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-sm" style={{ background: COLORS.gain }} />
                運用益
              </span>
            </span>
          </div>
          <AssetGrowthChart yearly={result.yearly} principalColor={COLORS.principal} gainColor={COLORS.gain} />
        </div>

        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          元本に対する運用益の割合は <strong>{percent(result.totalPrincipal > 0 ? result.totalGain / result.totalPrincipal : 0, 0)}</strong>。
          複利の効果は期間が長いほど大きくなります。
        </p>

        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは<strong>一定の利回りが続くと仮定した概算</strong>です。実際の運用成績は変動し、
          元本割れの可能性もあります。利回りは保証されません。投資判断はご自身の責任で、必要に応じて専門家にご相談ください。
        </p>
      </section>
    </div>
  );
}
