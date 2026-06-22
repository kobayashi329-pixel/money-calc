import Link from "next/link";
import { relatedCalculators } from "@/lib/calculators";

// 各計算機ページ下部に出す「関連する計算機」内部リンク。
// レジストリの related からリンク先を解決。集客→収益ページへ誘導。
export function RelatedCalculators({ slug }: { slug: string }) {
  const related = relatedCalculators(slug);
  if (related.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-bold text-slate-900">関連する計算機</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {related.map((c) => {
          const inner = (
            <div
              className={`flex h-full items-start gap-3 rounded-xl border p-4 ${
                c.status === "live"
                  ? "border-slate-200 bg-white hover:shadow-md"
                  : "border-dashed border-slate-200 bg-slate-50"
              }`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <span>
                <span className="block font-semibold text-slate-900">
                  {c.shortTitle}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {c.status === "live" ? "計算する →" : "準備中"}
                </span>
              </span>
            </div>
          );
          return c.status === "live" ? (
            <Link key={c.slug} href={`/${c.slug}`} className="block">
              {inner}
            </Link>
          ) : (
            <div key={c.slug}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
