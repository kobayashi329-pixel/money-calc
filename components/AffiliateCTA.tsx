// 住宅ローン・証券などのアフィリエイト送客枠（収益動線）。
// AFFILIATE_ENABLED が false、または有効なURLが1つも無い間は何も描画しない
// （FurusatoCTA・AdSlot と同じフラグ運用。審査・UX・CLSに影響なし）。
// アフィリエイトリンクは rel="sponsored" を付与（Googleガイドライン準拠）。
import { AFFILIATE_ENABLED, AFFILIATE_SLOTS } from "@/lib/site";

export function AffiliateCTA({ slot }: { slot: string | null }) {
  if (!AFFILIATE_ENABLED || !slot) return null;
  const config = AFFILIATE_SLOTS[slot];
  if (!config) return null;
  const items = config.items.filter((i) => i.url);
  if (items.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{config.heading}</h2>
        <span className="shrink-0 rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] text-slate-500">
          広告（アフィリエイト）
        </span>
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{config.note}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((s) => (
          <div
            key={s.name}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="font-bold text-slate-900">{s.name}</div>
            <div className="mt-1 grow text-xs leading-5 text-slate-500">{s.feature}</div>
            <a
              href={s.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="mt-3 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700"
            >
              公式サイトを見る →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
