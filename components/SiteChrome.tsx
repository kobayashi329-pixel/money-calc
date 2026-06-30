"use client";

// サイト共通のナビ（PC=左サイドバー／スマホ=ハンバーガー＋ドロワー）とフッター。
// /embed 配下（外部サイトへの埋め込み用）ではクロームを出さず計算機だけを表示する。
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, calculatorsInCategory } from "@/lib/calculators";
import { SITE_NAME, SITE_LAUNCH_YEAR } from "@/lib/site";

/** サイドバー／ドロワー共通のナビ中身 */
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const itemBase =
    "block rounded-lg px-3 py-2 text-sm transition";
  const active = "bg-emerald-50 font-semibold text-emerald-700";
  const idle = "text-slate-600 hover:bg-slate-50 hover:text-emerald-700";

  return (
    <nav aria-label="サイトナビ" className="flex flex-col gap-1">
      <Link href="/tedori" onClick={onNavigate} className={`${itemBase} ${isActive("/tedori") ? active : idle}`}>
        💴 年収手取り計算
      </Link>
      <Link href="/search" onClick={onNavigate} className={`${itemBase} ${isActive("/search") ? active : idle}`}>
        🔍 サイト内検索
      </Link>

      <div className="mt-3 px-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
        カテゴリ
      </div>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/c/${cat.slug}`}
          onClick={onNavigate}
          className={`${itemBase} ${isActive(`/c/${cat.slug}`) ? active : idle}`}
        >
          <span aria-hidden>{cat.emoji}</span> {cat.name}
        </Link>
      ))}

      <div className="mt-3 px-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
        読みもの
      </div>
      <Link href="/guide" onClick={onNavigate} className={`${itemBase} ${isActive("/guide") ? active : idle}`}>
        📝 ガイド・解説
      </Link>
      <Link href="/calculators" onClick={onNavigate} className={`${itemBase} ${isActive("/calculators") ? active : idle}`}>
        🗂️ 計算機・ガイド一覧
      </Link>
    </nav>
  );
}

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="flex items-center gap-1 text-lg font-bold text-slate-900">
      <span className="text-emerald-600">¥</span> お金の計算機
    </Link>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ルート遷移したらドロワーを閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ドロワーを開いている間は背面スクロールを止める／ESCで閉じる
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (pathname?.startsWith("/embed")) {
    return <main className="w-full p-3">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* PC：左サイドバー（lg以上で常時表示・自身でスクロール） */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 lg:flex">
        <div className="px-3 pb-4">
          <Logo />
        </div>
        <NavLinks />
      </aside>

      {/* 右側：本文＋フッター */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* スマホ／タブレット：上部バー＋ハンバーガー */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="メニューを開く"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <nav aria-label="計算機一覧" className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
              {CATEGORIES.map((cat) => {
                const calcs = calculatorsInCategory(cat.slug).filter((c) => c.status === "live");
                if (calcs.length === 0) return null;
                return (
                  <div key={cat.slug}>
                    <Link href={`/c/${cat.slug}`} className="text-sm font-bold text-slate-800 hover:text-emerald-700">
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
      </div>

      {/* スマホ：ドロワー（オーバーレイ＋左スライド） */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" id="mobile-drawer">
          <button
            type="button"
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/40"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col overflow-y-auto bg-white px-3 py-4 shadow-xl">
            <div className="flex items-center justify-between px-3 pb-4">
              <Logo onNavigate={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="メニューを閉じる"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
