"use client";

// ふるさと納税 上限額シミュレータの本体（クライアントコンポーネント）。
// 設計方針: 「年収だけ」で即結果。配偶者・扶養・年齢は任意の詳細設定に折りたたむ。
// 計算はすべてブラウザ側で完結（SSG・サーバー処理なし・入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateFurusato } from "@/lib/furusato/calculate";
import { yen, manYen, percent } from "@/lib/format";
import { DonutChart, type DonutSegment } from "./DonutChart";

const COLORS = {
  incomeTax: "#f59e0b", // amber-500 … 所得税からの控除
  residentBasic: "#3b82f6", // blue-500 … 住民税 基本分
  residentSpecial: "#8b5cf6", // violet-500 … 住民税 特例分
  selfPay: "#94a3b8", // slate-400 … 自己負担2,000円
};

export function FurusatoCalculator() {
  const [annualIncome, setAnnualIncome] = useState(5_000_000);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [dependents, setDependents] = useState(0);
  const [age, setAge] = useState(30);
  const [showDetails, setShowDetails] = useState(false);

  const result = useMemo(
    () =>
      calculateFurusato({
        annualIncome,
        age,
        hasSpouse,
        dependents,
      }),
    [annualIncome, age, hasSpouse, dependents],
  );

  const b = result.breakdown;
  const hasBenefit = result.limit > 0;

  const donutSegments: DonutSegment[] = [
    { label: "所得税からの控除（還付）", value: b.incomeTaxDeduction, color: COLORS.incomeTax },
    { label: "住民税 基本分", value: b.residentBasicDeduction, color: COLORS.residentBasic },
    { label: "住民税 特例分", value: b.residentSpecialDeduction, color: COLORS.residentSpecial },
    { label: "自己負担", value: b.selfPay, color: COLORS.selfPay },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力フォーム ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-slate-900">年収を入れるだけ</h2>
        <p className="mb-4 text-xs text-slate-400">
          まずは額面年収だけでOK。右に上限額の目安がすぐ出ます。
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
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
            className="mt-3 w-full accent-rose-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-rose-700">
            {manYen(annualIncome)}
          </div>
        </label>

        {/* 配偶者（上限額に大きく効くのでトップ階層に出す） */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">配偶者</span>
          <select
            value={hasSpouse ? "1" : "0"}
            onChange={(e) => setHasSpouse(e.target.value === "1")}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
          >
            <option value="0">いない／共働き（配偶者控除なし）</option>
            <option value="1">いる（配偶者控除の対象・専業主婦/主夫など）</option>
          </select>
          <p className="mt-1 text-xs text-slate-400">
            配偶者控除があると課税所得が下がり、上限額も下がります。
          </p>
        </label>

        {/* 詳細設定（任意・折りたたみ） */}
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="mt-5 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          aria-expanded={showDetails}
        >
          <span>詳細設定（扶養・年齢）</span>
          <span className="text-slate-400">{showDetails ? "閉じる ▲" : "開く ▼"}</span>
        </button>

        {showDetails && (
          <div className="mt-4 space-y-5 border-t border-slate-100 pt-4">
            {/* 扶養人数 */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                扶養人数（16歳以上・配偶者を除く）
              </span>
              <select
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}人
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-400">
                16歳未満の子どもは控除対象外のため、ここには含めません。
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
                  className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                />
                <span className="text-slate-500">歳</span>
                {age >= 40 && age <= 64 && (
                  <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                    介護保険料あり
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                40〜64歳は介護保険料の分だけ課税所得が下がります。
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

        {hasBenefit ? (
          <>
            {/* 大きな上限額表示 */}
            <div className="mb-5 rounded-xl bg-rose-50 p-4 text-center">
              <div className="text-sm text-rose-800">寄付上限額の目安（全額控除）</div>
              <div className="text-3xl font-extrabold text-rose-700 tabular-nums">
                {yen(result.limit)}
              </div>
              <p className="mt-2 text-xs leading-5 text-rose-700/80">
                この金額まで寄付すると、自己負担は実質
                <strong>2,000円</strong>で済みます（差額の{" "}
                <strong>{yen(b.totalDeduction)}</strong> が所得税・住民税から控除）。
              </p>
            </div>

            {/* ドーナツ（控除の内訳） */}
            <DonutChart
              segments={donutSegments}
              centerLabel="寄付額"
              centerValue={manYen(result.limit)}
            />

            {/* 内訳表 */}
            <table className="mt-6 w-full border-collapse text-sm">
              <tbody>
                <Row label="寄付額（上限の目安）" value={b.donation} bold />
                <Row
                  label="所得税からの控除（還付）"
                  value={b.incomeTaxDeduction}
                  color={COLORS.incomeTax}
                />
                <Row
                  label="住民税 基本分の控除"
                  value={b.residentBasicDeduction}
                  color={COLORS.residentBasic}
                />
                <Row
                  label="住民税 特例分の控除"
                  value={b.residentSpecialDeduction}
                  color={COLORS.residentSpecial}
                />
                <Row label="自己負担" value={b.selfPay} color={COLORS.selfPay} />
                <tr className="border-t-2 border-slate-300">
                  <td className="py-2 font-bold text-rose-700">控除される合計</td>
                  <td className="py-2 text-right text-base font-bold text-rose-700 tabular-nums">
                    {yen(b.totalDeduction)}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
              計算の前提：所得税の限界税率{" "}
              <strong>{percent(result.marginalIncomeTaxRate, 0)}</strong>、
              住民税の所得割額 <strong>{yen(result.residentTaxIncomeLevy)}</strong>
              （特例分はこの20%＝{yen(Math.round(result.residentTaxIncomeLevy * 0.2))}が上限）。
            </p>
          </>
        ) : (
          <div className="rounded-xl bg-slate-50 p-5 text-center text-sm leading-6 text-slate-600">
            この条件では<strong>住民税の所得割が生じない</strong>ため、
            ふるさと納税による控除のメリットがほとんどありません。
            <br />
            年収や家族構成を調整してお試しください。
          </div>
        )}

        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールの結果は<strong>概算（目安）</strong>です。実際の上限額は、
          住宅ローン控除・医療費控除・iDeCo・生命保険料控除など他の控除や、
          ふるさと納税以外の寄付金、お住まいの自治体の料率により変動します。
          上限額ぎりぎりを狙う場合は、源泉徴収票をもとに各自治体や寄付サイトの
          正式なシミュレーションでご確認ください。
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
        {yen(value)}
      </td>
    </tr>
  );
}
