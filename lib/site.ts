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
