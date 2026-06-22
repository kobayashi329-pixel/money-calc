import type { Metadata } from "next";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_URL, GA_MEASUREMENT_ID } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "お金の計算機 | 手取り・住宅ローン・税金をかんたん試算",
    template: "%s | お金の計算機",
  },
  description:
    "年収手取り・住宅ローン・ふるさと納税など、お金にまつわる計算をブラウザだけでかんたんに。すべて公的資料に基づく概算ツールです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-slate-900">
              <span className="text-emerald-600">¥</span> お金の計算機
            </Link>
            <nav className="text-sm text-slate-500">
              <Link href="/take-home" className="hover:text-emerald-700">
                年収手取り
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-6 text-xs leading-6 text-slate-500">
            <p>
              本サイトの計算結果はすべて概算であり、正確性を保証するものではありません。
              実際の税額・保険料は、お住まいの自治体や個別事情により異なります。
              重要な判断の際は、税理士・社会保険労務士などの専門家や公的機関にご確認ください。
            </p>
            <p className="mt-2">© 2025 お金の計算機</p>
          </div>
        </footer>
      </body>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
