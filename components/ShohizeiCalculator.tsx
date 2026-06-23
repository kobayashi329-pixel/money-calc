"use client";

// 消費税・インボイス計算機 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateShohizei, type Direction, type RoundMode } from "@/lib/shohizei/calculate";
import { yen } from "@/lib/format";

export function ShohizeiCalculator() {
  const [amount, setAmount] = useState(10_000);
  const [direction, setDirection] = useState<Direction>("addTax");
  const [ratePercent, setRatePercent] = useState(10);
  const [rounding, setRounding] = useState<RoundMode>("floor");

  const result = useMemo(
    () => calculateShohizei({ amount, ratePercent, direction, rounding }),
    [amount, ratePercent, direction, rounding],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">金額と条件を入力</h2>

        {/* 計算の向き */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          {(
            [
              ["addTax", "税抜 → 税込", "税抜金額に消費税を足す"],
              ["removeTax", "税込 → 税抜", "税込金額から消費税を抜く"],
            ] as const
          ).map(([val, label, desc]) => (
            <button
              key={val}
              type="button"
              onClick={() => setDirection(val)}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${
                direction === val
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="block font-semibold">{label}</span>
              <span className="block text-xs text-slate-400">{desc}</span>
            </button>
          ))}
        </div>

        {/* 金額 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {direction === "addTax" ? "税抜金額" : "税込金額"}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
        </label>

        {/* 税率 */}
        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700">消費税率</span>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(
              [
                [10, "標準税率 10%", "通常の商品・サービス"],
                [8, "軽減税率 8%", "飲食料品・新聞など"],
              ] as const
            ).map(([val, label, desc]) => (
              <button
                key={val}
                type="button"
                onClick={() => setRatePercent(val)}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  ratePercent === val
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

        {/* 端数処理 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">消費税の端数処理</span>
          <select
            value={rounding}
            onChange={(e) => setRounding(e.target.value as RoundMode)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          >
            <option value="floor">切り捨て</option>
            <option value="round">四捨五入</option>
            <option value="ceil">切り上げ</option>
          </select>
          <p className="mt-1 text-xs text-slate-400">
            端数処理の方法は事業者が選べます。インボイスでは「1つの請求書につき税率ごとに1回」処理するのが原則です。
          </p>
        </label>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">計算結果</h2>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">
            {direction === "addTax" ? "税込金額" : "税抜金額"}
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {yen(direction === "addTax" ? result.gross : result.net)}
          </div>
          <div className="mt-1 text-xs text-emerald-700/80">
            うち消費税（{result.ratePercent}%）{yen(result.tax)}
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">税抜金額</td>
              <td className="py-2 text-right font-semibold tabular-nums text-slate-900">
                {yen(result.net)}
              </td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">消費税（{result.ratePercent}%）</td>
              <td className="py-2 text-right font-semibold tabular-nums text-amber-600">
                {yen(result.tax)}
              </td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">税込金額</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">
                {yen(result.gross)}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 端数処理の方法により消費税額が1円単位で変わります。実際の請求書・帳簿での処理は、
          取引先との取り決めやインボイス制度のルールに従ってください。正確な処理は税理士や税務署にご確認ください。
        </p>
      </section>
    </div>
  );
}
