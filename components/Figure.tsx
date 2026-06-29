// 記事内の図解画像（画像検索・理解促進用）。
// /fig/<key> などの画像URLを、レスポンシブ＋CLS対策(width/height)で表示する。
// alt にはターゲットの検索クエリを含める運用。
export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 680,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className="h-auto w-full rounded-xl border border-slate-200 bg-white"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-xs leading-5 text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
