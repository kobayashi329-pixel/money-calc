# 引き継ぎドキュメント（money-calc）

> 新しいセッションはこのファイルと `CLAUDE.md`、元ブリーフ（`Downloads/money-calculator-brief.md`）を読めば全体を把握できます。
> 最終更新: 2026-06-23

## 0. プロジェクトの目的

日本のユーザー向け「お金の計算機」を多数集約する**ハブ&スポーク型サイト**。YMYL（お金）領域でSEO集客し、
**金融アフィリエイト（主柱）＋AdSense（補助）**で収益化する。集客の入口＝手取り計算機、収益エンジン＝住宅ローン・NISA。

## 1. 技術スタック

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + MDX、テストは Vitest
- **計算は全てクライアント側（SSG）で完結**。サーバー処理なし＝サーバー代ゼロ。
- ⚠️ Next.js 16は破壊的変更あり。`AGENTS.md` の指示通り、必要時 `node_modules/next/dist/docs/` を参照。

## 2. 公開状況（本番）

| 項目 | 値 |
|---|---|
| 本番URL | **https://www.okane-keisan.net** （apexは308でwwwへ転送） |
| GitHub | `kobayashi329-pixel/money-calc`（**Public**）→ Vercel(Hobby) 自動デプロイ |
| GA4 | 測定ID **G-WYDWKD2XPC**（`@next/third-parties`） |
| Search Console | **ドメインプロパティ** `okane-keisan.net`（TXT確認済み）、sitemap送信済み |
| AdSense | **未申請**（計算機2本＋信頼性ページ揃い、申請可能な段階） |
| ドメイン | お名前.com取得。NS=01〜04.dnsv.jp、A=216.198.79.1、www CNAME=cname.vercel-dns.com |

`git push` するだけで本番自動デプロイ。コマンド: `npm run dev` / `npm test`（41件）/ `npm run build`。

## 3. 公開済みの計算機（3本）

1. **`/tedori` 年収手取り計算機**
   - 令和7年(2025)改正対応。所得税・住民税・社会保険料・手取りを内訳＋ドーナツで表示。
   - 精度の差別化: ①**都道府県別**の協会けんぽ健康保険料率（47件）②**前年収入**オプションで住民税を前年所得ベースに ③超かんたん入力（年収だけで即結果、年齢・扶養・前年収入・都道府県は「詳細設定」折りたたみ）
   - 結果表示: 手取り年収 ＋ その下に手取り月収（年収÷12・賞与込み目安）＋手取り率
2. **`/jutaku-loan` 住宅ローンシミュレータ**
   - 元利均等／元金均等。毎月返済額・総返済額・利息総額＋元本/利息ドーナツ＋残高推移グラフ。
3. **`/furusato-nozei` ふるさと納税 上限額シミュレータ**（2026-06-23 公開）
   - 自己負担2,000円で全額控除される寄付上限額の目安を計算。控除内訳（所得税還付／住民税基本分／特例分／自己負担）をドーナツ＋表で表示。
   - **手取り計算機のロジックを再利用**（`lib/furusato/calculate.ts` が `lib/takehome/calculate.ts` の `employmentIncome`/`calcSocialInsurance`/`calcIncomeTax`/`calcResidentTax` を呼ぶ）。
   - 計算式（総務省）: `上限額 = 住民税所得割額 × 20% ÷ (90% − 所得税の限界税率 × 1.021) + 2,000`。特例分は住民税所得割の20%が上限、という制度の逆算。
   - 検証: 公知の目安と一致（年収500万独身=61,000円／配偶者あり=50,000円、300万=28,000円、700万=108,000円）。テスト15件。
   - 入力: 年収＋配偶者（上限に大きく効くのでトップ階層）。扶養・都道府県・年齢は詳細設定に折りたたみ。配偶者控除は一般扶養と同額のため `effectiveDependents = dependents + (hasSpouse?1:0)` で既存ロジックに渡す近似。

## 4. アーキテクチャ（重要）

- **`lib/calculators.ts`＝計算機レジストリ（単一の真実）**。ここに1エントリ追加し `status:"live"` にするだけで、
  トップpage・sitemap・カテゴリpage・各ページの「関連する計算機」内部リンク・パンくずが**自動配線**される。
  → リンクジュースを集客(手取り)→収益(住宅ローン/NISA)へ流す設計。`related` で内部リンクを制御。
