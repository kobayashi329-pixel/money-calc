// サイト全体で使う基本設定。
// 独自ドメインを設定したら SITE_URL をそのドメインに変更する。
export const SITE_URL = "https://www.okane-keisan.net";

export const SITE_NAME = "お金の計算機";

// Google アナリティクス（GA4）の測定ID。
// クライアントに公開される値なので秘密情報ではない。
export const GA_MEASUREMENT_ID = "G-WYDWKD2XPC";

// Google AdSense のパブリッシャーID（ca-pub-...）。公開される値。
// 審査用スニペット・広告配信・ads.txt で使用。
export const ADSENSE_CLIENT = "ca-pub-7264853366083194";

// 広告表示のON/OFF。審査に通り、広告ユニットのslot IDを設定したら true にする。
// false の間は <AdSlot> は何も描画しない（審査・UXに影響なし）。
export const ADS_ENABLED = false;

// 広告ユニットのslot ID（承認後にAdSense管理画面で「広告ユニット」を作成して取得し、ここに貼る）。
// 例: "1234567890"。空のままだと該当位置の広告は表示されない。
export const AD_SLOTS = {
  /** ガイド記事の最初のセクション後（記事内・ネイティブ想定） */
  guideInArticle: "",
  /** ガイド記事の末尾（ディスプレイ／関連コンテンツ） */
  guideEnd: "",
  /** 計算機ページの結果・解説の下（ディスプレイ） */
  calcBottom: "",
};

// ふるさと納税ASP（アフィリエイト）の収益動線。
// 提携が決まったら各 url にアフィリエイトリンクを入れ、FURUSATO_ASP_ENABLED=true にする。
// false の間、または url が空の間は <FurusatoCTA> は何も描画しない（審査・UX・CLSに影響なし）。
export const FURUSATO_ASP_ENABLED = false;

// 表示するふるさと納税サイト（ユーザー利益軸で並べる。報酬順ソートはしない方針）。
export const FURUSATO_ASP: { name: string; feature: string; url: string }[] = [
  { name: "楽天ふるさと納税", feature: "楽天ポイントが貯まる・使える", url: "" },
  { name: "さとふる", feature: "品揃え豊富・配送が早い", url: "" },
  { name: "ふるなび", feature: "家電・金券系の返礼品に強い", url: "" },
];

// 住宅ローン・証券などのアフィリエイト枠（ガイド記事の収益動線）。
// FurusatoCTA と同じフラグ運用：AFFILIATE_ENABLED=false、または url が空の間は
// <AffiliateCTA> は何も描画しない（審査・UX・CLSに影響なし）。
// 提携が決まったら該当スロットの url にアフィリエイトリンクを入れ、ENABLED を true にする。
export const AFFILIATE_ENABLED = false;

export interface AffiliateItem {
  name: string;
  feature: string;
  url: string;
}
export interface AffiliateSlotConfig {
  heading: string;
  note: string;
  items: AffiliateItem[];
}

// カテゴリ等に対応するスロット。items の name/feature は提携先に合わせて書き換える。
export const AFFILIATE_SLOTS: Record<string, AffiliateSlotConfig> = {
  loan: {
    heading: "住宅ローンを比較する",
    note: "金利や諸費用は金融機関で大きく異なります。複数を比較して選びましょう。",
    items: [
      { name: "住宅ローン一括比較", feature: "複数銀行の金利をまとめて比較", url: "" },
      { name: "借り換え診断", feature: "今より下がるか無料でチェック", url: "" },
    ],
  },
  securities: {
    heading: "NISA・iDeCoを始める証券会社",
    note: "手数料や取扱商品は証券会社で異なります。口座開設は無料です。",
    items: [
      { name: "ネット証券（手数料重視）", feature: "売買手数料が安く初心者向け", url: "" },
      { name: "ネット証券（商品数重視）", feature: "投資信託・米国株の取扱が豊富", url: "" },
    ],
  },
};

/** ガイドのカテゴリに対応するアフィリエイトスロット名（無ければ null）。 */
export function affiliateSlotForCategory(category: string): string | null {
  if (category === "loan") return "loan";
  if (category === "toshi") return "securities";
  return null;
}

// 運営者情報（運営者情報ページ・フッターで使用）。
// ハンドルネームでOK。自由に書き換えてください。
export const OPERATOR_NAME = "おかね計算ラボ";
// お問い合わせ先メール。独自ドメインのメール転送 or 任意のアドレスに変更可。
// 空文字にすると、お問い合わせページはGoogleフォーム等の案内表示に切り替わります。
export const CONTACT_EMAIL = "info@okane-keisan.net";
// サイト公開年（フッターのコピーライト用）
export const SITE_LAUNCH_YEAR = 2026;
// サイト全体の最終更新（信頼性ページ等の鮮度表示用）。大きな更新時に変更。
export const SITE_LAST_UPDATED = "2026年6月23日";
