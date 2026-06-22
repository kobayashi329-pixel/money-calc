// 依存ライブラリなしの軽量ドーナツチャート（純粋SVG）。
// 手取り・税・社会保険などの内訳を視覚化する。
import { yen, percent } from "@/lib/format";

export interface DonutSegment {
  label: string;
  value: number;
  /** Tailwind ではなく実際の色文字列（SVG fill 用） */
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  /** 中央に表示する大きな数値（例: 手取り額） */
  centerLabel?: string;
  centerValue?: string;
  size?: number;
}

const RADIUS = 70;
const STROKE = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
  size = 200,
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + Math.max(0, seg.value), 0);
  let offsetAccum = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        role="img"
        aria-label="内訳のドーナツグラフ"
        className="shrink-0"
      >
        {/* 背景の薄い円 */}
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={STROKE}
        />
        {total > 0 &&
          segments.map((seg, i) => {
            const fraction = Math.max(0, seg.value) / total;
            const dash = fraction * CIRCUMFERENCE;
            const gap = CIRCUMFERENCE - dash;
            const dashOffset = -offsetAccum * CIRCUMFERENCE;
            offsetAccum += fraction;
            return (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 100 100)"
              />
            );
          })}
        {centerValue && (
          <>
            <text
              x="100"
              y="94"
              textAnchor="middle"
              className="fill-slate-500"
              style={{ fontSize: "11px" }}
            >
              {centerLabel}
            </text>
            <text
              x="100"
              y="116"
              textAnchor="middle"
              className="fill-slate-900"
              style={{ fontSize: "20px", fontWeight: 700 }}
            >
              {centerValue}
            </text>
          </>
        )}
      </svg>

      {/* 凡例 */}
      <ul className="w-full space-y-1.5 text-sm">
        {segments.map((seg, i) => {
          const fraction = total > 0 ? seg.value / total : 0;
          return (
            <li key={i} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-slate-700">{seg.label}</span>
              </span>
              <span className="text-right tabular-nums text-slate-600">
                {yen(seg.value)}
                <span className="ml-1 text-xs text-slate-400">
                  ({percent(fraction)})
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