- カテゴリ: kyuyo/loan/zei/toshi/nenkin。URLは計算機=フラットなローマ字スラッグ、カテゴリ=`/c/<slug>`。
- 信頼性ページ: `/about`(運営者情報) `/privacy` `/disclaimer` `/contact`（フッター＋sitemap収録）。
  運営者名・連絡先は `lib/site.ts` の `OPERATOR_NAME="おかね計算ラボ"` `CONTACT_EMAIL` を編集すれば変わる（要差し替え）。
- SEO: 各計算機にWebApplication/BreadcrumbList、トップにWebSiteのJSON-LD。`app/sitemap.ts`・`app/robots.ts` はレジストリ駆動。

## 5. 主要ファイル

- 計算ロジック: `lib/takehome/`（calculate.ts / constants-2025.ts / prefectures-2025.ts / types.ts / *.test.ts）、`lib/loan/`（calculate.ts / *.test.ts）
- レジストリ: `lib/calculators.ts` / サイト定数: `lib/site.ts` / 表示整形: `lib/format.ts`
- UI: `components/`（TakeHomeCalculator / LoanCalculator / DonutChart / Breadcrumbs / RelatedCalculators / JsonLd）
- 記事: `content/tedori.mdx` `content/jutaku-loan.mdx`（各1500字以上・出典・免責）
- ページ: `app/tedori` `app/jutaku-loan` `app/c/[slug]` `app/about|privacy|disclaimer|contact` `app/page.tsx`

## 6. 計算精度のルール（厳守）

- 必ず**公的資料を出典**（国税庁・総務省・協会けんぽ・日本年金機構・厚労省）。ロジックに**出典コメント＋適用年度**。
- 料率・控除額は**年度別の定数ファイル**に分離（`*-2025.ts`）。税制改正に追従。
- **テストで既知の正解値と照合**。免責表示を画面に明記。
- 非自明な設計判断:
  - 適用年度=**令和7年(2025)**。給与所得控除 最低保障55→**65万**、所得税 基礎控除58万＋**R7・R8限定**上乗せ（132万以下95万等）。**令和9年以降は別テーブルが必要**。
  - **住民税の基礎控除は43万で据え置き**（所得税の58万系と別管理）。住民税は前年所得ベース（`priorYearIncome`）。
  - 社会保険料は**近似**（標準報酬月額の等級を厳密に引かず、年収÷12に上限適用し料率を乗じる）。健保は都道府県別（既定 東京9.91%）。
  - 扶養は「16歳以上の一般扶養」一律（配偶者・特定扶養・16歳未満は未対応）。

## 7. ハマりどころ（再発防止メモ）

- **Vercel Hobby ＋ Privateリポジトリ**: コミット作者がVercelアカウント本人(GitHub)でないとデプロイがBlockされる。
  当初 git作者を `gmotech.jp` にしていて全デプロイがBlock→本番が初回コミットで固着。**Public化で解消**。
  Privateに戻す場合は git作者メールをGitHubアカウント紐付けのものにする必要あり。
- **MDXのCJK太字**: `）**が` のように全角括弧の直後に閉じ`**`があると太字が効かない。閉じ`**`を括弧の前に置く。
  GFMテーブルは `remark-gfm`（Turbopackでは文字列指定 `[["remark-gfm"]]`）。
- **お名前.com**: ドメインプロテクション(有料)を誤購入済み（返金問い合わせ中・サイト動作には無関係）。
  DNSレコード追加時は「追加」ボタンを押して一覧に出してから確認画面へ。パーキング用Aレコード(157.7.x)が混入しないよう注意。
- **住民税のタイムラグ**: 前年所得課税のため、収入が大きく増減した年は給与明細と乖離する（バグではない）。`priorYearIncome`で対応。

## 8. 次の候補（ロードマップ）

1. ~~ふるさと納税 上限額シミュレータ~~ ✅ **2026-06-23 公開済み**（`/furusato-nozei`）
2. NISA / iDeCo 積立シミュレータ（証券口座アフィ）← 次の優先。iDeCoは手取り計算機ロジックの再利用で節税額を出せる
3. **AdSense申請**（計算機3本＋信頼性ページ揃い、申請可能な段階）
4. 住宅ローンに繰上返済・借換え比較を追加
5. 各結果画面に**文脈連動アフィリエイト枠**（手取り→転職、住宅ローン→ローン比較、ふるさと納税→寄付ポータル、NISA→証券）を設置

新しい計算機は: `lib/<name>/calculate.ts`＋テスト → `components/<Name>Calculator.tsx` → `app/<slug>/page.tsx` → `content/<slug>.mdx` → `lib/calculators.ts` に登録(status:"live") の流れ。レジストリ登録で内部リンク・sitemapは自動。
