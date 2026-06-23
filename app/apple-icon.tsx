import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// iOSホーム画面用アイコン（180×180）。
export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const latin = readFileSync(join(process.cwd(), "assets", "NotoSansJP-latin-700.woff"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10b981",
          color: "#ffffff",
          fontSize: 120,
          fontFamily: "Noto Sans JP",
        }}
      >
        ¥
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Noto Sans JP", data: latin, weight: 700, style: "normal" }],
    },
  );
}
