import type { MDXComponents } from "mdx/types";

// @next/mdx は App Router でこのファイル（プロジェクト直下 mdx-components.tsx）を
// 必須とする。MDX 内の各要素に Tailwind のスタイルを当てて読みやすくする。
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-3 text-xl font-bold text-slate-900 border-l-4 border-emerald-500 pl-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-lg font-bold text-slate-800">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="my-3 leading-7 text-slate-700">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="my-3 list-disc space-y-1 pl-6 text-slate-700">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-3 list-decimal space-y-1 pl-6 text-slate-700">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-slate-300 bg-slate-100 px-3 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-slate-300 px-3 py-2">{children}</td>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-slate-900">{children}</strong>
    ),
    ...components,
  };
}
