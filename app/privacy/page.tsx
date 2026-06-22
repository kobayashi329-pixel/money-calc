import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${SITE_NAME}のプライバシーポリシー。アクセス解析・広告・Cookieの取り扱いについて。`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="プライバシーポリシー" updated="2026年6月22日">
      <p>
        「{SITE_NAME}」（以下「当サイト」）における、利用者の情報の取り扱いについて、以下のとおり定めます。
      </p>

      <h2>計算データの取り扱い</h2>
      <p>
        当サイトの各計算ツールの計算処理は、<strong>すべて利用者のブラウザ内（クライアントサイド）で完結</strong>
        します。入力された年収・家族構成などの数値が、当サイトのサーバーや第三者に送信・保存されることは
        <strong>ありません</strong>。
      </p>

      <h2>アクセス解析ツールについて</h2>
      <p>
        当サイトでは、サイトの利用状況を把握するために Google が提供するアクセス解析ツール
        「Google アナリティクス」を使用しています。Google アナリティクスはデータ収集のために
        <strong>Cookie</strong> を使用し、訪問者数・閲覧ページ・利用環境などの情報を
        <strong>個人を特定しない形</strong>で収集します。
      </p>
      <ul>
        <li>収集される情報に氏名・住所・メールアドレスなどの個人情報は含まれません。</li>
        <li>この収集はブラウザの設定で Cookie を無効にすることで拒否できます。</li>
        <li>詳細は <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google のポリシーと規約</a> をご覧ください。</li>
      </ul>

      <h2>広告について</h2>
      <p>
        当サイトでは将来的に、第三者配信の広告サービス（Google AdSense など）を利用する場合があります。
        この場合、広告配信事業者は利用者の興味に応じた広告を表示するために <strong>Cookie</strong> を
        使用することがあります。利用者は <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">広告設定</a> で
        パーソナライズ広告を無効にできます。また、当サイトでは商品・サービスを紹介する
        アフィリエイトプログラムを利用する場合があります。
      </p>

      <h2>免責事項</h2>
      <p>
        当サイトの計算結果・掲載情報は概算・参考情報であり、正確性・完全性を保証するものではありません。
        詳しくは<Link href="/disclaimer">免責事項</Link>をご確認ください。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        本ポリシーに関するお問い合わせは<Link href="/contact">お問い合わせ</Link>ページよりお願いいたします。
      </p>

      <h2>改定について</h2>
      <p>
        本ポリシーは、必要に応じて改定することがあります。改定後の内容は当ページに掲載した時点で効力を生じます。
      </p>
    </LegalLayout>
  );
}
