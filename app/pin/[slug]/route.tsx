import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getGuide } from "@/lib/guides";
import { getCalculator, getCategory } from "@/lib/calculators";
import { getGuideTable } from "@/lib/table";

export const runtime = "nodejs";

// Pinterest／SNS向けの縦長シェア画像（/pin/<slug>・1000×1500）。
// ガイドに早見表（表）があればその表を画像化、無ければ訴求カードを描画する。
const SIZE = { width: 1000, height: 1500 };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const calc = getCalculator(slug);

  const title = guide?.shortTitle ?? calc?.shortTitle ?? "お金の計算機";
  const sub = guide?.description ?? calc?.description ?? "";
  const catSlug = guide?.category ?? calc?.category;
  const cat = catSlug ? getCategory(catSlug) : undefined;

  // 早見表（最大8行・最大5列に制限）
  const rawTable = guide ? getGuideTable(slug) : null;
  const table = rawTable
    ? {
        headers: rawTable.headers.slice(0, 5),
        rows: rawTable.rows.slice(0, 8).map((r) => r.slice(0, 5)),
      }
    : null;
  const cols = table ? table.headers.length : 0;
  const cellFont = cols >= 5 ? 26 : cols === 4 ? 30 : 34;

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
          background: "#ffffff",
          padding: "64px 56px",
          fontFamily: "Noto Sans JP",
        }}
      >
        {/* ブランド＋カテゴリ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#10b981",
                color: "#ffffff",
                fontSize: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ¥
            </div>
            <div style={{ marginLeft: 18, fontSize: 32, color: "#0f172a" }}>おかね計算ラボ</div>
          </div>
          {cat && (
            <div
              style={{
                fontSize: 24,
                color: "#059669",
                border: "3px solid #a7f3d0",
                borderRadius: 999,
                padding: "6px 22px",
              }}
            >
              {`${cat.emoji} ${cat.name}`}
            </div>
          )}
        </div>

        {/* タイトル */}
        <div
          style={{
            marginTop: 44,
            fontSize: title.length > 14 ? 64 : 76,
            color: "#0f172a",
            lineHeight: 1.2,
            display: "flex",
          }}
        >
          {title}
        </div>

        {/* 本体：早見表 または 訴求 */}
        {table ? (
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", flex: 1 }}>
            {/* ヘッダー行 */}
            <div style={{ display: "flex", background: "#ecfdf5", borderRadius: "14px 14px 0 0" }}>
              {table.headers.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flex: i === 0 ? 1.3 : 1,
                    padding: "18px 16px",
                    fontSize: cellFont,
                    color: "#065f46",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
            {/* データ行 */}
            {table.rows.map((row, ri) => (
              <div
                key={ri}
                style={{
                  display: "flex",
                  background: ri % 2 === 0 ? "#ffffff" : "#f8fafc",
                  borderTop: "2px solid #e2e8f0",
                }}
              >
                {table.headers.map((_, ci) => (
                  <div
                    key={ci}
                    style={{
                      display: "flex",
                      flex: ci === 0 ? 1.3 : 1,
                      padding: "16px 16px",
                      fontSize: cellFont,
                      color: ci === 0 ? "#0f172a" : "#334155",
                    }}
                  >
                    {row[ci] ?? ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", flex: 1 }}>
            {sub && (
              <div style={{ fontSize: 36, color: "#475569", lineHeight: 1.55, display: "flex" }}>
                {sub.length > 80 ? sub.slice(0, 78) + "…" : sub}
              </div>
            )}
            <div
              style={{
                marginTop: 56,
                alignSelf: "flex-start",
                fontSize: 40,
                color: "#ffffff",
                background: "#10b981",
                borderRadius: 16,
                padding: "20px 44px",
                display: "flex",
              }}
            >
              無料で計算する →
            </div>
          </div>
        )}

        {/* フッター */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 36 }}>
          <div style={{ fontSize: 26, color: "#64748b", display: "flex" }}>無料・登録不要・令和7年対応</div>
          <div style={{ fontSize: 30, color: "#10b981", display: "flex" }}>okane-keisan.net</div>
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
