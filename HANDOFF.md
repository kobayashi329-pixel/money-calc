# 引き継ぎドキュメント（money-calc）

> 新しいセッションはこのファイルと `CLAUDE.md`、元ブリーフ（`Downloads/money-calculator-brief.md`）を読めば全体を把握できます。
> 最終更新: 2026-06-23（消費税・時給換算公開、レジストリ全11本live化）

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

## 3. 公開済みの計算機（20本）

> **住民税・社会保険料・贈与税の3計算機を追加(2026-06-24)**: ✅住民税 `/juuminzei`(kyuyo・年収＋家族構成→所得割10%＋均等割。`lib/juuminzei/`がtakehomeのcalcResidentTax再利用。500万独身=約24.2万。テスト5)・✅社会保険料 `/shahoken`(kyuyo・年収＋年齢→健康/介護/厚生年金/雇用の内訳。calcSocialInsurance再利用。500万=約73.3万。テスト4)・✅贈与税 `/zouyozei`(zei・暦年課税・基礎控除110万＋特例/一般税率の速算表。`lib/zouyo/`新規。500万特例48.5万/一般53万。テスト6)。各ShareButton＋WebApplication JSON-LD＋解説MDX付き。既存の贈与ガイド(zouyozei-*)のtargetsを["zouyozei","sozokuzei"]に、juuminzei-ikuraを["juuminzei","tedori"]に更新しRelatedGuides相互配線。テスト計203。
>
> **税金の新計算機2本を追加(2026-06-24・zeiカテゴリ)**: ✅自動車税 `/jidoshazei`(種別割・総排気量×初度登録の新旧税率・軽自動車・13年超重課。`lib/jidoshazei/`・NORMAL_BANDS税額表・テスト9件)・✅固定資産税 `/kotei-shisanzei`(固定資産税1.4%＋都市計画税0.3%・住宅用地特例[小規模1/6・一般1/3]・新築軽減[建物1/2]。`lib/kotei/`・テスト5件)。各計算機はShareButton(URL共有)＋WebApplication JSON-LD＋解説MDX(content/<slug>.mdx・早見表/計算例)付き。レジストリ(lib/calculators.ts・priority12,13)登録で一覧/sitemap/関連リンク自動配線。検証=2000cc新税率36,000円・固定資産税例176,000円。**相続税/年金深掘り＋新計算機の関連ガイド(2026-06-24・13本)**: ①相続税深掘り(zei・4)=小規模宅地等の特例(sozokuzei-shoukibo-takuchi・最大80%減)・生命保険の非課税枠(sozokuzei-seimei-hoken・500万×法定相続人)・申告期限10か月と必要書類(sozokuzei-shinkoku)・二次相続(sozokuzei-niji)。②公的年金深掘り(nenkin・4)=年収別受給見込み(nenkin-nenshu-betsu master)・厚生年金(nenkin-kousei)・国民年金(nenkin-kokumin)・専業主婦第3号(nenkin-sengyoshufu)。calculateNenkinで実算出(会社員40年: 年収300万月12.4万/500万月16.1万/700万月19.7万、基礎満額月69,308)。③新計算機の関連ガイド=自動車税(jidoshazei-itsumade/jidoshazei-kei)・固定資産税(kotei-heikin/kotei-shinchiku/kotei-itsumade)。新計算機にRelatedGuides自動配線済み。ガイド計121記事。**年収の壁深掘り＋新計算機ガイド(2026-06-29・10本)**: ①年収の壁/扶養(kyuyo・4)=106万円の壁(kabe-106man)・130万円の壁(kabe-130man)・150万/160万の壁(kabe-150man)・扶養はいくらまで(fuyou-ikura)。既存nenshu-no-kabe(2025改正103→160万)と整合、社保の壁の働き損を解説。②新計算機の関連ガイド(6)=住民税はいつから(juuminzei-itsu)・標準報酬月額とは(hyoujun-houshuu)・社会保険料は4〜6月で決まる(shahoken-4-6gatsu)・相続時精算課税(souzoku-seisan-kazei)・贈与税はばれる?(zouyozei-bareru)・親子間の贈与(zouyozei-oyako)。住民税/社会保険料/贈与税の各計算機にRelatedGuides配線。ガイド計131記事。**NISA・投資クラスター深掘り(2026-06-29・7本)**: 既存NISA(年代別/枠/つみたて・成長)と重複しないevergreen高需要=1800万枠いつ埋まる(nisa-1800man)・出口戦略(nisa-deguchi)・デメリット(nisa-demerit)・元本割れ(nisa-genpon-ware)・何を買う(nisa-nani-kau・特定商品推奨せず)・1000万到達(nisa-1000man・accumulateで実算出 月3万18年/5万13年/10万7年)・複利と72の法則(fukuri)。全toshi・targets nisa。ガイド計138記事。**SEO技術改善 1-2-3(2026-06-29)**: SEO監査の最優先3点を全ガイド一括適用。①**FAQPage構造化データ**: `lib/faq.ts`がMDXの「## よくある質問」の###Q/Aをパース→`GuideLayout`が`FAQPage` JSON-LD出力(全138記事自動)。②**Article日付の動的化**: dateModified/datePublishedを`guide.updated`からISO生成(従来"2026-06-23"ハードコード)＋Article `image`・publisher logo・mainEntityOfPage追加。③**記事別アイキャッチ/OGP画像**: `app/og/[slug]/route.tsx`が記事・計算機ごとにImageResponseで動的生成(/og/<slug>・1200x630・ブランド/カテゴリバッジ/タイトル/説明)。Article schema image＋全ガイドのog:image/twitter:imageに使用(画像検索・SNS・Discover流入)。検証=本番/og/<slug>200 image/png・FAQPage質問3件・og:image記事別。**注**: FAQリッチリザルトはGoogleが2023年に権威系サイト限定化したため表示は限定的だが、Bing/AI/セマンティクスに有効。**SEO監査#4 本文図解画像 実装済(2026-06-29)**: `app/fig/[key]/route.tsx`がImageResponseで図解PNG(1200x680)を動的生成=fukuri(複利バー:月3万・年5%で10年466万/20年1233万/30年2497万)・furusato-shikumi(控除のしくみ・横積み上げ)・nenshu-kabe(年収の壁100/106/130/150/160万)。`components/Figure.tsx`(レスポンシブimg+figcaption・width/height指定でCLS対策)をmdx-components.tsxにグローバル登録→全MDXで`<Figure src="/fig/.." alt=".." caption=".."/>`使用可。主要7記事に埋込(alt/captionに検索クエリ)。**図解を計9種に拡大(2026-06-29追加6種)**: tedori-uchiwake(手取り内訳・年収500万)・jutaku-hensai(住宅ローン月返済額・借入額別)・taishoku-kojo(退職所得控除・勤続年数別)・nenkin-2kai(年金2階建て・年収別)・ideco-3yuugu(iDeCo3優遇の3box)・sozoku-kiso(相続基礎控除・相続人数別)。各2記事ずつ計12記事に埋込(手取り/住宅ローン返済/退職金/年金/iDeCo/相続クラスター)。`vbars`/`stackBars`/`hbar`の共通ヘルパーで量産。数値は計算機ロジックで実算出。**レイアウト崩れ対策(2026-06-29・重要)**: タイトルと数値の重なり/サイト名がグラフに侵入/過剰余白を、Frameを3領域に明確分離して根本解決。H=630・HEADER_H=104(下罫線)・FOOTER_H=58(上罫線+背景帯#f8fafc)で固定分離、本体はflex1+justifyContent center+overflow hidden。チャート高さは**本体内寸(約432px)を超えないよう VBAR_AREA=300/STACK_AREA=260 に制限**(チャートブロック≒384-390px)→タイトル・サイト名への侵入が構造的に起きない。新図もこのヘルパー経由なら自動で収まる。**Satori注意**: 複数子divはdisplay:flex必須/テキスト+式は単一文字列化({`約${x}万円`})。新図追加はFIGSにkey追加＋MDXに<Figure>。Figure既定height=630(CLS整合)。**図解計13種・34記事に展開(2026-06-29)**: 追加4種=nisa-waku(新NISA2枠120/240万)・kyoiku-shinro(大学費用 進路別)・shohizei(税抜→税込)・jutaku-shakingaku(年収別の借入可能額)。**画像SEO**: Figureはalt(クエリ入り)・width/height(CLS)・figcaption・loading=lazy済み。**画像サイトマップ追加**: `lib/figures.ts`の`guideFigureUrls`/`calculatorFigureUrls`がMDXから/fig画像URL抽出、`app/sitemap.ts`が各記事URLにimages(OGP/og/<slug>＋本文図解)を付与=計192枚収録(image:image)。新図/新記事は自動でsitemap画像に載る。**SEO監査の残項目 実装済(2026-06-29)**: ①記事内目次(TOC)=`lib/toc.ts`がH2抽出、GuideLayoutが本文上に目次描画(H2≥3の記事のみ)。mdx-components.tsxの<h2>に`headingId`由来のアンカーID(scroll-mt-24)付与で目次#idと本文見出しが一致(SERPジャンプリンク狙い・回遊改善)。②シリーズ前後ナビ=`lib/guides.ts`の`seriesNeighbors`(同guideSeriesKeyをcompareGuides順に並べ前後リンク・内部リンク強化)。③HowTo構造化データ=`lib/howto.ts`が「## ステップN：…」手順記事を抽出しHowTo JSON-LD出力(2ステップ以上のみ・現状furusato-nozei-yarikata/taishokukin-zeikinの2本・誤検出なし)。各HowToStepにname/text/url(見出しアンカー)。**注意=GoogleはHowToリッチリザルトを2023年終了済→Bing/AI/セマンティクス向け**(FAQと同位置づけ)。**計算機OG個別化(2026-06-29)**: 全20計算機ページのmetadataにopenGraph.images=/og/<slug>＋twitter(summary_large_image)を追加(従来サイト共通OGにフォールバックしていた)。app/og/[slug]は計算機も対応済。**HowTo抽出を拡張し2→9記事(2026-06-29)**: lib/howto.tsにパターンB(番号リスト型)を追加。「## 〜の手順/流れ/やり方/申請方法/進め方」等のH2直下の番号リスト(1. 2. …)を各stepに(step名は本文先頭の一文から生成・太字依存をやめた)。対象=ふるさと納税のやり方/ワンストップ/確定申告、退職金の確定申告/税金/計算、相続税の申告手順、共働き節税の進め方など9記事。番号リスト型はstep.url無し。誤検出なし(通常記事は0)。**ガイド一覧をシリーズ再編(2026-06-29・IA改善)**: 138記事の「壁」を解消。lib/guidesに`guideSeriesGroups(categorySlug,threshold=3)`追加=guideSeriesKeyでシリーズ判定し3記事以上は独立グループ(代表記事lead=items[0]をピン留め)・少数/単発はothersへ集約。SERIES_LABELS(nenshu→年収別の手取り等)で見出し名。/guide一覧をスリムカード(emoji＋shortTitle＋1行説明)化し、カテゴリ→シリーズ見出し(＋件数)→記事の3階層に。シリーズ6件超は`<details>`折りたたみ。**URL(/guide/<slug>)・多対多targetリンクは不変=リダイレクト無し・SEO評価維持**(年収系を計算機配下にネストする案は多対多が壊れ移行リスク大のため不採用と判断)。**IA方針メモ**: 計算機=クラスターのピラーは「URL構造」でなく「内部リンク」で実現する。**IA改善C/D実装済(2026-06-29)**: C=ガイド記事のパンくずにカテゴリ階層挿入(ホーム>ガイド>カテゴリ>記事・カテゴリは/guide#<category>へ・BreadcrumbList JSON-LDも4階層に自動更新)。D=lib/guidesに`guideSeriesInfo(slug)`追加(シリーズ判定＋master=早見表📊優先で選定・3記事以上のみ)。GuideLayoutでmaster記事には「📚〜シリーズ」全記事一覧(ハブ)、各spoke記事にはmasterへの「総まとめ」導線を表示=pillar(master)とspokeが双方向に結合。**fix**: guideSeriesKeyで返済額早見表jutaku-hensai-betsuが「jutaku」に誤分類され返済額シリーズ(*-hensai)から外れていたのをendsWith→includes "-hensai"で修正(一覧/関連/ハブで早見表が返済額に合流)。**IA改善B実装済(2026-06-29・計算機ピラー強化)**: components/RelatedGuidesを6件打ち切り→シリーズ別グルーピングで全件表示に変更。lib/guidesに汎用`groupBySeries(guides,threshold)`＋`guidesForCalculatorGrouped`追加(guideSeriesGroupsもこれを使うよう統一)。各シリーズ見出し＋件数・4件超は<details>折りたたみ・スリムカード化。本番=tedori21件/furusato29件/jutaku-loan23件が正しくシリーズ分割表示。money pageにトピック内部リンク集中(計算機自体の順位にも寄与)。**残SEO施策(未実施)**: 図解の追加展開・さらなるクラスター深掘り・ASP提携後CTA有効化。**IA改善A〜D完了**(一覧シリーズ再編/計算機ピラー/パンくず階層/master サブピラー)＝計算機⇔ガイドのhub-and-spoke内部リンク構造が完成。**新計算機4本＋新カテゴリ「手当・給付金」(teate)追加(2026-06-29)**: 全国一律の公式で実装。①失業保険(基本手当)/shitsugyo-hoken(teate)=賃金日額×給付率(50-80%)×給付日数。**令和7年8月改定**の基本手当日額上限(29歳以下7,255/30-44=8,055/45-59=8,870/60-64=7,623)・下限2,411を定数化。給付日数=自己都合(10年未満90/10-20年120/20年〜150)・会社都合(年齢×期間テーブル最大330)。給付率の逓減境界(R80=5,110/R50=12,580)は概算。②育児休業給付金/ikukyu-kyufu(teate)=67%(最初6か月)/50%、支給上限323,811/241,650(R7.8)。③傷病手当金/shoubyo-teate(teate)=標準報酬日額×2/3・待期3日・通算1年6か月。④残業代/zangyodai(**kyuyo**)=時間外25%(60h超50%)・深夜25%加算・休日35%。各=純粋関数lib＋テスト(計23)＋UI＋WebApplication JSON-LD＋openGraph＋MDX(計算例/早見表/FAQ/出典)。計算機20→24本・テスト203→226・ページ187。本番検証=全ページ/og 200・/c/teate 200・既定値がテスト値一致。最新値はWebSearchで確認(厚労省R7.8改定)。**新計算機の関連ガイド13本(2026-06-30・hub-and-spoke集客)**: 失業保険4(いくら早見表master📊/いつまで/自己都合と会社都合/計算方法)・育休3(いくら早見表📊/いつ振り込まれる/実質手取り8割)・傷病手当3(いくら早見表📊/いつまで/退職後)・残業代3(いくら早見表📊/計算方法/みなし残業)。数値は実ロジック算出(一時test→guide-values.json)。SERIES_LABELSにshitsugyo/ikukyu/shoubyo/zangyo追加。レジストリ登録で計算機の関連ガイド・シリーズナビ・masterサブピラー・/guide手当セクションが自動配線。shitsugyo-keisanはステップ見出しでHowTo化。ガイド138→151・ページ200。**被リンク獲得の土台 フェーズ0実装(2026-06-30)**: ①埋め込みウィジェット`/embed/<slug>`(他サイトがiframeで計算機設置・末尾に出典リンクrel=noopener/follow＝埋め込み＝被リンク・noindex＋canonicalで本体指す・全24計算機=components/embeddableCalculators)。**クローム分離=ヘッダー/フッターをcomponents/SiteChrome(use client・usePathnameで/embed配下は非表示)に移管しapp/layout.tsxは`<SiteChrome>`のみに**。②引用ボックス`components/EmbedCite`(全24計算機ページにscript一括挿入・リンクHTML/iframeをコピー・<RelatedGuides>と<AdSlot calcBottom>の間)。③掲載・引用ページ`/press`(サイト概要・リンク方法・埋め込み手順・引用ポリシー・footer/sitemap追加)。ページ200→225(埋め込み24＋press1)。被リンク戦略=フェーズ0(装置)済→1無料登録/2配信(Pinterest/note/Zenn技術記事/知恵袋)/3アウトリーチ(FP・節約・子育て・転職ブログ/Broken Link Building)はユーザー手動。**白ハットのみ(有料/相互大量/自演ブクマ禁止・YMYL)。** **ヘッダー刷新(2026-06-30)**: 横スクロールの出る上部カテゴリ列を廃止し、SiteChromeを再設計。PC(lg+)=左サイドバー(w-64・sticky・現在地ハイライトusePathname)、SP/タブレット=上部バー＋ハンバーガー→左ドロワー(オーバーレイ/ESC/リンクで閉・背面スクロールロック・aria対応)。NavLinks共通化。/embedは従来どおりクローム非表示。**サイドバーMyBest風に再調整(2026-06-30)**: サイト内検索を「メニュー項目」から独立した検索ボックス(丸型・虫眼鏡・placeholder「計算機・記事を検索」・form action=/search?q=でSearchClientが読込)に変更しナビ上部に配置(年収手取り直下でメニューと混同する問題を解消)。構成=検索→人気の計算機→カテゴリから探す(アイコンチップ)→コンテンツの3セクション、下部にflex-1で押し下げた運営者情報/掲載/方針/免責リンク＋著作表示(上寄せの間延びを解消)。**SNS縦長画像＋早見表画像化(2026-06-30)**: `app/pin/[slug]/route.tsx`がPinterest最適の1000×1500縦長画像を動的生成。`lib/table.ts`の`parseFirstTable`/`getGuideTable`がMDXの最初のMarkdown表を抽出→ガイドに早見表があればその表を画像化(最大8行×5列)、無ければタイトル＋訴求カード。/ogと同じNoto Sansフォント。導線=ガイドヘッダーに「📌画像で保存・シェア」、計算機の引用ボックス(EmbedCite)に「SNS用シェア画像」リンク。/pin は ƒ動的・全slug対応。画像経由の保存→流入→自然リンク用(配信素材)。**テクニカルSEO/CWV監査(2026-06-30)**: robots.txt(allow全＋sitemap)・canonical(全ページ)・noindex(/search・/embedのみ,follow)・構造化データ(WebApplication/Article/FAQPage/HowTo/BreadcrumbList/ItemList/Organization/WebSite+SearchAction)・サイトマップ(192URL・/search//embed//pin除外・/ogは画像サイトマップ内image参照)いずれも健全。**バンドル良好**=本番実転送(gzip/br)で計算機ページJS 244KB/CSS 7KB/HTML 17KB・最大チャンク70KB・巨大依存無し・**UIに独自Webフォント無し(system font)**。**CLS=0**(sticky sidebar/広告枠でもシフト無し)。改善実装=app/layout.tsxにpreconnect/dns-prefetch(pagead2.googlesyndication.com・googletagmanager.com)＋viewport.themeColor #10b981。※Next16ビルド出力は各ルートのサイズ列を表示しない(サイズは本番curlで実測)。dev計測のTTFBは初回コンパイル由来で本番と乖離。**GSCデータ確認(2026-06-30)**: 立ち上がり初期(表示41/週・クリック0・平均掲載順位62.8＝6-7ページ目)。表示クエリは全て既存クラスターと一致(節税/住宅ローン/手取り/NISA/退職金/ふるさと納税)＝コンテンツ狙いは的中。**退職金が最強シグナル(23クエリ中7)**。0クリックはオンページでなく権威・時間の問題。ユーザー手動=URL検査でインデックス登録リクエスト＋被リンク。**需要対応クラスター6本追加(2026-07-01)**: 退職金2(taishokukin-ideco=退職所得控除の重複・2026年施行「10年ルール」WebSearch確認/taishokukin-ichiji-nenkin=一時金vs年金)・フリーランス2(freelance-tedori=会社員との違い・国保/青色65万/概算例/kojin-jigyouzei=個人事業税 事業主控除290万税率3-5%)・住宅ローン2(jutaku-loan-setai-1000man=世帯年収1000万 無理なく6800万/審査7580万/karikae-simulation=借り換え損益分岐 calculateKarikaeで実算出)。ガイド151→157・ページ231。**需要対応クラスター第2弾6本(2026-07-01)**: 住宅ローン2(年収の何倍/頭金なしフルローン)・フリーランス2(小規模企業共済/インボイスと個人事業主2割特例)・NISA1(途中引き出し・枠翌年復活)・退職金1(いつもらえる)。ガイド157→163・ページ237・サイトマップ204ページURL。**新計算機2本＋クラスター(2026-07-01・自主拡充)**: 出産手当金/shussan-teate(teate・標準報酬日額×2/3×98日/多胎154日・lib/shussan・月給30万→65万)＋児童手当/jido-teate(life・2024.10拡充=0-3歳15000/3歳-高校10000/第3子以降一律30000・所得制限なし・22歳まで数えて順位判定・lib/jido・子の人数×年齢入力・最新値WebSearch確認)。関連ガイド4本(出産手当いくら/いつ・児童手当いくら/第3子の数え方)。embeddableCalculators・SERIES_LABELS(shussan/jido)登録。計算機24→26・ガイド163→167・テスト236・ページ245・サイトマップ210。
>
> ライフプラン系（FP相談で需要大）4本を追加完了: ✅老後資金 `/rougo-shikin`・✅公的年金見込み `/nenkin-mikomi`・✅教育資金 `/kyoiku-shikin`・✅ライフプラン表 `/life-plan`。新カテゴリ `life`「ライフプラン」を新設。
>
> **ライフプラン系の実装メモ:**
> - `/nenkin-mikomi` 公的年金見込み（カテゴリ`nenkin`）: 老齢基礎年金（令和7年度満額831,696円×納付年数/40）＋老齢厚生年金（平均年収×5.481/1000×加入年数の近似）。繰上げ(60歳-24%/0.4%・月)〜繰下げ(75歳+84%/0.7%・月)対応。`lib/nenkin/`。
> - `/kyoiku-shikin` 教育資金（`life`）: 幼〜大の進路別費用（`lib/kyoiku/constants.ts`＝文科省 子供の学習費調査＋日本政策金融公庫）。大学費用を18歳までに貯める毎月積立を複利逆算。
> - `/life-plan` ライフプラン表（`life`）: 現在〜寿命の年次CF（収入/支出/残高）＋貯蓄枯渇年齢。`lib/lifeplan/`。昇給率・インフレ率・運用利回り・大型支出イベント対応。残高推移SVGチャート＋スクロール年表。西暦表示はマウント後取得でハイドレーション不一致回避。

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
4. **`/nisa` NISA積立シミュレータ**（2026-06-23 公開）
   - 毎月積立×利回り×期間の複利計算で将来評価額・運用益を試算。**運用益が非課税になるメリット額**（運用益×20.315%）を主役表示。
   - 共通の複利エンジン `lib/invest/accumulate.ts`（月複利・期末払い）を使用。NISA枠（つみたて120万/合計360万/生涯1800万）超過を警告表示。
   - 資産推移は共通 `components/AssetGrowthChart.tsx`（元本＋運用益の積み上げSVG）。検証: 毎月3万・年5%で20年=12,331,010円。テスト5件。
