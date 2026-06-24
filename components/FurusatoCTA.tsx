// ふるさと納税の寄付先サイトへの送客枠（仕様書ブロック3＝収益動線）。
// FURUSATO_ASP_ENABLED が false、または有効なURLが1つも無い間は何も描画しない
// （AdSlot と同じフラグ運用。審査・UX・CLSに影響なし）。
// アフィリエイトリンクは rel="sponsored" を付与（Googleガイドライン準拠）。
import { FURUSATO_ASP_ENABLED, FURUSATO_ASP } from "@/lib/site";

function formatYen(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function FurusatoCTA({ amount }: { amount?: number }) {
  if (!FURUSATO_ASP_ENABLED) return null;
  const sites = FURUSATO_ASP.filter((s) => s.url);
  if (sites.length === 0) return null;

  const heading =
    amount && amount > 0
      ? `${formatYen(amount)}円分の返礼品を探す`
      : "ふるさと納税の返礼品を探す";

  return (
    <section className="mt-8 rounded-2xl border border-rose-200 bg-rose-50/60 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{heading}</h2>
        <span className="shrink-0 rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] text-slate-500">
          広告（アフィリエイト）
        </span>
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        上限額の範囲内で寄付すれば、自己負担は実質2,000円。下記のサイトから返礼品を選べます。
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {sites.map((s) => (
          <div
            key={s.name}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="font-bold text-slate-900">{s.name}</div>
            <div className="mt-1 grow text-xs leading-5 text-slate-500">
              {s.feature}
            </div>
            <a
              href={s.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="mt-3 inline-block rounded-lg bg-rose-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-rose-700"
            >
              返礼品を見る →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
