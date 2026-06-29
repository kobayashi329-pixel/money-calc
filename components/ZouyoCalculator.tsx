"use client";

// 贈与税 計算機 本体（暦年課税・クライアントコンポーネント）。計算はブラウザ側で完結。
import { useMemo, useState } from "react";
import { calculateZouyo, type GiftRateType } from "@/lib/zouyo/calculate";
import { yen, manYen, percent } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";
import { ShareButton, useSharedParams, applyNumber } from "./ShareButton";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-xl font-semibold tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none";

export function ZouyoCalculator() {
  const [amount, setAmount] = useState(5_000_000);
  const [rateType, setRateType] = useState<GiftRateType>("special");

  useSharedParams((get) => {
    applyNumber(get, "amount", setAmount);
    const t = get("type");
    if (t === "special" || t === "general") setRateType(t);
  });

  const shareParams = { amount, type: rateType };

  const result = useMemo(() => calculateZouyo({ amount, rateType }), [amount, rateType]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">贈与額と関係を入力</h2>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">1年間に受け取った贈与額</span>
          <div className="mt-1 flex items-center gap-2">
            <MoneyInput value={amount} onChange={setAmount} max={1_000_000_000} className={inputClass} />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={30_000_000}
            step={100_000}
            value={Math.min(amount, 30_000_000)}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-emerald-700">{manYen(amount)}</div>
        </label>

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700">誰からの贈与？（税率の種類）</span>
          <div className="mt-1 grid gap-2">
            {(
              [
                ["special", "特例税率", "親・祖父母から18歳以上の子・孫への贈与"],
                ["general", "一般税率", "兄弟間・夫婦間・未成年への贈与など"],
              ] as const
            ).map(([val, label, desc]) => (
              <button
                key={val}
                type="button"
                onClick={() => setRateType(val)}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  rateType === val
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
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">計算結果</h2>
          <ShareButton params={shareParams} />
        </div>

        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">贈与税額</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{yen(result.tax)}</div>
          <div className="mt-1 text-xs text-emerald-700/80">
            {result.tax > 0
              ? <>実質負担率 約 {percent(result.burdenRate, 1)}</>
              : "基礎控除（110万円）内のため非課税"}
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">贈与額</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.amount)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">基礎控除</td>
              <td className="py-2 text-right tabular-nums text-slate-900">−{yen(result.basicDeduction)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">課税価格</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{yen(result.taxableBase)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">適用税率</td>
              <td className="py-2 text-right tabular-nums text-slate-900">{percent(result.taxRate, 0)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 text-slate-700">贈与税額</td>
              <td className="py-2 text-right tabular-nums text-amber-600">{yen(result.tax)}</td>
            </tr>
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-emerald-700">税引後に残る額</td>
              <td className="py-2 text-right text-base font-bold text-emerald-700 tabular-nums">{yen(result.afterTax)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは暦年課税の概算です。相続時精算課税、住宅取得資金・教育資金の非課税特例、複数人からの贈与の合算などは
          反映していません。正確な額・申告は税理士や税務署にご確認ください。
        </p>
      </section>
    </div>
  );
}