5. **`/ideco` iDeCo節税・積立シミュレータ**（2026-06-23 公開）
   - 掛金全額所得控除による**毎年の節税額**（＝掛金×(所得税限界税率×1.021＋住民税10%)）と65歳時点の積立評価額を試算。
   - 節税額は**手取り計算機のロジック＋ふるさとの `marginalIncomeTaxRate` を再利用**。積立は共通複利エンジン。検証: 年収500万・会社員・掛金2.3万/月=年55,780円。テスト9件。
   - 加入区分別の掛金上限（`lib/invest/constants.ts` の `IDECO_CATEGORIES`）。**2026年6月時点の現行値**（自営業6.8万/会社員企業年金なし2.3万/DC・DB・公務員2.0万/第3号2.3万）。**2027年1月から大幅引き上げ（6.8→7.5万・2.3→6.2万）予定だが未施行**のため未反映。改正時は定数更新。
6. **`/kuriage-hensai` 住宅ローン繰り上げ返済シミュレータ**（2026-06-23 公開）
   - 元利均等前提で、**期間短縮型 vs 返済額軽減型**を比較（利息軽減額・短縮期間・毎月返済額の差）。`lib/kuriage/calculate.ts` は `lib/loan/calculate.ts` の `equalPaymentMonthly` を再利用し月次償却を再現。
   - 返済額軽減型は再計算した毎月返済額を**切り上げ**（当初の完済月420を超えない）。期間短縮型は据え置きで完済が早まる。1回の繰上のみ対応。
   - 検証: 3000万/1%/35年・5年後100万＝期間短縮 利息341,360円減/15ヶ月短縮、返済額軽減 157,917円減/月3,216円減。テスト10件。
