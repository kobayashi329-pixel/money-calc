"use client";

// 固定資産税・都市計画税 計算機 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateKotei } from "@/lib/kotei/calculate";
import { yen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const moneyClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function KoteiCalculator() {
  const [landValue, setLandValue] = useState(12_000_000);
  const [landAreaSqm, setLandAreaSqm] = useState(150);
  const [buildingValue, setBuildingValue] = useState(8_000_000);
  const [isResidential, setIsResidential] = useState(true);
  const [cityPlanningArea, setCityPlanningArea] = useState(true);
  const [newBuildingReduction, setNewBuildingReduction] = useState(false);

  useSharedParams((get) => {
    applyNumber(get, "land", setLandValue);
    applyNumber(get, "area", setLandAreaSqm);
    applyNumber(get, "bldg", setBuildingValue);
    if (get("res") != null) setIsResidential(get("res") === "1");
    if (get("city") != null) setCityPlanningArea(get("city") === "1");
    if (get("new") === "1") setNewBuildingReduction(true);
  });

  const shareParams = {
    land: landValue,
    area: landAreaSqm,
    bldg: buildingValue,
    res: isResidential ? 1 : 0,
    city: cityPlanningArea ? 1 : 0,
    new: newBuildingReduction ? 1 : 0,
  };

  const result = useMemo(
    () =>
      calculateKotei({
        landValue,
        landAreaSqm,
        buildingValue,
        isResidential,
        cityPlanningArea,
        newBuildingReduction,
      }),
    [landValue, landAreaSqm, buildingValue, isResidential, cityPlanningArea, newBuildingReduction],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-slate-900">評価額と条件を入力</h2>
        <p className="mb-4 text-xs text-slate-400">
          「固定資産税評価額」は、毎年届く課税明細書（納税通知書）で確認できます。
        </p>

        {/* 土地の評価額 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">土地の固定資産税評価額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={landValue} onChange={setLandValue} max={1_000_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
        </label>

        {/* 土地の面積 */}
        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">土地の面積</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={landAreaSqm}
              onChange={(e) => setLandAreaSqm(Math.max(0, Number(e.target.value)))}
              className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="text-slate-500">㎡</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            住宅用地は200㎡以下の部分が「小規模住宅用地」として軽減されます。
          </p>
        </label>

        {/* 建物の評価額 */}
        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">建物の固定資産税評価額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={buildingValue} onChange={setBuildingValue} max={1_000_000_000} className={moneyClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
        </label>

        {/* オプション */}
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <label className="flex items-start gap-2">
            <input type="checkbox" checked={isResidential} onChange={(e) => setIsResidential(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-500" />
            <span className="text-sm">
              <span className="font-medium text-slate-700">住宅が建っている土地（住宅用地）</span>
              <span className="mt-0.5 block text-xs text-slate-400">土地の課税標準が1/6〜1/3に軽減されます。</span>
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" checked={cityPlanningArea} onChange={(e) => setCityPlanningArea(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-500" />
            <span className="text-sm">
              <span className="font-medium text-slate-700">市街化区域（都市計画税がかかる）</span>
              <span className="mt-0.5 block text-xs text-slate-400">都市計画税（0.3%）を加算します。</span>
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" checked={newBuildingReduction} onChange={(e) => setNewBuildingReduction(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-500" />
            <span className="text-sm">
              <span className="font-medium text-slate-700">新築住宅の軽減を適用</span>
              <span className="mt-0.5 block text-xs text-slate-400">新築後一定期間、建物の固定資産税が1/2に軽減されます（要件あり）。</span>
            </span>
          </label>
        </div>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">年税額の合計（目安）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.total)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">
            固定資産税 {yen(result.fixedTaxTotal)}
            {cityPlanningArea && <> ＋ 都市計画税 {yen(result.cityTaxTotal)}</>}
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">固定資産税（土地）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.landFixedTax)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">固定資産税（建物）</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.buildingFixedTax)}</td>
            </tr>
            {cityPlanningArea && (
              <>
                <tr className="border-t border-slate-100">
                  <td className="py-2 text-slate-700">都市計画税（土地）</td>
                  <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.landCityTax)}</td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-2 text-slate-700">都市計画税（建物）</td>
                  <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.buildingCityTax)}</td>
                </tr>
              </>
            )}
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">年税額の合計</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.total)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは標準税率（固定資産税1.4%・都市計画税0.3%）に基づく概算です。負担調整措置、
          自治体ごとの税率の違い、各種減額・特例の細かな要件は反映していません。正確な税額は
          課税明細書（納税通知書）や市区町村の窓口でご確認ください。
        </p>
      </section>
    </div>
  );
}
