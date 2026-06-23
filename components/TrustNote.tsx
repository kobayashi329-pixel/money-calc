import Link from "next/link";
import { SITE_LAST_UPDATED } from "@/lib/site";

// 各計算機ページの信頼性ノート。最終更新日＋検証体制＋出典/編集方針への相互リンク。
// 個人名に依存せず、「公的資料に基づく作成・テスト検証」という事実で信頼性を示す（E-E-A-T）。
export function TrustNote({ updated = SITE_LAST_UPDATED }: { updated?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
      <span>🔄 最終更新: {updated}</span>
      <span className="text-slate-300">｜</span>
      <span>公的資料に基づき作成・テストで検証</span>
      <span className="text-slate-300">｜</span>
      <Link href="/sources" className="font-medium text-emerald-700 hover:underline">
        出典
      </Link>
      <Link href="/editorial-policy" className="font-medium text-emerald-700 hover:underline">
        編集方針
      </Link>
    </div>
  );
}