7. **`/sozokuzei` 相続税計算機**（2026-06-23 公開）
   - 遺産総額＋配偶者有無＋子の人数から、基礎控除（3000万＋600万×法定相続人）→法定相続分按分→速算表→相続税の総額→**配偶者の税額軽減**を適用して納税額の目安を表示。
   - `lib/sozoku/`（calculate/constants/types）。**配偶者・子のみ対象、法定相続分どおり分割の簡易版**（父母・兄弟・小規模宅地特例・2割加算・生保非課税枠は対象外）。
   - 検証: 1億・配偶者+子2人=315万、1億・子2人(配偶者なし)=770万、2億・配偶者+子2人=1350万。テスト11件。
8. **`/karikae` 住宅ローン借り換え比較シミュレータ**（2026-06-23 公開）
   - 残高・残期間を変えず金利だけ借り換えた場合を比較。毎月返済額・総返済額の軽減から**諸費用を引いた正味メリット**を表示（worthIt判定）。`lib/karikae/calculate.ts` は `lib/loan` の `equalPaymentMonthly` を再利用。
   - 検証: 残2000万/25年/1.5%→0.7%/諸費用60万＝月−7,298円・総差218.9万・正味メリット158.9万。テスト8件。
9. **`/taishokukin` 退職金の手取り・税金計算**（2026-06-23 公開・旧planned）
   - 退職所得控除→1/2課税→分離課税（所得税速算表＋復興2.1%、住民税10%）。**勤続5年以下の特例**（短期退職手当等=300万超は1/2なし＝partial、特定役員=全額課税＝none）を実装。`isOfficer` で役員判定。
   - `lib/taishoku/`。所得税速算表は `lib/takehome/constants-2025` を再利用。検証: 2500万/38年=手取り24,655,000円、2000万/38年=非課税、1000万/10年=手取り9,493,300円。テスト10件。
