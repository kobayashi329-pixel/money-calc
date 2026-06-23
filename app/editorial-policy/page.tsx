import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE_NAME, SITE_LAST_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "編集・運営方針",
  description: `${SITE_NAME}が、計算ロジックと解説をどのように作成・検証・更新しているかの編集方針。公的資料に基づく正確性へのこだわりと訂正方針について。`,
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <LegalLayout title="編集・運営方針" updated={SITE_LAST_UPDATED}>
      <p>
        「{SITE_NAME}」は、お金（YMYL）に関わる情報を扱うサイトとして、
        計算結果と解説の<strong>正確性・透明性</strong>を最優先に運営しています。
        本ページでは、コンテンツをどのように作成・検証・更新しているかをご説明します。
      </p>

      <h2>コンテンツ作成のプロセス</h2>
      <p>各計算機と解説記事は、次の手順で作成しています。</p>
      <ul>
        <li>
          <strong>一次情報の確認</strong>：国税庁・総務省・日本年金機構・全国健康保険協会（協会けんぽ）・
          厚生労働省・金融庁・文部科学省などの<strong>公的資料</strong>を確認します。
        </li>
        <li>
          <strong>計算ロジックの実装</strong>：確認した制度に基づき計算式を実装し、
          ソースコードに<strong>出典と適用年度</strong>を明記します。
        </li>
        <li>
          <strong>テストによる検証</strong>：既知の正解値や公的機関の計算例と照合する
          <strong>自動テスト</strong>でロジックを検証します。
        </li>
        <li>
          <strong>解説と注意点の明記</strong>：各ページに計算の前提・注意点・出典を記載し、
          利用者が結果の意味と限界を理解できるようにします。
        </li>
      </ul>
      <p>
        各計算機がどの公的資料に基づいているかは、
        <Link href="/sources">計算の根拠・出典一覧</Link>にまとめています。
      </p>

      <h2>正確性の担保と「概算」であること</h2>
      <p>
        できる限り正確な計算を心がけていますが、本サイトの結果は<strong>概算</strong>です。
        実際の金額は、お住まいの自治体の料率、個別の控除、勤務先の制度などにより変わります。
        重要な判断の際は、税理士・社会保険労務士・ファイナンシャルプランナーなどの専門家や、
        税務署・年金事務所などの公的機関にご確認ください。詳しくは
        <Link href="/disclaimer">免責事項</Link>をご覧ください。
      </p>

      <h2>更新方針（法改正への追従）</h2>
      <ul>
        <li>料率・控除額などは<strong>年度ごとの定数</strong>として管理し、税制改正に追従します。</li>
        <li>適用年度を各計算機に明記します（現在は令和7年＝2025年に対応）。</li>
        <li>制度改正の施行時期に注意し、<strong>施行前の制度を先取りして反映しない</strong>方針です（例：施行予定だが未施行の改正は注記にとどめる）。</li>
      </ul>

      <h2>訂正方針</h2>
      <p>
        計算や記述に誤りが見つかった場合は、確認のうえ速やかに修正します。
        誤りのご指摘は<Link href="/contact">お問い合わせ</Link>よりお寄せください。利用者からのご指摘は、
        正確性を高めるうえで重要な情報として活用します。
      </p>

      <h2>広告・アフィリエイトについて</h2>
      <p>
        本サイトは、運営費をまかなうため広告・アフィリエイトプログラムを利用する場合があります。
        ただし、<strong>計算ロジックや解説の内容は広告主の影響を受けません</strong>。計算結果は公的資料に基づき、
        中立に算出しています。広告と本文は明確に区別して表示します。
      </p>

      <h2>プライバシー</h2>
      <p>
        各計算ツールの計算は、すべて利用者の端末（ブラウザ）内で完結し、入力値はサーバーに送信・保存されません。
        詳しくは<Link href="/privacy">プライバシーポリシー</Link>をご覧ください。
      </p>
    </LegalLayout>
  );
}
