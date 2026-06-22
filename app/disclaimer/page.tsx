import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "免責事項",
  description: `${SITE_NAME}の免責事項。計算結果・掲載情報の利用に関する注意事項。`,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="免責事項" updated="2026年6月22日">
      <h2>計算結果について</h2>
      <p>
        当サイト「{SITE_NAME}」の各計算ツールが算出する金額は、わかりやすさを優先した
        <strong>概算</strong>です。実際の税額・社会保険料・返済額などは、以下のような要因により
        計算結果と異なる場合があります。
      </p>
      <ul>
        <li>お住まいの自治体ごとの料率・控除の違い</li>
        <li>社会保険料の標準報酬月額の等級区分</li>
        <li>配偶者控除・特定扶養控除・生命保険料控除・医療費控除・住宅ローン控除などの各種控除</li>
        <li>賞与の有無や支給回数、年の途中での就職・退職</li>
        <li>税制・社会保険制度の改正</li>
      </ul>

      <h2>情報の正確性</h2>
      <p>
        当サイトは公的資料に基づき正確な情報の提供に努めていますが、その正確性・完全性・最新性を
        保証するものではありません。制度改正への対応に時間差が生じる場合もあります。
      </p>

      <h2>免責</h2>
      <p>
        当サイトの計算結果・掲載情報を利用したことにより生じたいかなる損害についても、運営者は
        一切の責任を負いません。重要な金銭的判断を行う際は、必ず税理士・社会保険労務士・
        ファイナンシャルプランナーなどの専門家、または国税庁・各自治体などの公的機関にご確認ください。
      </p>

      <h2>外部リンク</h2>
      <p>
        当サイトからリンクする外部サイトの内容については、運営者は責任を負いません。
      </p>

      <p>
        ご不明な点は<Link href="/contact">お問い合わせ</Link>ページよりご連絡ください。
      </p>
    </LegalLayout>
  );
}
