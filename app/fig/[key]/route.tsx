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

// 縦棒グラフの共通描画（単色）
function vbars(
  title: string,
  items: { label: string; value: number; display: string }[],
  color: string,
  max: number,
) {
  const areaH = 420;
  return (
    <Frame title={title}>
      <div style={{ display: "flex", alignItems: "flex-end", height: areaH, width: "100%" }}>
        {items.map((it) => (
          <div
            key={it.label}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}
          >
            <div style={{ fontSize: 28, color: "#059669", marginBottom: 8, display: "flex" }}>
              {it.display}
            </div>
            <div
              style={{
                width: 120,
                height: Math.max(4, Math.round((it.value / max) * areaH)),
                background: color,
                borderRadius: "10px 10px 0 0",
              }}
            />
            <div style={{ fontSize: 26, color: "#334155", marginTop: 12, display: "flex" }}>
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// 手取りの内訳（年収500万円）
function tedoriUchiwake() {
  const segs = [
    { label: "手取り", value: 391, color: "#10b981" },
    { label: "社会保険料", value: 73, color: "#94a3b8" },
    { label: "所得税", value: 12, color: "#f59e0b" },
    { label: "住民税", value: 24, color: "#3b82f6" },
  ];
  const total = 500;
  return (
    <Frame title="年収500万円の手取りの内訳">
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ fontSize: 28, color: "#475569", marginBottom: 22, display: "flex" }}>
          額面500万円から税金・社会保険料を引いた手取りは約391万円です。
        </div>
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
              {s.value >= 40 ? `${s.value}万` : ""}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 28 }}>
          {segs.map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", marginRight: 40, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, background: s.color, borderRadius: 6, marginRight: 10 }} />
              <div style={{ fontSize: 26, color: "#334155", display: "flex" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// 会社員の年金（基礎＋厚生・年額・年収別）
function nenkin2kai() {
  const items = [
    { label: "年収300万", kiso: 83, kousei: 66 },
    { label: "年収500万", kiso: 83, kousei: 110 },
    { label: "年収700万", kiso: 83, kousei: 154 },
  ];
  const max = 237;
  const areaH = 380;
  return (
    <Frame title="会社員がもらえる年金（年額・40年加入の目安）">
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ display: "flex", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", marginRight: 40 }}>
            <div style={{ width: 26, height: 26, background: "#fbbf24", borderRadius: 6, marginRight: 10 }} />
            <div style={{ fontSize: 26, color: "#475569", display: "flex" }}>基礎年金</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 26, height: 26, background: "#10b981", borderRadius: 6, marginRight: 10 }} />
            <div style={{ fontSize: 26, color: "#475569", display: "flex" }}>厚生年金</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", height: areaH }}>
          {items.map((it) => (
            <div key={it.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ fontSize: 28, color: "#059669", marginBottom: 8, display: "flex" }}>
                {`約${it.kiso + it.kousei}万円`}
              </div>
              <div style={{ display: "flex", flexDirection: "column", width: 140 }}>
                <div style={{ height: Math.round((it.kousei / max) * areaH), background: "#10b981", borderRadius: "10px 10px 0 0" }} />
                <div style={{ height: Math.round((it.kiso / max) * areaH), background: "#fbbf24" }} />
              </div>
              <div style={{ fontSize: 26, color: "#334155", marginTop: 12, display: "flex" }}>{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// iDeCoの3つの税制優遇
function ideco3yuugu() {
  const steps = [
    { n: "①拠出時", t: "掛金が全額所得控除", c: "#10b981" },
    { n: "②運用時", t: "運用益が非課税", c: "#3b82f6" },
    { n: "③受取時", t: "退職所得控除・公的年金等控除", c: "#8b5cf6" },
  ];
  return (
    <Frame title="iDeCoの3つの税制優遇">
      <div style={{ display: "flex", width: "100%", alignItems: "stretch" }}>
        {steps.map((s) => (
          <div
            key={s.n}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              margin: "0 12px",
              border: `4px solid ${s.c}`,
              borderRadius: 20,
              padding: "32px 22px",
            }}
          >
            <div style={{ fontSize: 36, color: s.c, marginBottom: 18, display: "flex" }}>{s.n}</div>
            <div style={{ fontSize: 28, color: "#334155", display: "flex" }}>{s.t}</div>
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
  "tedori-uchiwake": tedoriUchiwake,
  "nenkin-2kai": nenkin2kai,
  "ideco-3yuugu": ideco3yuugu,
  "jutaku-hensai": () =>
    vbars(
      "住宅ローンの毎月返済額（金利1%・35年）",
      [
        { label: "1000万", value: 28229, display: "2.8万円" },
        { label: "2000万", value: 56457, display: "5.6万円" },
        { label: "3000万", value: 84686, display: "8.5万円" },
        { label: "4000万", value: 112914, display: "11.3万円" },
        { label: "5000万", value: 141143, display: "14.1万円" },
      ],
      "#10b981",
      141143,
    ),
  "taishoku-kojo": () =>
    vbars(
      "退職金の非課税枠（退職所得控除）",
      [
        { label: "勤続20年", value: 800, display: "800万円" },
        { label: "勤続30年", value: 1500, display: "1,500万円" },
        { label: "勤続38年", value: 2060, display: "2,060万円" },
      ],
      "#8b5cf6",
      2060,
    ),
  "sozoku-kiso": () =>
    vbars(
      "相続税の基礎控除（これ以下なら相続税は非課税）",
      [
        { label: "相続人1人", value: 3600, display: "3,600万円" },
        { label: "相続人2人", value: 4200, display: "4,200万円" },
        { label: "相続人3人", value: 4800, display: "4,800万円" },
      ],
      "#3b82f6",
      4800,
    ),
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
