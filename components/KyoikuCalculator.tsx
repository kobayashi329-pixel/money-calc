"use client";

// 教育資金シミュレーション 本体（クライアントコンポーネント）。
// 計算はすべてブラウザ側で完結（入力は送信されない）。
import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateKyoiku } from "@/lib/kyoiku/calculate";
import type {
  KindergartenChoice,
  SchoolChoice,
  UniversityChoice,
} from "@/lib/kyoiku/types";
import { yen, manYen } from "@/lib/format";

const BAR_COLOR = "#10b981"; // emerald-500

function StageSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function KyoikuCalculator() {
  const [kindergarten, setKindergarten] = useState<KindergartenChoice>("public");
  const [elementary, setElementary] = useState<SchoolChoice>("public");
  const [juniorHigh, setJuniorHigh] = useState<SchoolChoice>("public");
  const [highSchool, setHighSchool] = useState<SchoolChoice>("public");
  const [university, setUniversity] = useState<UniversityChoice>("national");
  const [childAge, setChildAge] = useState(0);
  const [rateStr, setRateStr] = useState("2");

  const savingRatePercent = Number(rateStr) || 0;

  const result = useMemo(
    () =>
      calculateKyoiku({
        kindergarten,
        elementary,
        juniorHigh,
        highSchool,
        university,
        childAge,
        savingRatePercent,
      }),
    [kindergarten, elementary, juniorHigh, highSchool, university, childAge, savingRatePercent],
  );

  const maxCost = Math.max(...result.stages.map((s) => s.cost), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ===== 入力 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">進路を選ぶ</h2>

        <div className="space-y-4">
          <StageSelect
            label="幼稚園"
            value={kindergarten}
            onChange={setKindergarten}
            options={[
              { value: "public", label: "公立" },
              { value: "private", label: "私立" },
              { value: "none", label: "通わない（保育園など）" },
            ]}
          />
          <StageSelect
            label="小学校"
            value={elementary}
            onChange={setElementary}
            options={[
              { value: "public", label: "公立" },
              { value: "private", label: "私立" },
            ]}
          />
          <StageSelect
            label="中学校"
            value={juniorHigh}
            onChange={setJuniorHigh}
            options={[
              { value: "public", label: "公立" },
              { value: "private", label: "私立" },
            ]}
          />
          <StageSelect
            label="高校"
            value={highSchool}
            onChange={setHighSchool}
            options={[
              { value: "public", label: "公立" },
              { value: "private", label: "私立" },
            ]}
          />
          <StageSelect
            label="大学"
            value={university}
            onChange={setUniversity}
            options={[
              { value: "national", label: "国公立" },
              { value: "privateLiberal", label: "私立（文系）" },
              { value: "privateScience", label: "私立（理系）" },
              { value: "none", label: "進学しない" },
            ]}
          />
        </div>

        <div className="my-5 border-t border-dashed border-slate-200" />

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">子どもの現在の年齢</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={22}
                value={childAge}
                onChange={(e) => setChildAge(Math.min(22, Math.max(0, Number(e.target.value))))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              />
              <span className="text-slate-500">歳</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">積立の想定利回り</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={20}
                step={0.5}
                value={rateStr}
                onChange={(e) => setRateStr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              />
              <span className="text-slate-500">％</span>
            </div>
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          大学費用を「子が18歳になるまでに」積み立てる前提で、毎月の必要額を計算します。
        </p>
      </section>

      {/* ===== 結果 ===== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">計算結果</h2>

        {/* 総額 */}
        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-center">
          <div className="text-sm text-emerald-800">幼稚園〜大学までの教育費の総額（目安）</div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {yen(result.total)}
          </div>
          <div className="mt-1 text-xs text-emerald-700/80">約 {manYen(result.total)}</div>
        </div>

        {/* 段階別の棒グラフ */}
        <div className="space-y-2">
          {result.stages.map((s) => (
            <div key={s.key}>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  {s.name}
                  <span className="ml-1 text-slate-400">（{s.choiceLabel}）</span>
                </span>
                <span className="tabular-nums">{yen(s.cost)}</span>
              </div>
              <div className="mt-0.5 h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${(s.cost / maxCost) * 100}%`, background: BAR_COLOR }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 大学費用の積立 */}
        {result.universityCost > 0 && (
          <div className="mt-5 rounded-xl bg-violet-50 p-4 text-center">
            <div className="text-sm text-violet-800">
              大学費用 {yen(result.universityCost)} を18歳までに貯めるには
            </div>
            {result.requiredMonthlyForUniversity > 0 ? (
              <>
                <div className="text-2xl font-extrabold text-violet-700 tabular-nums">
                  毎月 {yen(result.requiredMonthlyForUniversity)}
                </div>
                <p className="mt-1 text-xs text-violet-700/80">
                  あと {Math.round(result.monthsUntilUniversity / 12)}年・年率{savingRatePercent}%で積み立てた場合
                </p>
              </>
            ) : (
              <p className="mt-1 text-xs leading-5 text-violet-700/80">
                すでに大学入学が近い（または過ぎている）ため、積立ではなく一括での準備が必要です。
              </p>
            )}
          </div>
        )}

        {result.requiredMonthlyForUniversity > 0 && (
          <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-center text-xs leading-5 text-emerald-800">
            教育資金の積立にも、運用益が非課税の制度が活用できます。
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Link href="/nisa" className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700">
                NISAで試算 →
              </Link>
            </div>
          </div>
        )}

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          ⚠️ 本ツールは文部科学省・日本政策金融公庫の調査をもとにした<strong>代表的な目安</strong>です。
          実際の費用は学校・地域・習い事・下宿の有無などで大きく変わります。塾・予備校・留学・一人暮らしの
          生活費などは別途必要になる場合があります。
        </p>
      </section>
    </div>
  );
}
