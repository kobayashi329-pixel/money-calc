import { Breadcrumbs } from "./Breadcrumbs";

// 信頼性ページ（運営者情報・プライバシー・免責・問い合わせ）共通の読みやすいレイアウト。
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <Breadcrumbs items={[{ name: title }]} />
      <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
      {updated && (
        <p className="mt-1 text-xs text-slate-400">最終更新日: {updated}</p>
      )}
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700 [&_a]:text-emerald-700 [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:border-l-4 [&_h2]:border-emerald-500 [&_h2]:pl-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-slate-900">
        {children}
      </div>
    </article>
  );
}
