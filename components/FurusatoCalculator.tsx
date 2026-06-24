"use client";

// ふるさと納税 上限額シミュレータの本体（クライアントコンポーネント）。
// 設計方針: 「年収だけ」で即結果。配偶者・扶養・年齢は任意の詳細設定に折りたたむ。
// 計算はすべてブラウザ側で完結（SSG・サーバー処理なし・入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateFurusato } from "@/lib/furusato/calculate";
import { yen, manYen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { DonutChart, type DonutSegment } from "./DonutChart";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";
import { FurusatoCTA } from "./FurusatoCTA";

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
  // 入力モード（かんたん＝年収＋家族構成 / くわしく＝社会保険料・他の控除も）
  const [mode, setMode] = useState<"simple" | "detail">("simple");
  // 詳細モードの入力
  const [useManualSocial, setUseManualSocial] = useState(false);
  const [manualSocial, setManualSocial] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  useSharedParams((get) => {
    applyNumber(get, "income", setAnnualIncome);
    applyNumber(get, "dep", setDependents);
    applyNumber(get, "age", setAge);
    applyNumber(get, "other", setOtherDeductions);
    const sp = get("spouse");
    if (sp != null) setHasSpouse(sp === "1");
    const social = get("social");
    if (social != null) {
      setUseManualSocial(true);
      setManualSocial(Number(social) || 0);
    }
    // 詳細項目が共有されていたら、くわしくモードを開く
    if (get("age") || get("other") || social != null) setMode("detail");
  });

  const shareParams = {
    income: annualIncome,
    spouse: hasSpouse ? 1 : 0,
    dep: dependents,
    age,
    other: otherDeductions,
    ...(useManualSocial ? { social: manualSocial } : {}),
  };

  const result = useMemo(
    () =>
      calculateFurusato({
        annualIncome,
        age,
        hasSpouse,
        dependents,
        otherDeductions: mode === "detail" ? otherDeductions : 0,
        socialInsuranceOverride:
          mode === "detail" && useManualSocial ? manualSocial : undefined,
      }),
    [annualIncome, age, hasSpouse, dependents, mode, otherDeductions, useManualSocial, manualSocial],
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
    <>
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力フォーム ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">条件を入力</h2>
          {/* かんたん / くわしく の2モード切替 */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("simple")}
              aria-pressed={mode === "simple"}
              className={`rounded-md px-3 py-1.5 transition ${
                mode === "simple"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              かんたん
            </button>
            <button
              type="button"
              onClick={() => setMode("detail")}
              aria-pressed={mode === "detail"}
              className={`rounded-md px-3 py-1.5 transition ${
                mode === "detail"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              くわしく
            </button>
          </div>
        </div>
        <p className="mb-4 text-xs text-slate-400">
          {mode === "simple"
            ? "年収と家族構成だけで上限額の目安がすぐ出ます。"
            : "社会保険料や医療費控除・iDeCoなども入れると精度が上がります。"}
        </p>

        {/* 年収（主役） */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            額面年収（賞与込み）
          </span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={annualIncome} onChange={setAnnualIncome} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none" />
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

        {/* 扶養人数（家族構成・かんたんモードでも表示） */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">
            扶養している家族（16歳以上・配偶者を除く）
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

        {/* ===== くわしくモードの追加入力 ===== */}
        {mode === "detail" && (
          <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
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

            {/* 社会保険料（手入力で上書き） */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useManualSocial}
                  onChange={(e) => {
                    if (e.target.checked && manualSocial === 0) {
                      setManualSocial(result.socialInsuranceAuto);
                    }
                    setUseManualSocial(e.target.checked);
                  }}
                  className="h-4 w-4 rounded border-slate-300 accent-rose-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  社会保険料を手入力する
                </span>
              </label>
              {useManualSocial ? (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <MoneyInput
                      value={manualSocial}
                      onChange={setManualSocial}
                      max={5_000_000}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                    />
                    <span className="shrink-0 text-slate-500">円/年</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    源泉徴収票の「社会保険料等の金額」を入れると精度が上がります。
                  </p>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-400">
                  自動推計：約 {yen(result.socialInsuranceAuto)}（年収・年齢から算出）
                </p>
              )}
            </div>

            {/* その他の所得控除 */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                その他の所得控除（任意）
              </span>
              <div className="mt-1 flex items-center gap-2">
                <MoneyInput
                  value={otherDeductions}
                  onChange={setOtherDeductions}
                  max={20_000_000}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                />
                <span className="shrink-0 text-slate-500">円</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                医療費控除・iDeCo（小規模企業共済等掛金控除）・生命保険料控除など、
                基礎・扶養・社会保険料以外の控除の合計。多いほど上限額は下がります。
              </p>
            </label>

            {/* 住宅ローン控除の注意（税額控除のため別扱い） */}
            <div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              <strong>住宅ローン控除がある方へ：</strong>
              住宅ローン控除は「税額控除」で、上の所得控除とは仕組みが異なります。
              所得税が大きく減っていると、ワンストップ特例なら影響は出にくい一方、
              確定申告では上限が下がる場合があります。正確な額は確定申告または各自治体・
              寄付サイトの公式シミュレーションでご確認ください。
            </div>
          </div>
        )}
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>
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
    {/* 寄付先サイトへの送客枠（提携後に表示・上限額を動的反映） */}
    {hasBenefit && <FurusatoCTA amount={result.limit} />}
    </>
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
