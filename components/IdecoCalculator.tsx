"use client";

// iDeCo節税・積立シミュレータ本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateIdeco } from "@/lib/ideco/calculate";
import { IDECO_CATEGORIES, getIdecoCategory } from "@/lib/invest/constants";
import { yen, manYen, percent } from "@/lib/format";
import { DonutChart, type DonutSegment } from "./DonutChart";
import { AssetGrowthChart } from "./AssetGrowthChart";

const COLORS = {
  principal: "#3b82f6", // blue-500 元本
  gain: "#10b981", // emerald-500 運用益
  tax: "#f43f5e", // rose-500 節税
};

export function IdecoCalculator() {
  const [annualIncome, setAnnualIncome] = useState(5_000_000);
  const [categoryKey, setCategoryKey] = useState("kaishain-none");
  const [monthly, setMonthly] = useState(23_000);
  const [age, setAge] = useState(30);
  const [rateStr, setRateStr] = useState("3");
  const [dependents, setDependents] = useState(0);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const annualRatePercent = Number(rateStr) || 0;
  const category = getIdecoCategory(categoryKey);

  const result = useMemo(
    () =>
      calculateIdeco({
        annualIncome,
        age,
        categoryKey,
        monthlyContribution: monthly,
        annualRatePercent,
        dependents,
        hasSpouse,
      }),
    [annualIncome, age, categoryKey, monthly, annualRatePercent, dependents, hasSpouse],
  );

  const donutSegments: DonutSegment[] = [
    { label: "元本（掛金累計）", value: result.totalPrincipal, color: COLORS.principal },
    { label: "運用益", value: result.totalGain, color: COLORS.gain },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">条件を入力</h2>

        {/* 加入区分 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">加入区分</span>
          <select
            value={categoryKey}
            onChange={(e) => {
              const next = getIdecoCategory(e.target.value);
              setCategoryKey(e.target.value);
              // 区分を変えたら掛金を新しい上限以内に収める
              setMonthly((m) => Math.min(m, next.monthlyLimit));
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          >
            {IDECO_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}（上限 月{c.monthlyLimit.toLocaleString()}円）
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-400">{category.note}</p>
        </label>

        {/* 年収 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">額面年収（節税額の計算に使用）</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100_000}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={20_000_000}
            step={100_000}
            value={Math.min(annualIncome, 20_000_000)}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">
            {manYen(annualIncome)}
          </div>
        </label>

        {/* 毎月の掛金 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">毎月の掛金</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={5_000}
              max={category.monthlyLimit}
              step={1_000}
              value={monthly}
              onChange={(e) => setMonthly(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={5_000}
            max={category.monthlyLimit}
            step={1_000}
            value={Math.min(Math.max(monthly, 5_000), category.monthlyLimit)}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-slate-400">最低 月5,000円</span>
            <span className={result.wasCapped ? "font-semibold text-amber-600" : "text-slate-400"}>
              {result.wasCapped
                ? `上限 月${category.monthlyLimit.toLocaleString()}円に調整`
                : `上限 月${category.monthlyLimit.toLocaleString()}円`}
            </span>
          </div>
        </label>

        {/* 年齢 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">年齢</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={18}
              max={64}
              value={age}
              onChange={(e) => setAge(Math.min(64, Math.max(18, Number(e.target.value))))}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">歳</span>
            <span className="ml-1 text-xs text-slate-400">→ 65歳まで {result.years}年間積立</span>
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
            定期預金型なら0%前後、投資信託型は変動します（将来の利回りは保証されません）。
          </p>
        </label>

        {/* 詳細設定 */}
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="mt-5 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          aria-expanded={showDetails}
        >
          <span>詳細設定（配偶者・扶養）</span>
          <span className="text-slate-400">{showDetails ? "閉じる ▲" : "開く ▼"}</span>
        </button>

        {showDetails && (
          <div className="mt-4 space-y-5 border-t border-slate-100 pt-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">配偶者（配偶者控除）</span>
              <select
                value={hasSpouse ? "1" : "0"}
                onChange={(e) => setHasSpouse(e.target.value === "1")}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              >
                <option value="0">なし／共働き</option>
                <option value="1">あり（配偶者控除の対象）</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">扶養人数（16歳以上・配偶者を除く）</span>
              <select
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}人
                  </option>
                ))}
              </select>
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

        {/* 節税額（iDeCoの主役その1） */}
        <div className="mb-5 rounded-xl bg-rose-50 p-4 text-center">
          <div className="text-sm text-rose-800">毎年の節税額（所得税＋住民税）</div>
          <div className="text-3xl font-extrabold text-rose-700 tabular-nums">
            {yen(result.annualTaxSaving)}
          </div>
          <p className="mt-1 text-xs leading-5 text-rose-700/80">
            掛金が全額所得控除になり、{result.years}年間の累計で約{" "}
            <strong>{yen(result.totalTaxSaving)}</strong> の節税。
            {result.annualTaxSaving === 0 && "（所得がないため所得控除による節税メリットはありません）"}
          </p>
        </div>

        {/* 65歳時点の評価額（iDeCoの主役その2） */}
        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">65歳時点の積立評価額（概算）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {yen(result.finalValue)}
          </div>
          <div className="mt-3 flex items-stretch justify-center gap-4 border-t border-emerald-200 pt-3">
            <div className="flex-1">
              <div className="text-xs text-emerald-800">掛金累計（元本）</div>
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

        {/* 元本 vs 運用益 ドーナツ */}
        <DonutChart
          segments={donutSegments}
          centerLabel="評価額"
          centerValue={manYen(result.finalValue)}
        />

        {/* 資産推移 */}
        {result.yearly.length > 1 && (
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
        )}

        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          計算の前提：所得税の限界税率{" "}
          <strong>{percent(result.marginalIncomeTaxRate, 0)}</strong> ＋ 住民税10%。
          節税効果は「掛金 ×（所得税率＋住民税率）」で、所得が高いほど大きくなります。
        </p>

        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは<strong>概算</strong>です。節税額は他の所得控除や年収の変動で変わり、
          運用評価額は利回りが一定と仮定した試算（元本割れの可能性あり）です。
          受取時には退職所得控除・公的年金等控除の範囲で課税される場合があります。
          加入可否や詳細は運営管理機関・専門家にご確認ください。
        </p>
      </section>
    </div>
  );
}
