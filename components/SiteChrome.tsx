"use client";

// サイト共通のナビ（PC=左サイドバー／スマホ=ハンバーガー＋ドロワー）とフッター。
// MyBest 風に「検索ボックス（独立）→ カテゴリ → コンテンツ → 下部ユーティリティ」で構成。
// /embed 配下（外部サイトへの埋め込み用）ではクロームを出さず計算機だけを表示する。
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, calculatorsInCategory } from "@/lib/calculators";
import { SITE_NAME, SITE_LAUNCH_YEAR } from "@/lib/site";

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

/** 検索ボックス（メニューと明確に区別。/search?q= に送信） */
function SearchBox() {
  return (
    <form action="/search" method="get" role="search" className="px-1">
      <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-2.5 text-slate-400 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
        <SearchIcon />
        <input
          name="q"
          type="search"
          enterKeyHint="search"
          placeholder="計算機・記事を検索"
          aria-label="サイト内検索"
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
    </form>
  );
}

/** カテゴリ・コンテンツのナビ（検索は含めない＝別UI） */
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const itemBase = "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition";
  const active = "bg-emerald-50 font-semibold text-emerald-700";
  const idle = "text-slate-700 hover:bg-slate-50 hover:text-emerald-700";
  const heading = "mt-4 mb-1 px-3 text-[11px] font-bold uppercase tracking-wide text-slate-400";

  return (
    <nav aria-label="サイトナビ" className="flex flex-col gap-0.5">
      <div className={heading}>人気の計算機</div>
      <Link href="/tedori" onClick={onNavigate} className={`${itemBase} ${isActive("/tedori") ? active : idle}`}>
        <span aria-hidden>💴</span> 年収手取り計算
      </Link>

      <div className={heading}>カテゴリから探す</div>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/c/${cat.slug}`}
          onClick={onNavigate}
          className={`${itemBase} ${isActive(`/c/${cat.slug}`) ? active : idle}`}
        >
          <span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm">
            {cat.emoji}
          </span>
          {cat.name}
        </Link>
      ))}

      <div className={heading}>コンテンツ</div>
      <Link href="/guide" onClick={onNavigate} className={`${itemBase} ${isActive("/guide") ? active : idle}`}>
        <span aria-hidden>📝</span> ガイド・解説
      </Link>
      <Link href="/calculators" onClick={onNavigate} className={`${itemBase} ${isActive("/calculators") ? active : idle}`}>
        <span aria-hidden>🗂️</span> 計算機・ガイド一覧
      </Link>
    </nav>
  );
}

/** サイドバー下部のユーティリティリンク（列の下端を締める） */
function SidebarFooter() {
  return (
    <div className="mt-6 border-t border-slate-100 px-3 pt-4 text-xs text-slate-400">
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <Link href="/about" className="hover:text-emerald-700">運営者情報</Link>
        <Link href="/press" className="hover:text-emerald-700">掲載・引用</Link>
        <Link href="/editorial-policy" className="hover:text-emerald-700">運営方針</Link>
        <Link href="/disclaimer" className="hover:text-emerald-700">免責</Link>
      </div>
      <p className="mt-3">© {SITE_LAUNCH_YEAR} {SITE_NAME}</p>
    </div>
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

  // ドロワー表示中は背面スクロール停止／ESCで閉じる
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
      {/* PC：左サイドバー（lg以上・sticky・下部にユーティリティ） */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 lg:flex">
        <div className="px-2 pb-4">
          <Logo />
        </div>
        <SearchBox />
        <div className="mt-3 flex-1">
          <NavLinks />
        </div>
        <SidebarFooter />
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
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col overflow-y-auto bg-white px-3 py-4 shadow-xl">
            <div className="flex items-center justify-between px-2 pb-4">
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
            <SearchBox />
            <div className="mt-3">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
