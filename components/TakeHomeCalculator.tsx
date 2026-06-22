"use client";

// 年収手取り計算機の本体（クライアントコンポーネント）。
// 設計方針: 「年収だけ」で即結果。年齢・扶養・前年収入は任意の詳細設定に折りたたむ。
// 計算はすべてブラウザ側で完結（SSG・サーバー処理なし・入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateTakeHome } from "@/lib/takehome/calculate";
import type { TakeHomeInput } from "@/lib/takehome/types";
import { PREFECTURES, DEFAULT_PREFECTURE_CODE } from "@/lib/takehome/prefectures-2025";
import { yen, manYen, percent } from "@/lib/format";
import { DonutChart, type DonutSegment } from "./DonutChart";

const COLORS = {
  takeHome: "#10b981", // emerald-500
  social: "#3b82f6", // blue-500
  incomeTax: "#f59e0b", // amber-500
  residentTax: "#ef4444", // red-500
};

export function TakeHomeCalculator() {
  const [annualIncome, setAnnualIncome] = useState(5_000_000);
  const [age, setAge] = useState(30);
  const [dependents, setDependents] = useState(0);
  const [prefecture, setPrefecture] = useState(DEFAULT_PREFECTURE_CODE);
  const [insuranceType] = useState<TakeHomeInput["insuranceType"]>("kenkohoken");
  // 前年収入は空文字＝「当年と同じ」。数値が入ったときだけ住民税に反映。
  const [priorIncomeStr, setPriorIncomeStr] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const priorYearIncome = priorIncomeStr.trim() === "" ? undefined : Number(priorIncomeStr);

  const result = useMemo(
    () =>
      calculateTakeHome({
        annualIncome,
        age,
        dependents,
        prefecture,
        insuranceType,
        priorYearIncome,
      }),
    [annualIncome, age, dependents, prefecture, insuranceType, priorYearIncome],
  );

  const usesPriorYear =
    priorYearIncome != null &&
    priorYearIncome > 0 &&
    result.residentTaxBasisIncome !== annualIncome;

  const donutSegments: DonutSegment[] = [
    { label: "手取り", value: result.takeHomeAnnual, color: COLORS.takeHome },
    { label: "社会保険料", value: result.socialInsurance.total, color: COLORS.social },
    { label: "所得税", value: result.incomeTax.total, color: COLORS.incomeTax },
    { label: "住民税", value: result.residentTax.total, color: COLORS.residentTax },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力フォーム ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-slate-900">
          年収を入れるだけ
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          まずは額面年収だけでOK。右に手取りがすぐ出ます。
        </p>

        {/* 年収（主役） */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            額面年収（賞与込み）
          </span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100_000}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
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

        {/* 詳細設定（任意・折りたたみ） */}
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="mt-5 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          aria-expanded={showDetails}
        >
          <span>詳細設定（年齢・扶養・前年収入）</span>
          <span className="text-slate-400">{showDetails ? "閉じる ▲" : "開く ▼"}</span>
        </button>

        {showDetails && (
          <div className="mt-4 space-y-5 border-t border-slate-100 pt-4">
            {/* 都道府県（健康保険料率） */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                お住まいの都道府県（健康保険料率）
              </span>
              <select
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              >
                {PREFECTURES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}（健保 {p.healthRateTotal}%）
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-400">
                協会けんぽの健康保険料率は都道府県ごとに異なります（令和7年度）。
              </p>
            </label>

            {/* 年齢 */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">年齢</span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={18}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Math.max(0, Number(e.target.value)))}
                  className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                />
                <span className="text-slate-500">歳</span>
                {age >= 40 && age <= 64 && (
                  <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                    介護保険料あり
                  </span>
                )}
              </div>
            </label>

            {/* 扶養人数 */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                扶養人数（16歳以上の一般扶養）
              </span>
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

            {/* 前年の年収（住民税の精度向上） */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                前年の年収（住民税を正確にする・任意）
              </span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={100_000}
                  placeholder="未入力＝今年と同じ"
                  value={priorIncomeStr}
                  onChange={(e) => setPriorIncomeStr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                />
                <span className="shrink-0 text-slate-500">円</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                住民税は前年の所得に課税されます。昨年と収入が大きく違う方はこちらを入力すると正確になります。
              </p>
            </label>

            {/* 社会保険の種類 */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">社会保険の種類</span>
              <select
                value={insuranceType}
                disabled
                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-700"
              >
                <option value="kenkohoken">
                  会社員（協会けんぽ＋厚生年金＋雇用保険）
                </option>
              </select>
              <p className="mt-1 text-xs text-slate-400">
                ※ 国民健康保険・国民年金（自営業）版は今後追加予定です。
              </p>
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

        {/* 大きな手取り表示 */}
        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">手取り年収（概算）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {yen(result.takeHomeAnnual)}
          </div>
          <div className="mt-1 text-sm text-emerald-800">
            月あたり約 <strong>{yen(result.takeHomeMonthly)}</strong> ／ 手取り率{" "}
            <strong>{percent(result.takeHomeRate)}</strong>
          </div>
        </div>

        {/* ドーナツグラフ */}
        <DonutChart
          segments={donutSegments}
          centerLabel="手取り率"
          centerValue={percent(result.takeHomeRate, 0)}
        />

        {/* 内訳表 */}
        <table className="mt-6 w-full border-collapse text-sm">
          <tbody>
            <Row label="額面年収" value={result.annualIncome} bold />
            <Row
              label="社会保険料"
              value={-result.socialInsurance.total}
              color={COLORS.social}
            />
            <SubRow label="　健康保険料" value={result.socialInsurance.health} />
            {result.socialInsurance.longTermCare > 0 && (
              <SubRow label="　介護保険料" value={result.socialInsurance.longTermCare} />
            )}
            <SubRow label="　厚生年金保険料" value={result.socialInsurance.pension} />
            <SubRow label="　雇用保険料" value={result.socialInsurance.employment} />
            <Row
              label="所得税（復興特別所得税込）"
              value={-result.incomeTax.total}
              color={COLORS.incomeTax}
            />
            <Row
              label="住民税"
              value={-result.residentTax.total}
              color={COLORS.residentTax}
            />
            <SubRow label="　所得割" value={result.residentTax.incomeLevy} />
            <SubRow label="　均等割" value={result.residentTax.perCapitaLevy} />
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">手取り年収</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">
                {yen(result.takeHomeAnnual)}
              </td>
            </tr>
          </tbody>
        </table>

        {usesPriorYear && (
          <p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-800">
            🧮 住民税は<strong>前年の年収 {manYen(result.residentTaxBasisIncome)}</strong>
            をもとに計算しています（住民税は前年所得への課税のため）。
          </p>
        )}

        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールの計算結果は<strong>概算</strong>です。実際の額は、お住まいの自治体の料率、
          標準報酬月額の等級、各種控除（配偶者・特定扶養・生命保険料控除など）により変動します。
          正確な額は専門家や公的機関でご確認ください。
        </p>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  color,
}: {
  label: string;
  value: number;
  bold?: boolean;
  color?: string;
}) {
  return (
    <tr className="border-t border-slate-100">
      <td className={`py-2 ${bold ? "font-bold text-slate-900" : "text-slate-700"}`}>
        <span className="flex items-center gap-2">
          {color && (
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: color }}
            />
          )}
          {label}
        </span>
      </td>
      <td
        className={`py-2 text-right tabular-nums ${
          bold ? "font-bold text-slate-900" : "text-slate-700"
        }`}
      >
        {value < 0 ? `−${yen(-value)}` : yen(value)}
      </td>
    </tr>
  );
}

function SubRow({ label, value }: { label: string; value: number }) {
  return (
    <tr>
      <td className="py-1 pl-2 text-xs text-slate-500">{label}</td>
      <td className="py-1 text-right text-xs tabular-nums text-slate-500">
        {yen(value)}
      </td>
    </tr>
  );
}