10. **`/shohizei` 消費税・インボイス計算機**（2026-06-23 公開・旧planned）
    - 税抜⇔税込の変換、軽減8%/標準10%、端数処理（切捨/四捨五入/切上）。`lib/shohizei/`。インボイスの端数処理ルールをMDXで解説。検証: 税抜10000・10%=税込11000、1480・8%端数で118/119円差。テスト7件。
11. **`/jikyu-nenshu` 時給・月給・年収 換算機**（2026-06-23 公開・旧planned）
    - 時給/日給/月給/年収の相互換算（1日労働時間×月労働日数で按分）。`lib/jikyu/`。結果から手取り計算機(/tedori)へCTA導線。検証: 時給1500・8h・20日=年収288万、年収300万=時給1563円。テスト6件。

12. **`/rougo-shikin` 老後資金シミュレーション**（2026-06-23 公開・カテゴリ`life`）
    - 退職時に必要な老後資金＝(月支出−月年金)×12×老後年数＋予備費。準備見込み＝現貯蓄の運用後FV＋退職金。不足を埋める毎月積立額を複利で逆算。`lib/rougo/`。結果からNISA/iDeCoへCTA。検証: 40歳/65歳退職/95歳・月支出25万/年金15万・貯蓄500万/退職金1000万/予備費500万/利回り3%＝必要4,100万・不足約2,042万・毎月45,795円。テスト10件。

