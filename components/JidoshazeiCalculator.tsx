"use client";

// 自動車税（種別割）計算機 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import {
  calculateJidoshazei,
  NORMAL_BANDS,
  type CarType,
  type RegistrationEra,
} from "@/lib/jidoshazei/calculate";
import { yen } from "@/lib/format";
import { ShareButton, useSharedParams } from "./ShareButton";

// 排気量区分のセレクト用（value=区分判定に使う代表cc, label=表示）
const BAND_OPTIONS = NORMAL_BANDS.map((b) => ({
  value: Number.isFinite(b.maxCc) ? b.maxCc : 6001,
  label: b.label,
}));

export function JidoshazeiCalculator() {
  const [carType, setCarType] = useState<CarType>("normal");
  const [ccValue, setCcValue] = useState(2000); // 1,500cc超〜2,000cc以下
  const [era, setEra] = useState<RegistrationEra>("new");
  const [heavyTax, setHeavyTax] = useState(false);

  useSharedParams((get) => {
    const t = get("type");
    if (t === "normal" || t === "kei") setCarType(t);
    const cc = get("cc");
    if (cc != null) setCcValue(Number(cc) || 2000);
    const e = get("era");
    if (e === "new" || e === "old") setEra(e);
    if (get("heavy") === "1") setHeavyTax(true);
  });

  const shareParams = {
    type: carType,
    cc: ccValue,
    era,
    heavy: heavyTax ? 1 : 0,
  };

  const result = useMemo(
    () =>
      calculateJidoshazei({
        carType,
        displacementCc: ccValue,
        era,
        heavyTax,
      }),
    [carType, ccValue, era, heavyTax],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">車の条件を入力</h2>

        {/* 種別 */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          {(
            [
              ["normal", "普通自動車", "自家用乗用車"],
              ["kei", "軽自動車", "自家用乗用・定額"],
            ] as const
          ).map(([val, label, desc]) => (
            <button
              key={val}
              type="button"
              onClick={() => setCarType(val)}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${
                carType === val
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="block font-semibold">{label}</span>
              <span className="block text-xs text-slate-400">{desc}</span>
            </button>
          ))}
        </div>

        {/* 排気量（普通車のみ） */}
        {carType === "normal" && (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">総排気量</span>
            <select
              value={ccValue}
              onChange={(e) => setCcValue(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            >
              {BAND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              車検証の「総排気量又は定格出力」で確認できます。
            </p>
          </label>
        )}

        {/* 初度登録（普通車のみ・新旧税率） */}
        {carType === "normal" && (
          <div className="mt-5">
            <span className="text-sm font-medium text-slate-700">初度登録の時期</span>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {(
                [
                  ["new", "2019年10月以降", "引き下げ後の新税率"],
                  ["old", "2019年9月以前", "従来の税率"],
                ] as const
              ).map(([val, label, desc]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setEra(val)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm ${
                    era === val
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-xs text-slate-400">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 経年重課 */}
        <label className="mt-5 flex items-start gap-2">
          <input
            type="checkbox"
            checked={heavyTax}
            onChange={(e) => setHeavyTax(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-500"
          />
          <span className="text-sm">
            <span className="font-medium text-slate-700">13年超の重課を適用</span>
            <span className="mt-0.5 block text-xs text-slate-400">
              新規登録から13年超のガソリン車・LPG車（ディーゼル車は11年超）は約15%重課。
              EV・ハイブリッド車などは対象外です。
            </span>
          </span>
        </label>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">自動車税（種別割）の年税額</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {yen(result.annualTax)}
          </div>
          <div className="mt-1 text-xs text-emerald-700/80">{result.bandLabel}</div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">標準の年税額</td>
              <td className="py-2 text-right font-semibold tabular-nums text-slate-900">
                {yen(result.baseTax)}
              </td>
            </tr>
            {result.heavyTaxApplied && (
              <tr className="border-t border-slate-100">
                <td className="py-2 text-slate-700">13年超の重課込み</td>
                <td className="py-2 text-right font-semibold tabular-nums text-amber-600">
                  {yen(result.annualTax)}
                </td>
              </tr>
            )}
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">年税額</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">
                {yen(result.annualTax)}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは自家用乗用車の標準税率に基づく概算です。営業用・事業用、グリーン化特例
          （EV等の翌年度軽課）、年度途中の登録・抹消による月割りは反映していません。
          正確な税額はお住まいの都道府県の自動車税のお知らせ・納税通知書でご確認ください。
        </p>
      </section>
    </div>
  );
}
