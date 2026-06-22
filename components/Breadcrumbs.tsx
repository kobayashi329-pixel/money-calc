import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  name: string;
  /** ルート相対パス（例: "/tedori"）。最後の項目は省略可 */
  href?: string;
}

// パンくずリスト（内部リンク＋BreadcrumbList構造化データ）。
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: "ホーム", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="パンくず" className="mb-4 text-xs text-slate-500">
      <JsonLd data={jsonLd} />
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {c.href && i < trail.length - 1 ? (
              <Link href={c.href} className="hover:text-emerald-700">
                {c.name}
              </Link>
            ) : (
              <span className="text-slate-700">{c.name}</span>
            )}
            {i < trail.length - 1 && <span className="text-slate-300">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
