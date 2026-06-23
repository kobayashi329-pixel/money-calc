import type { Metadata } from "next";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  SITE_URL,
  GA_MEASUREMENT_ID,
  ADSENSE_CLIENT,
  SITE_NAME,
  SITE_LAUNCH_YEAR,
} from "@/lib/site";
import { CATEGORIES, calculatorsInCategory } from "@/lib/calculators";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "お金の計算機｜年収手取り・住宅ローン・税金を無料でシミュレーション",
    template: "%s | お金の計算機",
  },
  description:
    "年収の手取り、住宅ローンの返済、ふるさと納税の上限額、NISA・iDeCo、相続税、退職金まで、お金の計算を無料・登録不要でまとめて。計算はブラウザ内で完結し入力は送信されません。国税庁・総務省など公的資料に基づく令和7年（2025年）対応の概算ツールです。",
  keywords: [
    "お金 計算機",
    "年収 手取り 計算",
    "住宅ローン シミュレーション",
    "ふるさと納税 上限",
    "NISA シミュレーション",
    "iDeCo 節税",
    "相続税 計算",
    "退職金 手取り",
    "消費税 計算",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "お金の計算機",
    title: "お金の計算機｜年収手取り・住宅ローン・税金を無料でシミュレーション",
    description:
      "年収手取り・住宅ローン・ふるさと納税・NISA・iDeCo・相続税・退職金など、お金の計算を無料でまとめて。令和7年（2025年）対応・登録不要。",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        {/* Google AdSense（審査用スニペット／広告配信）。
            AdSenseクローラが生HTMLの<head>で検出できるよう、素のscriptタグで出力する。 */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4">
            <div className="flex items-center justify-between py-3">
              <Link href="/" className="text-lg font-bold text-slate-900">
                <span className="text-emerald-600">¥</span> お金の計算機
              </Link>
              <div className="flex gap-3 text-sm text-slate-500">
                <Link href="/tedori" className="hover:text-emerald-700">年収手取り</Link>
                <Link href="/guide" className="hover:text-emerald-700">ガイド</Link>
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
              <Link href="/guide" className="hover:text-emerald-700">ガイド・解説</Link>
              <Link href="/about" className="hover:text-emerald-700">運営者情報</Link>
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
      </body>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