**sitemap**: `app/sitemap.ts` はレジストリ駆動で live 計算機を自動収録。`lastModified`（ビルド時刻）付き。全26URL（計算機15＋カテゴリ6＋信頼性4＋トップ）。`app/robots.ts` がsitemap場所を明示。新規ページ公開後は Search Console で URL検査→インデックス登録リクエスト（sitemap再送信は任意・自動再クロールされる。Googleのpingエンドポイントは2023年廃止済みなので手動不要）。

**都道府県セレクタの方針（2026-06-23 整理）**: 都道府県は協会けんぽの健保料率にのみ使う。**主目的が健保の手取り計算機(`/tedori`)だけが都道府県選択を持つ**。ふるさと納税・iDeCoは「健保→課税所得」の極小な間接影響しかなく表示が紛らわしいため**都道府県セレクタを削除**（内部は東京都既定で計算継続・結果不変）。今後の税系計算機でも、都道府県が結果を実質的に動かさないなら選択UIは付けない。

**E-E-A-T（信頼性・2026-06-23 ABCDE実装）**: YMYL（お金）向けに、**個人名を出さずブランド（屋号）＋透明性**で信頼性を担保。A=`/about`を屋号運営に。B=`/editorial-policy`（編集・運営方針：作成→テスト検証→更新/訂正・広告の中立性）。C=`/sources`（計算の根拠・出典一覧：9公的機関＋**適用年度/参照時点**付き）。D=虚偽の監修表記はせず「公的資料に基づき作成・テスト検証」の事実で代替。E=`components/TrustNote.tsx`を**全15計算機ページ**に設置（最終更新日＋検証文言＋出典/編集方針への相互リンク）＋信頼性ページの更新日を`SITE_LAST_UPDATED`(lib/site.ts)で一元化。フッター法務ナビ・sitemapに editorial-policy/sources 追加。**※将来 実在の監修（税理士/FP・法人名可）を付けるなら更に強化可。虚偽の資格表記は厳禁。**

