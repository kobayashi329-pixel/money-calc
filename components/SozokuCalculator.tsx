"use client";

// 相続税計算機 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import { useMemo, useState } from "react";
import { calculateSozoku } from "@/lib/sozoku/calculate";
import { yen, manYen } from "@/lib/format";

export function SozokuCalculator() {
  const [estate, setEstate] = useState(100_000_000);
  const [hasSpouse, setHasSpouse] = useState(true);
  const [children, setChildren] = useState(2);

  const result = useMemo(
    () => calculateSozoku({ taxableEstate: estate, hasSpouse, children }),
    [estate, hasSpouse, children],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">遺産と相続人を入力</h2>

        {/* 遺産総額 */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">遺産の総額（正味の遺産額）</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1_000_000}
              value={estate}
              onChange={(e) => setEstate(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg font-semibold tabular-nums focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
            />
            <span className="shrink-0 text-slate-500">円</span>
          </div>
          <input
            type="range"
            min={0}
            max={500_000_000}
            step={5_000_000}
            value={Math.min(estate, 500_000_000)}
            onChange={(e) => setEstate(Number(e.target.value))}
            className="mt-3 w-full accent-violet-500"
          />
          <div className="mt-1 text-right text-sm font-semibold text-violet-700">
            {manYen(estate)}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            預貯金・不動産・有価証券などの合計から、借入金・葬式費用などの債務を差し引いた額です。
          </p>
        </label>

        {/* 配偶者 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">配偶者</span>
          <select
            value={hasSpouse ? "1" : "0"}
            onChange={(e) => setHasSpouse(e.target.value === "1")}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
          >
            <option value="1">いる</option>
            <option value="0">いない</option>
          </select>
          <p className="mt-1 text-xs text-slate-400">
            配偶者には「配偶者の税額軽減」があり、法定相続分または1.6億円までは相続税がかかりません。
          </p>
        </label>

        {/* 子の人数 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">子の人数</span>
          <select
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
          >
            {Array.from({ length: 11 }, (_, i) => (
              <option key={i} value={i}>
                {i}人
              </option>
            ))}
          </select>
        </label>

        {!hasSpouse && children === 0 && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            配偶者も子もいない場合、実際は父母や兄弟姉妹が相続人になります。本ツールは
            「配偶者・子」を対象とした簡易版のため、その場合は計算できません。
          </p>
        )}
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">計算結果</h2>

        {/* 納税額 */}
        <div className="mb-5 rounded-xl bg-violet-50 p-4 text-center">
          <div className="text-sm text-violet-800">相続税の納税額（概算・合計）</div>
          <div className="text-3xl font-extrabold text-violet-700 tabular-nums">
            {yen(result.payableTax)}
          </div>
          {!result.isTaxable ? (
            <p className="mt-2 text-xs leading-5 text-violet-700/80">
              遺産総額が<strong>基礎控除（{manYen(result.basicExemption)}）以下</strong>のため、
              相続税はかかりません（申告も原則不要）。
            </p>
          ) : (
            <p className="mt-2 text-xs leading-5 text-violet-700/80">
              配偶者の税額軽減を適用した、相続人全体の納税額の目安です。
              {result.spouseCredit > 0 && (
                <>（配偶者の軽減 {yen(result.spouseCredit)} 適用後）</>
              )}
            </p>
          )}
        </div>

        {/* 計算の内訳 */}
        <table className="w-full border-collapse text-sm">
          <tbody>
            <Row label="遺産の総額" value={result.estate} bold />
            <Row label={`基礎控除（3000万＋600万×${result.heirCount}人）`} value={-result.basicExemption} />
            <Row label="課税遺産総額" value={result.taxableEstateAfterExemption} sub />
            <Row label="相続税の総額（軽減前）" value={result.totalTax} />
            {result.spouseCredit > 0 && (
              <Row label="配偶者の税額軽減" value={-result.spouseCredit} color="text-emerald-600" />
            )}
            <tr className="border-t-2 border-slate-300">
              <td className="py-2 font-bold text-violet-700">納税額の合計</td>
              <td className="py-2 text-right text-base font-bold text-violet-700 tabular-nums">
                {yen(result.payableTax)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 相続人ごとの内訳 */}
        {result.isTaxable && result.heirs.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-sm font-medium text-slate-700">
              相続人ごとの納税額（法定相続分で分けた場合の目安）
            </div>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {result.heirs.map((h, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-2 text-slate-700">
                      {h.kind === "spouse" ? "配偶者" : `子 ${childIndex(result.heirs, i)}`}
                      <span className="ml-2 text-xs text-slate-400">
                        （法定相続分 {formatShare(h.share)}）
                      </span>
                    </td>
                    <td className="py-2 text-right tabular-nums text-slate-700">
                      {h.kind === "spouse" && h.payable === 0 ? (
                        <span className="text-emerald-600">0円（軽減）</span>
                      ) : (
                        yen(h.payable)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは「配偶者・子」を対象とし、<strong>法定相続分どおりに分割した場合</strong>の概算です。
          実際の分割割合・小規模宅地等の特例・生命保険金等の非課税枠・孫やその他の相続人の2割加算・
          相続時精算課税などは反映していません。正確な税額は税理士や税務署にご確認ください。
        </p>
      </section>
    </div>
  );
}

function childIndex(heirs: { kind: string }[], i: number): number {
  let n = 0;
  for (let k = 0; k <= i; k++) if (heirs[k].kind === "child") n++;
  return n;
}

function formatShare(share: number): string {
  // 1/2, 1/4, 1/6 などの分数表記に（近似）
  for (let d = 1; d <= 12; d++) {
    const n = share * d;
    if (Math.abs(n - Math.round(n)) < 1e-6 && Math.round(n) >= 1) {
      const num = Math.round(n);
      return num === d ? "全部" : `${num}/${d}`;
    }
  }
  return `${Math.round(share * 100)}%`;
}

function Row({
  label,
  value,
  bold,
  sub,
  color,
}: {
  label: string;
  value: number;
  bold?: boolean;
  sub?: boolean;
  color?: string;
}) {
  return (
    <tr className="border-t border-slate-100">
      <td className={`py-2 ${bold ? "font-bold text-slate-900" : sub ? "text-slate-500" : "text-slate-700"}`}>
        {label}
      </td>
      <td
        className={`py-2 text-right tabular-nums ${
          color ?? (bold ? "font-bold text-slate-900" : sub ? "text-slate-500" : "text-slate-700")
        }`}
      >
        {value < 0 ? `−${yen(-value)}` : yen(value)}
      </td>
    </tr>
  );
}
