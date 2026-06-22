import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: `${SITE_NAME}へのお問い合わせ方法。計算の誤りのご指摘・ご要望・ご意見はこちらから。`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalLayout title="お問い合わせ" updated="2026年6月22日">
      <p>
        「{SITE_NAME}」をご利用いただきありがとうございます。計算結果の誤りのご指摘、
        新しい計算機のご要望、その他ご意見・ご質問は、以下よりお気軽にお寄せください。
      </p>

      <h2>メールでのお問い合わせ</h2>
      {CONTACT_EMAIL ? (
        <p>
          下記のアドレス宛にメールをお送りください。
          <br />
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold">
            {CONTACT_EMAIL}
          </a>
        </p>
      ) : (
        <p>準備中です。しばらくお待ちください。</p>
      )}

      <h2>お問い合わせ時のお願い</h2>
      <ul>
        <li>計算の誤りをご指摘いただく場合は、対象の計算機名・入力した数値・想定される正しい結果を添えていただけると助かります。</li>
        <li>個別の税務・法務相談にはお答えできません。具体的な手続きは専門家や公的機関にご相談ください。</li>
        <li>内容によっては返信までお時間をいただく、または返信できない場合があります。</li>
      </ul>
    </LegalLayout>
  );
}
