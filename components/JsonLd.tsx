// 構造化データ（JSON-LD）を埋め込む共通コンポーネント。SEO用。
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // 構造化データはビルド時に確定する静的オブジェクトのみ渡す
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