**コラム/ガイド（SEO第1弾・2026-06-23）**: トピッククラスター戦略で計算機（マネーページ）の順位を底上げ。`lib/guides.ts` レジストリ（計算機と同設計・`targets`=送客先計算機slug）＋ `/guide` 一覧 ＋ `/guide/<slug>` 記事（`content/guides/*.mdx`＋`components/GuideLayout`、Article構造化データ）。`components/RelatedGuides` を全15計算機ページに設置（`guidesForCalculator` で自動配線・相互リンク）。**現在62記事**（…＋ふるさと納税クラスター21＋住宅ローン借入可能額クラスター9）。年収別手取りシリーズは300〜1000万まで完備。**住宅ローン「年収別いくら借りられる」クラスター(loan・2026-06-24・計9本)**: ふるさと納税と同じhub-and-spoke手法を収益エンジン(jutaku-loan)へ横展開(evergreenでふるさと納税の季節性を補完)。master=借入可能額の年収別早見表(jutaku-loan-nenshu-betsu)＋年収300/400/500/600/700/800/1000万＋共働き/ペアローン(jutaku-loan-pair)。借入可能額は実ロジック(equalPaymentMonthlyの逆算)で算出: 無理なく=返済負担率25%@金利1.5%、審査上限=35%@審査金利3.0%・35年元利均等(年収500万→無理なく約3,400万/審査上限約3,790万、年収の約5〜7倍)。**審査金利(3%)と実行金利(1.5%)を分けて上限の過大表示を回避**(YMYL)。各記事に手取りとの兼ね合い・固有解説でdoorway回避。**サチコ実データ起点の強化(2026-06-24・9本)**: Search Consoleで表示中(クリック0=2ページ目)のクエリを起点にクラスターを厚くし上位化を狙う。①NISA(toshi・3本)=成長投資枠とは(nisa-seichou-toushiwaku)/つみたて投資枠とは(nisa-tsumitate-toushiwaku)/個人事業主のNISA(nisa-kojin-jigyounushi)→「新nisa成長投資枠とは」「つみたて投資枠成長投資枠」「個人事業主nisa経費」直撃。②住宅ローン返済額(借入額別・loan・master+5)=jutaku-hensai-betsu＋jutaku-1000/2000/2500/4000/5000man-hensai(既存3000万と合わせ網羅)→「住宅ローン1000万」等。返済額はcalculateLoanで実算出(35年元利均等・3000万は既存記事と一致)。**構造改善**: guideSeriesKeyで借入可能額(jutaku-loan)と返済額(jutaku-hensai)を別シリーズに分離→/guideの並びが「借入可能額(年収昇順)／変動固定／繰上借換／返済額(借入額昇順)」に整理。ガイド計71記事。サチコのクエリで既存記事ありは(フリーランス節税/年収500万手取り/ふるさと納税デメリット/退職金)=表示済み、内部リンク強化で底上げ余地。**退職金クラスター(nenkin・2026-06-24・8本)**: サチコで「定年退職金 計算」表示中。hub-and-spokeでtaishokukin強化。master=金額別×勤続年数の手取り早見表(taishokukin-kingaku-betsu)＋退職金1000/1500/2000/2500/3000万＋平均相場(taishokukin-heikin・厚労省)＋確定申告(taishokukin-kakutei-shinkoku・受給に関する申告書/未提出は20.42%源泉)。手取り・税金はcalculateTaishokuで実算出(勤続38年定年=退職所得控除2,060万→退職金2000万以下は非課税、2500万で税35万、3000万で税99万)。各記事に勤続年数別テーブル。ガイド計79記事。既存taishokukin-zeikinと合わせ退職金網羅。**相続税・NISA年代別クラスター＋ASP CTA(2026-06-24)**: ①**gated CTA**=`components/AffiliateCTA.tsx`(住宅ローン/証券)。`lib/site.ts`の`AFFILIATE_ENABLED`(=false)＋`AFFILIATE_SLOTS`{loan,securities}＋`affiliateSlotForCategory(category)`(loan→loan/toshi→securities)。**GuideLayoutが自動でカテゴリ判定して表示**(個別ページ編集不要)。提携後=該当slotのurl記入＋ENABLED=trueで全loan/toshiガイドに一括反映。rel="sponsored nofollow"・「広告(アフィリエイト)」表記。②**相続税(zei・4)**=遺産総額別早見表(sozokuzei-isan-betsu)＋配偶者の税額軽減(sozokuzei-haiguusha-keigen)＋遺産5000万/1億(sozokuzei-5000man/sozokuzei-1oku)。calculateSozokuで実算出(1億・配偶者+子2=315万/子2のみ=770万、公知の早見表と一致)。既存sozokuzei-ikura-karaと連携。③**NISA年代別(toshi・4)**=nisa-20dai/30dai/40dai/50dai。calculateNisaで実算出(月3万年5%=40年4578万/30年2497万/20年1233万/10年466万)。「新nisa 50代」等。ガイド計87記事。**iDeCoクラスター＋手取り深掘り(2026-06-24・11本)**: ①iDeCo(toshi・6)=掛金上限(ideco-kakekin-jougen・職業別/2024.12改正後DB公務員2万)・節税額(ideco-setsuzei・年収別/500万5.6万・700万8.4万)・メリット(ideco-merit・3つの税優遇)・受け取り方(ideco-uketori・一時金退職所得控除/年金公的年金等控除/退職金との重複注意)・40代(ideco-40dai)・50代(ideco-50dai)。calculateIdecoで実算出(会社員月2.3万年5%、40代20年=評価945万/節税112万、50代10年=評価357万/節税56万)。②手取り深掘り(kyuyo・5)=master(nenshu-tedori-ichiran・年収別早見表300-1000万)＋年収350/450/550/650万。calculateTakeHomeで実算出(350=279/450=355/550=427/650=499万、既存と整合)。手取りmasterはnenshu接頭辞でguideSeriesKey上 年収シリーズと同列に整列。ガイド計98記事。**贈与税・大学費用＋住宅ローン年収帯gap(2026-06-24・10本)**: ①住宅ローン年収帯gap(loan・5)=jutaku-loan-450/550/650/900/1200man。借入可能額をequalPayment逆算で実算出(無理なく25%@1.5%/審査上限35%@審査金利3%・35年)→年収300〜1200万が連続。②贈与税クラスター(zei・targets=sozokuzei・4)=金額別早見表(zouyozei-ikura)＋暦年贈与110万(zouyozei-rekinen)＋住宅取得資金贈与(zouyozei-jutaku)＋教育資金一括贈与(zouyozei-kyoiku)。贈与税は速算表で実算出(特例/一般、500万特例48.5万・1000万特例177万、公知の表と一致)。贈与計算機はないので相続税計算機へ送客。③大学費用(life・daigaku-hiyou)=国公立240/私立文系410/私立理系550万(kyoiku定数と整合)。kyoikuhi-ikuraと相互リンク。ガイド計108記事。残=ASP提携後のCTA有効化(AFFILIATE_SLOTSのurl記入＋ENABLED=true)。次候補=自動車税/固定資産税等の新計算機、各クラスターのさらなる深掘り。**ふるさと納税 hub-and-spokeクラスター(zei・2026-06-24・計21本)**: Google Docs仕様書「控除上限額シミュレーター実装仕様」§3 hub-and-spoke/§6 Spoke量産に基づき、計算機(Hub=/furusato-nozei)へ送客するロングテール=【年収帯】年収別早見表(furusato-nozei-nenshu-betsu)・年収300/350/400/450/500/600/700/800/900/1000/1200万。【属性】共働き(tomobataraki)・自営業(jieigyou・課税所得別)・専業主婦世帯(sengyoshufu・配偶者控除＋パートの壁)・子育て世帯(kosodate・16歳未満/高校生/大学生で扱い変)。【手続き/損得(情報クエリ)】いつまで=期限(itsumade)・ワンストップ特例とは(onestop)・デメリット/やめたほうがいい人(demerit)・確定申告のやり方(kakutei-shinkoku)・控除の確認方法=住民税決定通知書(kojo-kakunin)。手続き系は手順解説中心(計算機の数値不要)。**計算機の詳細モード実装済(2026-06-24・仕様書ブロック1の残タスク完了)**: FurusatoCalculatorに「かんたん/くわしく」トグル。くわしく=年齢＋社会保険料の手入力(自動推計をプレフィル)＋その他の所得控除(医療費・iDeCo・生命保険料等)。`lib/furusato`のFurusatoInputに`socialInsuranceOverride`/`otherDeductions`、FurusatoResultに`socialInsuranceAuto`追加。calcIncomeTax/calcResidentTaxの第2引数(所得控除)に社保＋その他控除を合算して課税所得を下げる。住宅ローン控除は税額控除のため数値入力にせず注記(ワンストップなら影響小・確定申告で下がる場合あり)。URL共有(other/social)対応。精度テスト4件追加(計174)。**ガイド一覧のUX改善(2026-06-24)**: `lib/guides.ts`に`compareGuides`(①シリーズ[初登場順]→②年収/金額昇順[万のスラッグから抽出・無しは先]→③登録順)を追加、`guidesInCategory`/`guidesForCalculator`が整列を返す。これで/guide一覧・計算機の関連ガイドが「作った順」でなく年収昇順に。`app/guide/page.tsx`にカテゴリ別クイックナビ(アンカー)・件数バッジ・絵文字チップ・hover lift追加。`RelatedGuides`は上限6件＋「ガイドをすべて見る→/guide」リンク(ふるさと納税16件が全部並ぶのを防止)。狙い=「ふるさと納税 上限額 年収◯◯万」等の低競合ロングテール。早見表の数値は実ロジック`calculateFurusato`(30歳・東京・他控除なし)で算出し計算機と完全一致(独身: 300万2.8/400万4.2/500万6.1/600万7.7/700万10.8/800万13.1/1000万18.3万。660-670万で所得税率10→20%、上限が跳ねる)。自営業は課税所得別(課税所得300万→7.7万/500万→14.5万/1000万→35.7万、住民税所得割=課税所得×10%概算)。doorway回避のため各記事に固有解説。**ASP CTA枠(仕様書ブロック3・収益動線)**: `components/FurusatoCTA.tsx`(楽天/さとふる/ふるなびの3社比較カード＋CTAボタン)。`lib/site.ts`の`FURUSATO_ASP_ENABLED`(=false)・`FURUSATO_ASP`[{name,feature,url}]でフラグ運用(AdSlotと同じ。falseまたはurl空なら無描画)。**提携後の有効化**=`FURUSATO_ASP`の各urlにアフィリエイトリンクを記入→`FURUSATO_ASP_ENABLED=true`→デプロイ。アフィリンクはrel="sponsored nofollow"付与・「広告（アフィリエイト）」表記。計算機(FurusatoCalculator)は結果額を`amount`で動的反映(「◯◯円分の返礼品を探す」)、全Spokeにも設置済。次のSpoke候補=年収250/1500万・自治体別/返礼品ジャンル別・「ふるさと納税 やめたほうがいい人」等。仕様書の残=詳細モード(社会保険料/他控除の手入力で精度UP)・ASP提携後のCTA有効化(FURUSATO_ASP url記入＋ENABLED=true)。数値はすべて実ロジック算出。**構造化データ拡充**: トップに Organization・ItemList(計算機一覧)を追加。**HTMLサイトマップ `/calculators`**: 全計算機＋全ガイドをカテゴリ別に集約（フッター・sitemap連携）。**年収別節税対策クラスター(zei)**: ピラー「年収別の節税対策まとめ」＋年収500/700/1000万の節税＋フリーランスの節税。収益エンジン(ふるさと納税/iDeCo/NISA)への送客が最も強いクラスター。早見表の数値は実算出(ふるさと300万2.8万/500万6.1万/700万10.8万/1000万18.3万、iDeCo節税500万5.6万/700万8.4万/1000万8.4万)。第3弾: 年収1000万手取り(→tedori)・退職金の税金(→taishokukin)・教育費はいくら(→kyoiku-shikin)・iDeCoのデメリット(→ideco)・新NISAの2枠(→nisa)・時給1000/1500円(→jikyu-nenshu)。これで全15計算機にガイド配線済み。第1弾: 年収400/500/600万手取り(→tedori)・ふるさと納税やり方(→furusato)・NISA vs iDeCo(→nisa/ideco)。第2弾: 年収700万手取り(→tedori)・**年収の壁**(2025改正で所得税の壁103万→160万に引き上げを反映/→tedori)・相続税はいくらから早見表(→sozokuzei)・住宅ローン頭金(→jutaku-loan)・繰上返済vs借り換え(→kuriage/karikae)・老後2000万円問題(→rougo/nenkin)。ヘッダー/フッター/トップ/sitemapにガイド導線。**新記事追加手順**: `lib/guides.ts`に1エントリ＋`content/guides/<slug>.mdx`＋`app/guide/<slug>/page.tsx`（既存をコピー）。**年収別手取りの数値は実ロジック算出**(400=317万/500=390万/600=463万/700=531万)。第3弾候補=年収800/1000万手取り・退職金の税金・教育費はいくら・確定申告のやり方など。

