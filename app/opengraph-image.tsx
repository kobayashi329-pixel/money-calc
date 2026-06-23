import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// サイト共通のOGP画像（SNS・検索のサムネ）。1200×630。
export const runtime = "nodejs";
export const alt = "お金の計算機｜年収手取り・住宅ローン・税金を無料でシミュレーション";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const jp = readFileSync(join(process.cwd(), "assets", "NotoSansJP-jp-700.woff"));
  const latin = readFileSync(join(process.cwd(), "assets", "NotoSansJP-latin-700.woff"));

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px",
          fontFamily: "Noto Sans JP",
        }}
      >
        {/* ブランド */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "#10b981",
              color: "#ffffff",
              fontSize: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ¥
          </div>
          <div style={{ marginLeft: 26, fontSize: 46, color: "#0f172a" }}>
            お金の計算機
          </div>
        </div>

        {/* 見出し */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, color: "#0f172a", lineHeight: 1.25 }}>
            年収手取り・住宅ローン・税金を
          </div>
          <div style={{ fontSize: 66, color: "#059669", lineHeight: 1.25 }}>
            無料でシミュレーション
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 30, color: "#475569" }}>
            計算機15種類＋解説ガイド・登録不要・令和7年対応
          </div>
          <div style={{ fontSize: 30, color: "#10b981" }}>okane-keisan.net</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Noto Sans JP", data: jp, weight: 700, style: "normal" },
        { name: "Noto Sans JP", data: latin, weight: 700, style: "normal" },
      ],
    },
  );
}
