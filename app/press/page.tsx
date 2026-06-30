import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { OPERATOR_NAME, SITE_NAME, SITE_URL } from "@/lib/site";
import { liveCalculators } from "@/lib/calculators";
import { liveGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "掲載・引用・リンクについて（プレスキット）",
  description: `${SITE_NAME}は、リンク・引用・埋め込みを自由に行っていただけます。ブログ・メディア向けのサイト概要、計算機の埋め込み方法、運営者情報をまとめたプレスキットです。`,
  alternates: { canonical: "/press" },
};

export default function PressPage() {
  const calcCount = liveCalculators().length;
  const guideCount = liveGuides().length;

  return (
    <LegalLayout title="掲載・引用・リンクについて" updated="2026年6月30日">
      <p>
        「{SITE_NAME}」（運営：{OPERATOR_NAME}）は、ブログ・メディア・SNSなどで
        <strong>自由にリンク・引用・紹介していただけます</strong>。事前のご連絡は不要です。
        読者の役に立つ形でご活用ください。
      </p>

      <h2>サイトの概要</h2>
      <ul>
        <li>サイト名：{SITE_NAME}</li>
        <li>URL：<a href={SITE_URL}>{SITE_URL.replace("https://", "")}</a></li>
        <li>運営：{OPERATOR_NAME}（屋号）</li>
        <li>内容：年収手取り・住宅ローン・ふるさと納税・NISA/iDeCo・相続税・退職金・失業保険・育児休業給付金・残業代など、<strong>{calcCount}種類</strong>の無料計算機と<strong>{guideCount}本</strong>の解説記事</li>
        <li>特長：登録不要・無料。計算はすべてブラウザ内で完結し、入力値は送信されません。公的資料に基づく令和7年（2025年）対応の概算ツールです。</li>
      </ul>

      <h2>リンクの方法</h2>
      <p>
        リンクはトップページ・各計算機・各ガイドのいずれにも自由に設定いただけます。
        アンカーテキストの例：
      </p>
      <ul>
        <li><code>年収手取り計算機｜{SITE_NAME}</code></li>
        <li><code>ふるさと納税の上限額シミュレータ｜{SITE_NAME}</code></li>
      </ul>
      <p>
        各計算機ページの末尾にある「<strong>🔗 このツールを紹介・引用する</strong>」を開くと、
        コピーして使えるリンクHTMLが表示されます。
      </p>

      <h2>計算機の埋め込み（無料）</h2>
      <p>
        計算機は、あなたのサイトに<strong>そのまま埋め込む（iframe）</strong>こともできます。
        記事の文脈に合わせて読者がその場で試算でき、離脱を防げます。各計算機ページの
        「🔗 このツールを紹介・引用する」から埋め込みコードをコピーしてご利用ください。
      </p>
      <p>埋め込みコードの例（年収手取り計算機）：</p>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        <code>{`<iframe src="${SITE_URL}/embed/tedori" width="100%" height="820" style="border:1px solid #e2e8f0;border-radius:12px" title="年収手取り計算機" loading="lazy"></iframe>`}</code>
      </pre>
      <p>
        埋め込み時は、出典として{SITE_NAME}へのリンクを残していただけますようお願いします
        （埋め込みウィジェットには出典リンクが含まれています）。
      </p>

      <h2>早見表・図解の引用</h2>
      <p>
        各ガイドの早見表（年収別・金額別の試算）や図解も、出典を明記のうえ引用いただけます。
        数値はいずれも当サイトの計算ロジックで算出した概算です。引用時は
        「出典：{SITE_NAME}（{SITE_URL.replace("https://", "")}）」のように明記してください。
      </p>

      <h2>取材・お問い合わせ</h2>
      <p>
        掲載のご相談、数値・計算根拠の確認、取材のご依頼などは
        <Link href="/contact">お問い合わせ</Link>ページよりご連絡ください。
        計算の根拠は<Link href="/sources">計算の根拠・出典一覧</Link>、
        運営方針は<Link href="/editorial-policy">編集・運営方針</Link>、
        運営者については<Link href="/about">運営者情報</Link>をご覧ください。
      </p>

      <p>
        ※本サイトの計算結果は概算です。引用・掲載の際は、利用者ご自身での確認を促す旨を
        あわせてお伝えいただけますと幸いです（<Link href="/disclaimer">免責事項</Link>）。
      </p>
    </LegalLayout>
  );
}
