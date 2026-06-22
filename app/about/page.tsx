import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { OPERATOR_NAME, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "運営者情報",
  description: `${SITE_NAME}の運営者情報・運営方針・情報の正確性に対する考え方について。`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <LegalLayout title="運営者情報" updated="2026年6月22日">
      <h2>運営者</h2>
      <p>
        <strong>{OPERATOR_NAME}</strong>（個人運営）
      </p>

      <h2>サイトの目的</h2>
      <p>
        「{SITE_NAME}」は、年収手取り・住宅ローン・ふるさと納税・NISA/iDeCoなど、
        暮らしのお金にまつわる計算を、<strong>誰でもかんたんに・正確に</strong>
        試算できることを目指したツール集です。専門知識がなくても、必要な数字を入れるだけで
        税金や社会保険料の内訳まで分かるように設計しています。
      </p>

      <h2>情報の正確性へのこだわり</h2>
      <p>
        お金の計算は、間違った金額を出すと利用者に不利益を与えかねません。そのため当サイトでは、
        計算ロジックを次の方針で作成・運用しています。
      </p>
      <ul>
        <li>税・社会保険の計算は、国税庁・総務省・全国健康保険協会（協会けんぽ）・日本年金機構・厚生労働省などの<strong>公的資料を出典</strong>とする。</li>
        <li>各計算ロジックに<strong>適用年度</strong>を明記し、税制改正に追従する（現在は令和7年＝2025年に対応）。</li>
        <li>既知の正解値との照合<strong>テスト</strong>で検証する。</li>
        <li>各ツールに計算の前提・注意点・出典を明記する。</li>
      </ul>
      <p>
        それでも本サイトの計算結果は<strong>概算</strong>です。詳しくは
        <Link href="/disclaimer">免責事項</Link>をご確認ください。
      </p>

      <h2>プライバシーについて</h2>
      <p>
        各計算ツールの計算は、すべてあなたの端末（ブラウザ）内で完結します。入力した年収などの数値が
        サーバーに送信・保存されることはありません。詳しくは
        <Link href="/privacy">プライバシーポリシー</Link>をご覧ください。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        ご意見・誤りのご指摘などは<Link href="/contact">お問い合わせ</Link>ページよりお願いいたします。
      </p>
    </LegalLayout>
  );
}
