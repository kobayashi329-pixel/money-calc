import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE_NAME, SITE_LAST_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "計算の根拠・出典一覧",
  description: `${SITE_NAME}の各計算機が根拠とする公的資料（国税庁・総務省・日本年金機構・金融庁など）の一覧。どの計算機がどの一次資料に基づくかを明記しています。`,
  alternates: { canonical: "/sources" },
};

type Source = { label: string; url: string; used: string };

const GROUPS: { authority: string; sources: Source[] }[] = [
  {
    authority: "国税庁",
    sources: [
      { label: "No.1410 給与所得控除", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm", used: "年収手取り" },
      { label: "No.1199 基礎控除", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm", used: "年収手取り／ふるさと納税／iDeCo" },
      { label: "No.2260 所得税の税率", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm", used: "年収手取り／退職金／ふるさと納税" },
      { label: "No.1420 退職金を受け取ったとき（退職所得）", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm", used: "退職金" },
      { label: "No.1135 小規模企業共済等掛金控除", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1135.htm", used: "iDeCo" },
      { label: "No.1463 株式等を譲渡したときの課税", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1463.htm", used: "NISA" },
      { label: "No.4152・4155・4158 相続税の計算・税率・配偶者の税額軽減", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4152.htm", used: "相続税" },
      { label: "No.6101 消費税のしくみ／インボイス制度", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6101.htm", used: "消費税" },
      { label: "No.1213 住宅借入金等特別控除（住宅ローン控除）", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1213.htm", used: "繰上返済／借り換え" },
    ],
  },
  {
    authority: "総務省",
    sources: [
      { label: "個人住民税", url: "https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/150790_06.html", used: "年収手取り" },
      { label: "ふるさと納税ポータルサイト（税金の控除について）", url: "https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html", used: "ふるさと納税" },
      { label: "家計調査（家計収支編）", url: "https://www.stat.go.jp/data/kakei/", used: "老後資金" },
    ],
  },
  {
    authority: "日本年金機構",
    sources: [
      { label: "厚生年金保険の保険料", url: "https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html", used: "年収手取り" },
      { label: "令和7年4月分からの年金額等について", url: "https://www.nenkin.go.jp/oshirase/taisetu/2025/202504/040102.html", used: "公的年金 受給見込み額" },
      { label: "報酬比例部分／ねんきんネット", url: "https://www.nenkin.go.jp/n_net/", used: "公的年金 受給見込み額／老後資金" },
    ],
  },
  {
    authority: "国民年金基金連合会（iDeCo公式）",
    sources: [
      { label: "iDeCoの加入資格・掛金（拠出限度額）", url: "https://www.ideco-koushiki.jp/guide/structure.html", used: "iDeCo" },
    ],
  },
  {
    authority: "全国健康保険協会（協会けんぽ）",
    sources: [
      { label: "令和7年度 都道府県毎の保険料率", url: "https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r07/index.html", used: "年収手取り" },
    ],
  },
  {
    authority: "厚生労働省",
    sources: [
      { label: "雇用保険料率（令和7年度）", url: "https://www.mhlw.go.jp/", used: "年収手取り" },
      { label: "iDeCoの拠出限度額の引き上げ等について", url: "https://www.mhlw.go.jp/content/12500000/001620594.pdf", used: "iDeCo" },
    ],
  },
  {
    authority: "金融庁",
    sources: [
      { label: "新しいNISA", url: "https://www.fsa.go.jp/policy/nisa2/about/nisa2024/index.html", used: "NISA" },
    ],
  },
  {
    authority: "文部科学省",
    sources: [
      { label: "子供の学習費調査", url: "https://www.mext.go.jp/b_menu/toukei/chousa03/gakushuuhi/1268091.htm", used: "教育資金" },
    ],
  },
  {
    authority: "日本政策金融公庫",
    sources: [
      { label: "教育費負担の実態調査", url: "https://www.jfc.go.jp/n/findings/gakind.html", used: "教育資金" },
    ],
  },
];

export default function SourcesPage() {
  return (
    <LegalLayout title="計算の根拠・出典一覧" updated={SITE_LAST_UPDATED}>
      <p>
        「{SITE_NAME}」の各計算機は、以下の<strong>公的機関の一次資料</strong>に基づいて計算ロジックを作成しています。
        制度の根拠と、その資料をどの計算機で用いているかを一覧にしました。コンテンツの作成・検証の方針は
        <Link href="/editorial-policy">編集・運営方針</Link>をご覧ください。
      </p>

      {GROUPS.map((g) => (
        <section key={g.authority}>
          <h2>{g.authority}</h2>
          <ul>
            {g.sources.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
                <span className="text-slate-400">（{s.used}）</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-xs text-slate-400">
        ※ 各リンク先は外部サイト（公的機関）です。制度・金額は改正により変わることがあります。
        最新の情報は各機関の公式サイトでご確認ください。
      </p>
    </LegalLayout>
  );
}
