"use client";

// ライフプラン表（生涯キャッシュフロー）本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useEffect, useMemo, useState } from "react";
import { calculateLifePlan } from "@/lib/lifeplan/calculate";
import type { LifeEvent } from "@/lib/lifeplan/types";
import { yen, manYen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

function Num({
  label,
  value,
  onChange,
  step = 100_000,
  suffix = "円",
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  suffix?: string;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        {suffix === "円" ? (
          <MoneyInput
            value={value}
            onChange={onChange}
            max={max}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          />
        ) : (
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          />
        )}
        <span className="shrink-0 text-slate-500">{suffix}</span>
      </div>
    </label>
  );
}

export function LifePlanCalculator() {
  const [currentAge, setCurrentAge] = useState(40);
  const [retireAge, setRetireAge] = useState(65);
  const [untilAge, setUntilAge] = useState(95);
  const [annualIncome, setAnnualIncome] = useState(4_800_000);
  const [incomeGrowth, setIncomeGrowth] = useState("1");
  const [pensionAnnual, setPensionAnnual] = useState(2_000_000);
  const [annualExpense, setAnnualExpense] = useState(3_600_000);
  const [retireExpense, setRetireExpense] = useState(3_000_000);
  const [inflation, setInflation] = useState("0.5");
  const [currentSavings, setCurrentSavings] = useState(5_000_000);
  const [savingRate, setSavingRate] = useState("2");
  const [events, setEvents] = useState<LifeEvent[]>([{ age: 45, amount: 3_000_000, label: "" }]);
  // 西暦はマウント後に取得（SSRとのハイドレーション不一致を避ける）。既定は当年。
  const [baseYear, setBaseYear] = useState(2026);
  useEffect(() => setBaseYear(new Date().getFullYear()), []);

  useSharedParams((get) => {
    applyNumber(get, "ca", setCurrentAge);
    applyNumber(get, "ra", setRetireAge);
    applyNumber(get, "ua", setUntilAge);
    applyNumber(get, "inc", setAnnualIncome);
    applyNumber(get, "pen", setPensionAnnual);
    applyNumber(get, "exp", setAnnualExpense);
    applyNumber(get, "rexp", setRetireExpense);
    applyNumber(get, "sav", setCurrentSavings);
    const g = get("growth");
    if (g != null && Number.isFinite(Number(g))) setIncomeGrowth(g);
    const inf = get("infl");
    if (inf != null && Number.isFinite(Number(inf))) setInflation(inf);
    const rt = get("rate");
    if (rt != null && Number.isFinite(Number(rt))) setSavingRate(rt);
  });

  const shareParams = {
    ca: currentAge,
    ra: retireAge,
    ua: untilAge,
    inc: annualIncome,
    growth: incomeGrowth,
    pen: pensionAnnual,
    exp: annualExpense,
    rexp: retireExpense,
    infl: inflation,
    sav: currentSavings,
    rate: savingRate,
  };

  const result = useMemo(
    () =>
      calculateLifePlan({
        currentAge,
        untilAge,
        retireAge,
        currentYear: baseYear,
        annualIncome,
        incomeGrowthPercent: Number(incomeGrowth) || 0,
        pensionAnnual,
        annualExpense,
        retireExpense,
        expenseInflationPercent: Number(inflation) || 0,
        currentSavings,
        savingRatePercent: Number(savingRate) || 0,
        events,
      }),
    [currentAge, untilAge, retireAge, annualIncome, incomeGrowth, pensionAnnual, annualExpense, retireExpense, inflation, currentSavings, savingRate, events],
  );

  const updateEvent = (i: number, patch: Partial<LifeEvent>) =>
    setEvents((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const addEvent = () => setEvents((prev) => [...prev, { age: currentAge + 5, amount: 1_000_000, label: "" }]);
  const removeEvent = (i: number) => setEvents((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">前提条件を入力</h2>

        <div className="space-y-5">
          {/* 年齢 */}
          <div className="grid grid-cols-3 gap-3">
            <Num label="現在の年齢" value={currentAge} onChange={setCurrentAge} step={1} suffix="歳" />
            <Num label="退職する年齢" value={retireAge} onChange={setRetireAge} step={1} suffix="歳" />
            <Num label="何歳まで" value={untilAge} onChange={setUntilAge} step={1} suffix="歳" />
          </div>

          {/* 収入 */}
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="mb-2 text-xs font-semibold text-slate-500">収入</div>
            <div className="grid grid-cols-2 gap-3">
              <Num label="現役の年間手取り" value={annualIncome} onChange={setAnnualIncome} />
              <label className="block">
                <span className="text-sm font-medium text-slate-700">昇給率</span>
                <div className="mt-1 flex items-center gap-2">
                  <input type="number" inputMode="decimal" min={-10} max={20} step={0.5} value={incomeGrowth}
                    onChange={(e) => setIncomeGrowth(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
                  <span className="text-slate-500">％</span>
                </div>
              </label>
            </div>
            <div className="mt-3">
              <Num label="退職後の年間収入（年金など）" value={pensionAnnual} onChange={setPensionAnnual} />
            </div>
          </div>

          {/* 支出 */}
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="mb-2 text-xs font-semibold text-slate-500">支出</div>
            <div className="grid grid-cols-2 gap-3">
              <Num label="現役の年間支出" value={annualExpense} onChange={setAnnualExpense} />
              <Num label="退職後の年間支出" value={retireExpense} onChange={setRetireExpense} />
            </div>
            <label className="mt-3 block">
              <span className="text-sm font-medium text-slate-700">インフレ率（支出の上昇）</span>
              <div className="mt-1 flex items-center gap-2">
                <input type="number" inputMode="decimal" min={0} max={20} step={0.5} value={inflation}
                  onChange={(e) => setInflation(e.target.value)}
                  className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
                <span className="text-slate-500">％</span>
              </div>
            </label>
          </div>

          {/* 資産 */}
          <div className="grid grid-cols-2 gap-3">
            <Num label="現在の貯蓄額" value={currentSavings} onChange={setCurrentSavings} />
            <label className="block">
              <span className="text-sm font-medium text-slate-700">運用利回り</span>
              <div className="mt-1 flex items-center gap-2">
                <input type="number" inputMode="decimal" min={0} max={20} step={0.5} value={savingRate}
                  onChange={(e) => setSavingRate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
                <span className="text-slate-500">％</span>
              </div>
            </label>
          </div>

          {/* ライフイベント */}
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">大型支出（住宅・車・教育など）</span>
              <button type="button" onClick={addEvent} className="text-xs font-semibold text-emerald-700 hover:underline">
                ＋ 追加
              </button>
            </div>
            <div className="space-y-2">
              {events.length === 0 && (
                <p className="text-xs text-slate-400">「＋追加」で、特定の年齢にかかる一時的な大きな支出を加えられます。</p>
              )}
              {events.map((ev, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="number" min={currentAge} max={untilAge} value={ev.age}
                    onChange={(e) => updateEvent(i, { age: Number(e.target.value) })}
                    className="w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-right text-sm tabular-nums focus:border-emerald-500 focus:outline-none" />
                  <span className="text-xs text-slate-500">歳</span>
                  <MoneyInput
                    value={ev.amount}
                    onChange={(v) => updateEvent(i, { amount: v })}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-right text-sm tabular-nums focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500">円</span>
                  <button type="button" onClick={() => removeEvent(i)} className="text-slate-400 hover:text-red-500" aria-label="削除">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">生涯のお金の流れ</h2>
          <ShareButton params={shareParams} />
        </div>

        {/* 結論 */}
        {result.depletionAge !== null ? (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-center">
            <div className="text-sm text-red-800">このままだと貯蓄が底をつくのは</div>
            <div className="text-3xl font-extrabold text-red-600 tabular-nums">{result.depletionAge}歳</div>
            <p className="mt-1 text-xs leading-5 text-red-700/80">
              収入を増やす・支出を抑える・運用するなどで改善できます。前提を変えて試してみましょう。
            </p>
          </div>
        ) : (
          <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
            <div className="text-sm text-emerald-800">{untilAge}歳時点の貯蓄残高（試算）</div>
            <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.finalBalance)}</div>
            <p className="mt-1 text-xs text-emerald-700/80">
              想定寿命まで貯蓄は枯渇しない見込みです（ピーク {manYen(result.peakBalance)}）。
            </p>
          </div>
        )}

        {/* 残高推移チャート */}
        <BalanceChart rows={result.rows} retireAge={retireAge} />

        {/* キャッシュフロー表 */}
        <div className="mt-5">
          <div className="mb-2 text-sm font-medium text-slate-700">年ごとのキャッシュフロー</div>
          <div className="max-h-72 overflow-auto rounded-lg border border-slate-200">
            <table className="w-full border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-2 py-1.5 text-left font-medium">年齢</th>
                  <th className="px-2 py-1.5 text-right font-medium">収入</th>
                  <th className="px-2 py-1.5 text-right font-medium">支出</th>
                  <th className="px-2 py-1.5 text-right font-medium">収支</th>
                  <th className="px-2 py-1.5 text-right font-medium">残高</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr
                    key={row.age}
                    className={`border-t border-slate-100 ${row.age === retireAge ? "bg-amber-50" : ""}`}
                  >
                    <td className="px-2 py-1 text-slate-600">
                      {row.age}歳<span className="ml-1 text-slate-300">{row.year}</span>
                    </td>
                    <td className="px-2 py-1 text-right tabular-nums text-slate-600">{manYen(row.income)}</td>
                    <td className="px-2 py-1 text-right tabular-nums text-slate-600">{manYen(row.expense)}</td>
                    <td className={`px-2 py-1 text-right tabular-nums ${row.net < 0 ? "text-red-500" : "text-emerald-600"}`}>
                      {row.net < 0 ? `−${manYen(-row.net)}` : `+${manYen(row.net)}`}
                    </td>
                    <td className={`px-2 py-1 text-right font-semibold tabular-nums ${row.balance < 0 ? "text-red-600" : "text-slate-800"}`}>
                      {row.balance < 0 ? `−${manYen(-row.balance)}` : manYen(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは入力した前提が将来も続くと仮定した<strong>概算</strong>です。収入・支出・インフレ・運用成績は
          実際には変動します（元本割れの可能性もあります）。手取り収入は<a href="/tedori" className="underline">年収手取り計算機</a>、
          年金収入は<a href="/nenkin-mikomi" className="underline">年金見込み額</a>で見積もると精度が上がります。
        </p>
      </section>
    </div>
  );
}

// 貯蓄残高の推移チャート（依存なしの純粋SVG）。0ラインと退職時点を示す。
function BalanceChart({
  rows,
  retireAge,
}: {
  rows: { age: number; balance: number }[];
  retireAge: number;
}) {
  if (rows.length < 2) return null;
  const W = 320;
  const H = 130;
  const pad = 4;
  const ages = rows.map((r) => r.age);
  const minAge = ages[0];
  const maxAge = ages[ages.length - 1];
  const balances = rows.map((r) => r.balance);
  const maxBal = Math.max(...balances, 0);
  const minBal = Math.min(...balances, 0);
  const range = maxBal - minBal || 1;

  const xs = (age: number) => pad + ((age - minAge) / (maxAge - minAge)) * (W - pad * 2);
  const ys = (bal: number) => H - pad - ((bal - minBal) / range) * (H - pad * 2);

  const line = rows.map((r) => `${xs(r.age)},${ys(r.balance)}`).join(" ");
  const area = `${xs(minAge)},${ys(minBal)} ${line} ${xs(maxAge)},${ys(minBal)}`;
  const zeroY = ys(0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="貯蓄残高の推移">
      <polygon points={area} fill="#10b98122" />
      {/* 0ライン */}
      <line x1={pad} y1={zeroY} x2={W - pad} y2={zeroY} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
      {/* 退職ライン */}
      {retireAge > minAge && retireAge < maxAge && (
        <line x1={xs(retireAge)} y1={pad} x2={xs(retireAge)} y2={H - pad} stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" />
      )}
      <polyline points={line} fill="none" stroke="#10b981" strokeWidth={2} />
      <text x={pad} y={H - 6} className="fill-slate-400" style={{ fontSize: 9 }}>{minAge}歳</text>
      <text x={W - pad} y={H - 6} textAnchor="end" className="fill-slate-400" style={{ fontSize: 9 }}>{maxAge}歳</text>
      {retireAge > minAge && retireAge < maxAge && (
        <text x={xs(retireAge)} y={pad + 8} textAnchor="middle" className="fill-amber-500" style={{ fontSize: 8 }}>退職</text>
      )}
    </svg>
  );
}
