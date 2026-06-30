"use client";

// サイト共通のヘッダー・フッター。/embed 配下（外部サイトへの埋め込み用）では
// クローム（ヘッダー・フッター）を出さず、計算機だけを表示する。
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, calculatorsInCategory } from "@/lib/calculators";
import { SITE_NAME, SITE_LAUNCH_YEAR } from "@/lib/site";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEmbed = pathname?.startsWith("/embed");

  if (isEmbed) {
    // 埋め込み用：ヘッダー・フッターなし、余白も最小限
    return <main className="w-full p-3">{children}</main>;
  }

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="text-lg font-bold text-slate-900">
              <span className="text-emerald-600">¥</span> お金の計算機
            </Link>
            <div className="flex gap-3 text-sm text-slate-500">
              <Link href="/tedori" className="hover:text-emerald-700">年収手取り</Link>
              <Link href="/guide" className="hover:text-emerald-700">ガイド</Link>
              <Link href="/search" className="hover:text-emerald-700" aria-label="サイト内検索">🔍 検索</Link>
            </div>
          </div>
          {/* カテゴリのグローバルナビ（全ページから全カテゴリへ） */}
          <nav aria-label="カテゴリ" className="-mb-px flex gap-1 overflow-x-auto pb-2 text-sm">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/c/${cat.slug}`}
                className="shrink-0 rounded-full px-3 py-1 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span aria-hidden>{cat.emoji}</span> {cat.name}
              </Link>
            ))}
            <Link
              href="/guide"
              className="shrink-0 rounded-full px-3 py-1 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              📝 ガイド
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* サイトワイドの計算機リンク（カテゴリ別） */}
          <nav aria-label="計算機一覧" className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const calcs = calculatorsInCategory(cat.slug).filter((c) => c.status === "live");
              if (calcs.length === 0) return null;
              return (
                <div key={cat.slug}>
                  <Link
                    href={`/c/${cat.slug}`}
                    className="text-sm font-bold text-slate-800 hover:text-emerald-700"
                  >
                    {cat.emoji} {cat.name}
                  </Link>
                  <ul className="mt-2 space-y-1.5">
                    {calcs.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/${c.slug}`} className="text-xs text-slate-500 hover:text-emerald-700">
                          {c.shortTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-100">
          <div className="mx-auto max-w-4xl px-4 py-6 text-xs leading-6 text-slate-500">
            <nav className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/calculators" className="hover:text-emerald-700">計算機・ガイド一覧</Link>
              <Link href="/guide" className="hover:text-emerald-700">ガイド・解説</Link>
              <Link href="/about" className="hover:text-emerald-700">運営者情報</Link>
              <Link href="/press" className="hover:text-emerald-700">掲載・引用について</Link>
              <Link href="/editorial-policy" className="hover:text-emerald-700">編集・運営方針</Link>
              <Link href="/sources" className="hover:text-emerald-700">計算の根拠・出典</Link>
              <Link href="/privacy" className="hover:text-emerald-700">プライバシーポリシー</Link>
              <Link href="/disclaimer" className="hover:text-emerald-700">免責事項</Link>
              <Link href="/contact" className="hover:text-emerald-700">お問い合わせ</Link>
            </nav>
            <p>
              本サイトの計算結果はすべて概算であり、正確性を保証するものではありません。
              実際の税額・保険料は、お住まいの自治体や個別事情により異なります。
              重要な判断の際は、税理士・社会保険労務士などの専門家や公的機関にご確認ください。
            </p>
            <p className="mt-2">© {SITE_LAUNCH_YEAR} {SITE_NAME}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