**トップページSEO（2026-06-23 刷新）**: H1＝「お金の計算機｜年収手取り・住宅ローン・税金を無料で計算」。導入文に主要計算機キーワードを網羅、信頼バッジ（無料・登録不要・入力非送信・令和7年対応・計算機数）、カテゴリ別見出しは「〜の計算機」、**FAQセクション＋FAQPage構造化データ**を追加。`app/layout.tsx` の title/description/keywords/OGP も強化。

**金額入力のカンマ表示（2026-06-23）**: `components/MoneyInput.tsx`＝金額欄の共通部品（`type="text"`＋3桁カンマ自動整形・スライダー同期・`max`クランプ）。`type="number"`はカンマ表示不可のため全計算機の金額欄をこれに置換。ヘルパー型(Rougo `NumField`/LifePlan `Num`)は `suffix==="円"` のとき自動でMoneyInputを使う。年齢・年数・％・件数は従来の数値入力のまま。手取りの前年収入は数値state(0=未入力)に整理。**新計算機の金額欄もMoneyInputを使うこと**（value:number, onChange:(n)=>void）。

**OGP/ファビコン（2026-06-23）**: `app/opengraph-image.tsx`（1200×630・動的・`assets/`のNoto Sans JP woff[日本語+ラテン]をfsで読みImageResponse生成）。`app/icon.svg`（¥/emeraldファビコン）・`app/apple-icon.tsx`（180×180）・`app/manifest.ts`。デフォルト`favicon.ico`は削除。`twitter:summary_large_image`。**フォントはリポジトリ同梱**（ビルド時ネットワーク非依存）。

