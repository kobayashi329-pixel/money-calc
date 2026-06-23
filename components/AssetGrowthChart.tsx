// 積立資産の推移チャート（依存なしの純粋SVG）。
// 下から「元本」、その上に「運用益」を積み上げて評価額の伸びを示す。
import type { YearlyAsset } from "@/lib/invest/accumulate";

export function AssetGrowthChart({
  yearly,
  principalColor = "#3b82f6", // blue-500
  gainColor = "#10b981", // emerald-500
}: {
  yearly: YearlyAsset[];
  principalColor?: string;
  gainColor?: string;
}) {
  if (yearly.length < 2) return null;

  const W = 320;
  const H = 140;
  const pad = 4;
  const maxYear = yearly[yearly.length - 1].year;
  const maxTotal = Math.max(...yearly.map((p) => p.total), 1);

  // 0年（評価額0）を始点に加える
  const points = [{ year: 0, principal: 0, total: 0, gain: 0 }, ...yearly];

  const xs = (year: number) => pad + (year / maxYear) * (W - pad * 2);
  const ys = (val: number) => H - pad - (val / maxTotal) * (H - pad * 2);

  const principalLine = points.map((p) => `${xs(p.year)},${ys(p.principal)}`).join(" ");
  const totalLine = points.map((p) => `${xs(p.year)},${ys(p.total)}`).join(" ");

  // 運用益の帯 = 評価額ライン → 元本ラインを逆走して閉じる
  const gainArea =
    totalLine + " " + [...points].reverse().map((p) => `${xs(p.year)},${ys(p.principal)}`).join(" ");
  // 元本の面 = 元本ライン → 底辺
  const principalArea = `${xs(0)},${ys(0)} ${principalLine} ${xs(maxYear)},${ys(0)}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="積立資産の推移（元本と運用益）"
    >
      <polygon points={principalArea} fill={`${principalColor}33`} />
      <polygon points={gainArea} fill={`${gainColor}33`} />
      <polyline points={principalLine} fill="none" stroke={principalColor} strokeWidth={1.5} />
      <polyline points={totalLine} fill="none" stroke={gainColor} strokeWidth={2} />
      <text x={pad} y={H - 6} className="fill-slate-400" style={{ fontSize: 9 }}>
        0年
      </text>
      <text
        x={W - pad}
        y={H - 6}
        textAnchor="end"
        className="fill-slate-400"
        style={{ fontSize: 9 }}
      >
        {maxYear}年
      </text>
    </svg>
  );
}
