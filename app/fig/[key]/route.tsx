import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

// 画像サイズと、領域分割の固定高さ。
// ヘッダー（タイトル）／本体（チャート）／フッター（サイト名）を罫線で明確に分け、
// チャートは「本体の内寸」を超えないよう VBAR_AREA / STACK_AREA で高さを制限する。
// → タイトル・サイト名がチャートに重ならない／余白も中央寄せで吸収する。
const W = 1200;
const H = 630;
const HEADER_H = 104;
const FOOTER_H = 58;
const VBAR_AREA = 300; // 単色の縦棒グラフのバー領域の高さ
const STACK_AREA = 260; // 凡例つき積み上げグラフのバー領域の高さ

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
        fontFamily: "Noto Sans JP",
      }}
    >
      {/* ヘッダー（タイトル領域） */}
      <div
        style={{
          height: HEADER_H,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 56px",
          borderBottom: "3px solid #d1fae5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div style={{ width: 12, height: 46, background: "#10b981", borderRadius: 6, marginRight: 22, flexShrink: 0 }} />
          <div style={{ fontSize: 38, color: "#0f172a", lineHeight: 1.18, display: "flex" }}>
            {title}
          </div>
        </div>
      </div>

      {/* 本体（チャート領域・縦中央寄せで余白を吸収） */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "18px 56px",
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* フッター（サイト名領域・背景帯＋上罫線で分離） */}
      <div
        style={{
          height: FOOTER_H,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 56px",
          borderTop: "2px solid #e2e8f0",
          background: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 23, color: "#64748b", display: "flex" }}>
          無料・登録不要の計算ツール
        </div>
        <div style={{ fontSize: 26, color: "#10b981", display: "flex" }}>
          おかね計算ラボ｜okane-keisan.net
        </div>
      </div>
    </div>
  );
}

/** 凡例の1項目 */
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginRight: 40 }}>
      <div style={{ width: 26, height: 26, background: color, borderRadius: 6, marginRight: 10 }} />
      <div style={{ fontSize: 26, color: "#475569", display: "flex" }}>{label}</div>
    </div>
  );
}