**SEO残タスク・AdSense広告配置**は `money-calc/SEO-CHECKLIST.md` 末尾の「最新ステータス」「AdSense 広告の表示形式・配置」を参照。

**結果のURL共有＋サイト内検索（2026-06-23）**: `components/ShareButton.tsx`＝シェアボタン（Web Share API/クリップボード）＋`useSharedParams`/`applyNumber`（URLクエリから入力値を復元・SSG安全のためマウント後useEffectで読む）。**全15計算機に設置完了**（各計算機ごとに個別配線＋検証）。各計算機の`shareParams`のキー＝URLクエリ名。サイト内検索: `/search`（`components/SearchClient.tsx`＝計算機＋ガイドをクライアントAND絞り込み・noindex）＋ヘッダー検索リンク＋トップに`SearchAction`構造化データ。**※カンマ一括変換の教訓から、全calc一括の危険な置換はせず個別配線＋検証で実施**。

**AdSense広告枠（準備済・2026-06-23）**: `components/AdSlot.tsx`＝広告枠（`ADS_ENABLED=false`またはslot未設定なら無描画＝審査/UX/CLSに影響なし。表示時は最小高さ予約＋「スポンサーリンク」表記）。`lib/site.ts`に `ADS_ENABLED`(=false)・`AD_SLOTS`{guideInArticle,guideEnd,calcBottom}(空)。**配置済**: ガイド記事末尾(GuideLayout)＋全15計算機の結果下(各page.tsx、RelatedGuidesの後)。**配置方針**: 計算機は入力〜結果の間に置かない/結果・解説の下のみ。**承認後の有効化手順**: ①AdSense管理画面で広告ユニット作成→各slot ID取得 ②`AD_SLOTS`にIDを貼る ③`ADS_ENABLED=true` ④デプロイ。スマホのアンカー広告は管理画面の自動広告でON可。

**AdSense（審査中）**: サイトは申請可能な状態（独自ドメイン・大量のオリジナルコンテンツ・プライバシー/運営者/編集方針/出典ページ完備）。申請後、パブリッシャーID発行→`public/ads.txt`設置＋`app/layout.tsx`にAdSenseスクリプト（next/script）を追加して審査。氏名・住所はGoogleに登録するだけでサイトには非公開。

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
- **Vercelがpushを稀に取りこぼす**: 2026-06-23、あるpushでVercelがデプロイを生成せず本番が固着（GitHub commit statusが`pending`のまま・Vercelコンテキスト無し）。**次のpushを重ねれば履歴ごと再デプロイされて解消**。確認方法: `curl -s https://api.github.com/repos/kobayashi329-pixel/money-calc/commits/<sha>/status`（Public repoは認証不要）で `state` と Vercelコンテキストの有無を見る。デプロイ後は本番URLを実際にcurlして200か確認すること。
- **MDXのCJK太字**: `）**が` のように全角括弧の直後に閉じ`**`があると太字が効かない。閉じ`**`を括弧の前に置く。
  GFMテーブルは `remark-gfm`（Turbopackでは文字列指定 `[["remark-gfm"]]`）。
- **お名前.com**: ドメインプロテクション(有料)を誤購入済み（返金問い合わせ中・サイト動作には無関係）。
  DNSレコード追加時は「追加」ボタンを押して一覧に出してから確認画面へ。パーキング用Aレコード(157.7.x)が混入しないよう注意。
- **住民税のタイムラグ**: 前年所得課税のため、収入が大きく増減した年は給与明細と乖離する（バグではない）。`priorYearIncome`で対応。

## 8. 次の候補（ロードマップ）

1. ~~ふるさと納税 上限額シミュレータ~~ ✅ **2026-06-23 公開済み**（`/furusato-nozei`）
2. ~~NISA / iDeCo 積立シミュレータ~~ ✅ **2026-06-23 公開済み**（`/nisa` `/ideco`）
3. **AdSense申請**（計算機11本＋全カテゴリ網羅＋信頼性ページ揃い）← 最優先。レジストリの計算機は全てlive化済み
4. ~~繰上返済・借換え・退職金・消費税・時給換算~~ ✅ 全て公開済み。**レジストリ計画分は完了**。
   今後の拡張候補（レジストリ未登録）: 贈与税、自動車税、固定資産税、教育費・学資、年金受給額、住民税単体 など
5. 各結果画面に**文脈連動アフィリエイト枠**（手取り→転職、住宅ローン→ローン比較、ふるさと納税→寄付ポータル、NISA/iDeCo→証券口座）を設置
6. **2027年1月のiDeCo改正**（掛金上限引き上げ・70歳まで加入）施行時に `lib/invest/constants.ts` を更新

新しい計算機は: `lib/<name>/calculate.ts`＋テスト → `components/<Name>Calculator.tsx` → `app/<slug>/page.tsx` → `content/<slug>.mdx` → `lib/calculators.ts` に登録(status:"live") の流れ。レジストリ登録で内部リンク・sitemapは自動。
