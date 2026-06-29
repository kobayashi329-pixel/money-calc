import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

const W = 1200;
const H = 680;

function loadFonts() {
  const jp = readFileSync(join(process.cwd(), "assets", "NotoSansJP-jp-700.woff"));
  const latin = readFileSync(
    join(process.cwd(), "assets", "NotoSansJP-latin-700.woff"),
  );
  return [
    { name: "Noto Sans JP", data: jp, weight: 700 as const, style: "normal" as const },
    { name: "Noto Sans JP", data: latin, weight: 700 as const, style: "normal" as const },
  ];
}

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        padding: "56px 64px",
        fontFamily: "Noto Sans JP",
      }}
    >
      <div style={{ fontSize: 44, color: "#0f172a", marginBottom: 36 }}>{title}</div>
      <div style={{ display: "flex", flex: 1 }}>{children}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          fontSize: 24,
          color: "#10b981",
          marginTop: 16,
        }}
      >
        okane-keisan.net
      </div>
    </div>
  );
}

// 複利で資産が増える（毎月3万円・年5%）
function fukuri() {
  const bars = [
    { label: "10年", principal: 360, gain: 106 },
    { label: "20年", principal: 720, gain: 513 },
    { label: "30年", principal: 1080, gain: 1417 },
  ];
  const max = 2497;
  const areaH = 420;
  return (
    <Frame title="複利で資産が増える（毎月3万円・年5%で運用）">
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {/* 凡例 */}
        <div style={{ display: "flex", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", marginRight: 40 }}>
            <div style={{ width: 26, height: 26, background: "#cbd5e1", borderRadius: 6, marginRight: 10 }} />
            <div style={{ fontSize: 26, color: "#475569" }}>元本</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 26, height: 26, background: "#10b981", borderRadius: 6, marginRight: 10 }} />
            <div style={{ fontSize: 26, color: "#475569" }}>運用益（非課税）</div>
          </div>
        </div>
        {/* バー */}
        <div style={{ display: "flex", alignItems: "flex-end", height: areaH }}>
          {bars.map((b) => {
            const ph = Math.round((b.principal / max) * areaH);
            const gh = Math.round((b.gain / max) * areaH);
            return (
              <div
                key={b.label}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}
              >
                <div style={{ fontSize: 30, color: "#059669", marginBottom: 8 }}>
                  {`約${(b.principal + b.gain).toLocaleString()}万円`}
                </div>
                <div style={{ display: "flex", flexDirection: "column", width: 150 }}>
                  <div style={{ height: gh, background: "#10b981", borderRadius: "10px 10px 0 0" }} />
                  <div style={{ height: ph, background: "#cbd5e1" }} />
                </div>
                <div style={{ fontSize: 30, color: "#334155", marginTop: 12 }}>{b.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}

// ふるさと納税の控除のしくみ
function furusatoShikumi() {
  // 寄付6万円の例（年収500万・独身の概算イメージ）
  const segs = [
    { label: "自己負担", value: 2000, color: "#94a3b8" },
    { label: "所得税からの控除", value: 6000, color: "#f59e0b" },
    { label: "住民税 基本分", value: 6000, color: "#3b82f6" },
    { label: "住民税 特例分", value: 46000, color: "#8b5cf6" },
  ];
  const total = segs.reduce((s, x) => s + x.value, 0);
  return (
    <Frame title="ふるさと納税の控除のしくみ（寄付6万円の例）">
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ fontSize: 28, color: "#475569", marginBottom: 22 }}>
          寄付した6万円のうち、自己負担は実質2,000円だけ。残りは税金から控除されます。
        </div>
        {/* 横積み上げバー */}
        <div style={{ display: "flex", width: "100%", height: 120, borderRadius: 14, overflow: "hidden" }}>
          {segs.map((s) => (
            <div
              key={s.label}
              style={{
                width: `${(s.value / total) * 100}%`,
                background: s.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 24,
              }}
            >
              {s.value >= 6000 ? `${(s.value / 10000).toFixed(1)}万` : "2千"}
            </div>
          ))}
        </div>
        {/* 凡例 */}
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 28 }}>
          {segs.map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", marginRight: 40, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, background: s.color, borderRadius: 6, marginRight: 10 }} />
              <div style={{ fontSize: 26, color: "#334155" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// 年収の壁
function nenshuKabe() {
  const walls = [
    { v: "100万", t: "住民税" },
    { v: "106万", t: "社会保険※" },
    { v: "130万", t: "社会保険（扶養外）" },
    { v: "150万", t: "配偶者特別控除" },
    { v: "160万", t: "所得税（2025〜）" },
  ];
  const colors = ["#38bdf8", "#fb923c", "#ef4444", "#a78bfa", "#34d399"];
  return (
    <Frame title="年収の壁（パート・扶養内で働く人の目安）">
      <div style={{ display: "flex", width: "100%", alignItems: "stretch" }}>
        {walls.map((w, i) => (
          <div
            key={w.v}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0 8px",
            }}
          >
            <div style={{ fontSize: 40, color: "#0f172a" }}>{w.v}</div>
            <div style={{ width: "100%", height: 16, background: colors[i], borderRadius: 8, margin: "16px 0" }} />
            <div style={{ fontSize: 24, color: "#475569", textAlign: "center", display: "flex" }}>{w.t}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

const FIGS: Record<string, () => React.ReactElement> = {
  fukuri,
  "furusato-shikumi": furusatoShikumi,
  "nenshu-kabe": nenshuKabe,
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const render = FIGS[key];
  if (!render) {
    return new Response("Not found", { status: 404 });
  }
  return new ImageResponse(render(), { width: W, height: H, fonts: loadFonts() });
}
