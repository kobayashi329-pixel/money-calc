import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  CATEGORIES,
  getCategory,
  calculatorsInCategory,
} from "@/lib/calculators";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.name}の計算機`,
    description: `${cat.description}。${cat.name}に関する計算機の一覧です。`,
    alternates: { canonical: `/c/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const calcs = calculatorsInCategory(slug);

  return (
    <div>
      <Breadcrumbs items={[{ name: cat.name }]} />
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {cat.emoji} {cat.name}の計算機
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{cat.intro ?? cat.description}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {calcs.map((c) => {
          const inner = (
            <div
              className={`flex h-full flex-col rounded-2xl border p-5 ${
                c.status === "live"
                  ? "border-slate-200 bg-white shadow-sm hover:shadow-md"
                  : "border-dashed border-slate-200 bg-slate-50"
              }`}
            >
              <div className="text-3xl">{c.emoji}</div>
              <h2 className="mt-2 font-bold text-slate-900">{c.title}</h2>
              <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">
                {c.description}
              </p>
              <div className="mt-3 text-sm">
                {c.status === "live" ? (
                  <span className="font-semibold text-emerald-700">計算する →</span>
                ) : (
                  <span className="text-xs text-slate-400">準備中</span>
                )}
              </div>
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

      {/* 他のカテゴリ（クロスリンク） */}
      <section className="mt-10">
        <h2 className="mb-3 text-base font-bold text-slate-900">他のカテゴリ</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/c/${c.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
            >
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