/** 単色の縦棒グラフ（本体に収まる高さで描画） */
function vbars(
  title: string,
  items: { label: string; value: number; display: string }[],
  color: string,
  max: number,
) {
  return (
    <Frame title={title}>
      <div style={{ display: "flex", alignItems: "flex-end", height: VBAR_AREA + 84, width: "100%" }}>
        {items.map((it) => (
          <div
            key={it.label}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}
          >
            <div style={{ fontSize: 30, color: "#059669", marginBottom: 10, display: "flex" }}>
              {it.display}
            </div>
            <div
              style={{
                width: 120,
                height: Math.max(6, Math.round((it.value / max) * VBAR_AREA)),
                background: color,
                borderRadius: "12px 12px 0 0",
              }}
            />
            <div style={{ fontSize: 28, color: "#334155", marginTop: 14, display: "flex" }}>
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/** 2色の積み上げ縦棒グラフ（凡例つき） */
function stackBars(
  title: string,
  legend: { color: string; label: string }[],
  items: { label: string; lower: number; upper: number }[],
  lowerColor: string,
  upperColor: string,
  max: number,
) {
  return (
    <Frame title={title}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ display: "flex", marginBottom: 20 }}>
          {legend.map((l) => (
            <LegendItem key={l.label} color={l.color} label={l.label} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", height: STACK_AREA + 84 }}>
          {items.map((it) => (
            <div
              key={it.label}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}
            >
              <div style={{ fontSize: 28, color: "#059669", marginBottom: 10, display: "flex" }}>
                {`約${it.lower + it.upper}万円`}
              </div>
              <div style={{ display: "flex", flexDirection: "column", width: 130 }}>
                <div style={{ height: Math.round((it.upper / max) * STACK_AREA), background: upperColor, borderRadius: "12px 12px 0 0" }} />
                <div style={{ height: Math.round((it.lower / max) * STACK_AREA), background: lowerColor }} />
              </div>
              <div style={{ fontSize: 26, color: "#334155", marginTop: 14, display: "flex" }}>
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** 横積み上げバー＋凡例（内訳の可視化） */
function hbar(
  title: string,
  note: string,
  segs: { label: string; value: number; color: string }[],
  showLabelMin: number,
) {
  const total = segs.reduce((s, x) => s + x.value, 0);
  return (
    <Frame title={title}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ fontSize: 28, color: "#475569", marginBottom: 26, display: "flex", lineHeight: 1.5 }}>
          {note}
        </div>
        <div style={{ display: "flex", width: "100%", height: 130, borderRadius: 16, overflow: "hidden" }}>
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
                fontSize: 26,
              }}
            >
              {s.value >= showLabelMin ? `${s.value.toLocaleString()}` : ""}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 30 }}>
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

// ===== 各図 =====

const fukuri = () =>
  stackBars(
    "複利で資産が増える（毎月3万円・年5%で運用）",
    [
      { color: "#cbd5e1", label: "元本" },
      { color: "#10b981", label: "運用益（非課税）" },
    ],
    [
      { label: "10年", lower: 360, upper: 106 },
      { label: "20年", lower: 720, upper: 513 },
      { label: "30年", lower: 1080, upper: 1417 },
    ],
    "#cbd5e1",
    "#10b981",
    2497,
  );

const nenkin2kai = () =>
  stackBars(
    "会社員がもらえる年金（年額・40年加入の目安）",
    [
      { color: "#fbbf24", label: "基礎年金" },
      { color: "#10b981", label: "厚生年金" },
    ],
    [
      { label: "年収300万", lower: 83, upper: 66 },
      { label: "年収500万", lower: 83, upper: 110 },
      { label: "年収700万", lower: 83, upper: 154 },
    ],
    "#fbbf24",
    "#10b981",
    237,
  );

const tedoriUchiwake = () =>
  hbar(
    "年収500万円の手取りの内訳",
    "額面500万円から税金・社会保険料を引いた手取りは約391万円です（単位：万円）。",
    [
      { label: "手取り 391万", value: 391, color: "#10b981" },
      { label: "社会保険料 73万", value: 73, color: "#94a3b8" },
      { label: "所得税 12万", value: 12, color: "#f59e0b" },
      { label: "住民税 24万", value: 24, color: "#3b82f6" },
    ],
    40,
  );

const furusatoShikumi = () =>
  hbar(
    "ふるさと納税の控除のしくみ（寄付6万円の例）",
    "寄付した6万円のうち、自己負担は実質2,000円だけ。残りは税金から控除されます（単位：円）。",
    [
      { label: "自己負担 2,000円", value: 2000, color: "#94a3b8" },
      { label: "所得税からの控除", value: 6000, color: "#f59e0b" },
      { label: "住民税 基本分", value: 6000, color: "#3b82f6" },
      { label: "住民税 特例分", value: 46000, color: "#8b5cf6" },
    ],
    20000,
  );

// 年収の壁
const nenshuKabe = () => {
  const walls = [
    { v: "100万", t: "住民税", c: "#38bdf8" },
    { v: "106万", t: "社会保険※", c: "#fb923c" },
    { v: "130万", t: "社会保険\n（扶養外）", c: "#ef4444" },
    { v: "150万", t: "配偶者特別控除", c: "#a78bfa" },
    { v: "160万", t: "所得税\n（2025〜）", c: "#34d399" },
  ];
  return (
    <Frame title="年収の壁（パート・扶養内で働く人の目安）">
      <div style={{ display: "flex", width: "100%", alignItems: "stretch" }}>
        {walls.map((w) => (
          <div
            key={w.v}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", margin: "0 8px" }}
          >
            <div style={{ fontSize: 44, color: "#0f172a", display: "flex" }}>{w.v}</div>
            <div style={{ width: "100%", height: 18, background: w.c, borderRadius: 9, margin: "18px 0" }} />
            <div style={{ fontSize: 24, color: "#475569", textAlign: "center", display: "flex" }}>{w.t}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// iDeCoの3つの税制優遇
const ideco3yuugu = () => {
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
              justifyContent: "center",
              margin: "0 12px",
              border: `4px solid ${s.c}`,
              borderRadius: 20,
              padding: "34px 24px",
              minHeight: 260,
            }}
          >
            <div style={{ fontSize: 38, color: s.c, marginBottom: 20, display: "flex" }}>{s.n}</div>
            <div style={{ fontSize: 28, color: "#334155", lineHeight: 1.4, display: "flex" }}>{s.t}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

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
  "nisa-waku": () =>
    hbar(
      "新NISAの2つの投資枠（年間の上限）",
      "年間360万円・生涯1,800万円まで投資できます（成長投資枠は最大1,200万円・単位：万円）。",
      [
        { label: "つみたて投資枠 120万", value: 120, color: "#10b981" },
        { label: "成長投資枠 240万", value: 240, color: "#3b82f6" },
      ],
      60,
    ),
  "kyoiku-shinro": () =>
    vbars(
      "大学4年間の費用（進路別の目安）",
      [
        { label: "国公立", value: 240, display: "約240万円" },
        { label: "私立文系", value: 410, display: "約410万円" },
        { label: "私立理系", value: 550, display: "約550万円" },
      ],
      "#10b981",
      550,
    ),
  shohizei: () =>
    hbar(
      "消費税の計算（税抜→税込）",
      "税抜10,000円に消費税10%（1,000円）を足すと、税込11,000円になります（単位：円）。",
      [
        { label: "税抜金額 10,000円", value: 10000, color: "#10b981" },
        { label: "消費税（10%）1,000円", value: 1000, color: "#f59e0b" },
      ],
      1000,
    ),
  "jutaku-shakingaku": () =>
    vbars(
      "年収別の住宅ローン借入可能額（無理のない目安）",
      [
        { label: "年収400万", value: 2720, display: "約2,720万" },
        { label: "年収500万", value: 3400, display: "約3,400万" },
        { label: "年収600万", value: 4080, display: "約4,080万" },
        { label: "年収700万", value: 4760, display: "約4,760万" },
        { label: "年収1000万", value: 6800, display: "約6,800万" },
      ],
      "#10b981",
      6800,
    ),
  "jido-teate": () =>
    vbars(
      "児童手当の月額（子1人あたり・2024年10月〜）",
      [
        { label: "0〜3歳未満", value: 15000, display: "15,000円" },
        { label: "3歳〜高校生", value: 10000, display: "10,000円" },
        { label: "第3子以降", value: 30000, display: "30,000円" },
      ],
      "#f472b6",
      30000,
    ),
  "shitsugyo-hoken": () =>
    vbars(
      "失業保険の受給総額の目安（自己都合・被保険者10年）",
      [
        { label: "月給20万", value: 589920, display: "約59万円" },
        { label: "月給30万", value: 724320, display: "約72万円" },
        { label: "月給40万", value: 799920, display: "約80万円" },
        { label: "月給50万", value: 966600, display: "約97万円" },
      ],
      "#10b981",
      966600,
    ),
  "shussan-teate": () =>
    vbars(
      "出産手当金の受給総額の目安（産前産後98日）",
      [
        { label: "月給20万", value: 435806, display: "約44万円" },
        { label: "月給30万", value: 653366, display: "約65万円" },
        { label: "月給40万", value: 870926, display: "約87万円" },
      ],
      "#f472b6",
      870926,
    ),
  iryouhi: () =>
    vbars(
      "医療費控除で軽減される税金（課税所得500万・税率30%）",
      [
        { label: "医療費20万", value: 30000, display: "約3万円" },
        { label: "医療費30万", value: 60000, display: "約6万円" },
        { label: "医療費50万", value: 120000, display: "約12万円" },
        { label: "医療費100万", value: 270000, display: "約27万円" },
      ],
      "#3b82f6",
      270000,
    ),
  "jutaku-loan-kojo": () =>
    vbars(
      "住宅ローン控除の年間控除額（年末残高×0.7%）",
      [
        { label: "残高2000万", value: 140000, display: "14万円" },
        { label: "残高3000万", value: 210000, display: "21万円" },
        { label: "残高4000万", value: 280000, display: "28万円" },
        { label: "残高5000万", value: 350000, display: "35万円" },
      ],
      "#10b981",
      350000,
    ),
  "zangyo-wari": () =>
    vbars(
      "残業代の割増率（労働基準法）",
      [
        { label: "時間外", value: 25, display: "25%増" },
        { label: "深夜", value: 25, display: "25%加算" },
        { label: "月60時間超", value: 50, display: "50%増" },
        { label: "法定休日", value: 35, display: "35%増" },
      ],
      "#f59e0b",
      50,
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
