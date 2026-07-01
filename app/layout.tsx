import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  SITE_URL,
  GA_MEASUREMENT_ID,
  ADSENSE_CLIENT,
} from "@/lib/site";
import { SiteChrome } from "@/components/SiteChrome";
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
  twitter: {
    card: "summary_large_image",
    title: "お金の計算機｜年収手取り・住宅ローン・税金を無料でシミュレーション",
    description:
      "年収手取り・住宅ローン・ふるさと納税・NISA・iDeCo・相続税・退職金など、お金の計算を無料でまとめて。令和7年（2025年）対応・登録不要。",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        {/* サードパーティ接続の先読み（LCP/接続時間の短縮・特にモバイル） */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Google AdSense（審査用スニペット／広告配信）。
            AdSenseクローラが生HTMLの<head>で検出できるよう、素のscriptタグで出力する。 */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
