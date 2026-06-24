"use client";

// AdSense 広告枠。承認後に lib/site.ts の ADS_ENABLED=true ＋ slot ID を設定すると表示される。
// それまで（または slot 未設定）は何も描画しない＝審査・UX・CLSに影響なし。
// CLS対策として表示時は最小高さを予約し、「スポンサーリンク」表記でコンテンツと区別する。
import { useEffect, useRef } from "react";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/site";

type Props = {
  /** AdSense 広告ユニットの slot ID（data-ad-slot） */
  slot: string;
  /** data-ad-format（auto / fluid など） */
  format?: string;
  /** ネイティブ／インフィード用の data-ad-layout-key 等を使う場合のレイアウト */
  layout?: string;
  /** 予約する最小高さ(px)。CLS対策。 */
  minHeight?: number;
};

function AdUnit({ slot, format = "auto", layout, minHeight = 280 }: Props) {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* スクリプト未読込時などは無視 */
    }
  }, []);

  return (
    <div className="my-6" style={{ minHeight }}>
      <div className="mb-1 text-center text-[10px] text-slate-400">スポンサーリンク</div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdSlot(props: Props) {
  // 広告OFF、または slot 未設定なら何も描画しない
  if (!ADS_ENABLED || !props.slot) return null;
  return <AdUnit {...props} />;
}
