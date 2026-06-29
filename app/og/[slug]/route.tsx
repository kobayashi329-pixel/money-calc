import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getGuide } from "@/lib/guides";
import { getCalculator, getCategory } from "@/lib/calculators";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

// 記事・計算機ごとのアイキャッチ／OGP画像を動的生成する（/og/<slug>）。
// 画像検索・SNS・Discover・Articleリッチリザルトのimageに使用。
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const calc = getCalculator(slug);

  const heading = guide?.shortTitle ?? calc?.shortTitle ?? "お金の計算機";
  const sub = guide?.description ?? calc?.description ?? "";
  const catSlug = guide?.category ?? calc?.category;
  const cat = catSlug ? getCategory(catSlug) : undefined;
  const tag = calc ? "計算機" : "ガイド";

  const jp = readFileSync(join(process.cwd(), "assets", "NotoSansJP-jp-700.woff"));
  const latin = readFileSync(
    join(process.cwd(), "assets", "NotoSansJP-latin-700.woff"),
  );

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
        {/* ブランド＋カテゴリ */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 20,
                background: "#10b981",
                color: "#ffffff",
                fontSize: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ¥
            </div>
            <div style={{ marginLeft: 22, fontSize: 38, color: "#0f172a" }}>
              おかね計算ラボ
            </div>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#059669",
              border: "3px solid #a7f3d0",
              borderRadius: 999,
              padding: "8px 26px",
            }}
          >
            {cat ? `${cat.emoji} ${cat.name}` : tag}
          </div>
        </div>

        {/* 見出し（記事タイトル） */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: heading.length > 16 ? 70 : 84,
              color: "#0f172a",
              lineHeight: 1.22,
            }}
          >
            {heading}
          </div>
          {sub && (
            <div
              style={{
                marginTop: 24,
                fontSize: 30,
                color: "#475569",
                lineHeight: 1.5,
                display: "flex",
              }}
            >
              {sub.length > 60 ? sub.slice(0, 58) + "…" : sub}
            </div>
          )}
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 28, color: "#64748b" }}>
            無料・登録不要・令和7年対応
          </div>
          <div style={{ fontSize: 30, color: "#10b981" }}>okane-keisan.net</div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Noto Sans JP", data: jp, weight: 700, style: "normal" },
        { name: "Noto Sans JP", data: latin, weight: 700, style: "normal" },
      ],
    },
  );
}
