// =============================================================
//  ガイド（コラム）レジストリ — 計算機への送客クラスター
//  情報意図のキーワードを獲得し、本文・末尾から計算機（マネーページ）へ
//  内部リンクで送客する。計算機レジストリ(lib/calculators.ts)と同設計。
//  ここに1エントリ＋MDX(content/guides/<slug>.mdx)＋page.tsxを足すと、
//  一覧・sitemap・各計算機の「関連ガイド」内部リンクが自動配線される。
// =============================================================

export interface Guide {
  /** URLスラッグ（/guide/<slug>） */
  slug: string;
  /** 記事タイトル（H1・title） */
  title: string;
  /** 一覧カード用の短い名前 */
  shortTitle: string;
  /** 一覧・meta用の説明 */
  description: string;
  /** 所属カテゴリ（計算機と共通の6カテゴリ） */
  category: string;
  /** この記事が送客する計算機のslug（相互リンク用） */
  targets: string[];
  /** 関連ガイドのslug */
  related: string[];
  /** 公開状態 */
  status: "live" | "planned";
  /** 最終更新（鮮度表示用） */
  updated: string;
  emoji: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "nenshu-500man-tedori",
    title: "年収500万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収500万の手取り",
    description:
      "年収500万円の手取りは約390万円・月約32万円。所得税・住民税・社会保険料の内訳と、手取りを増やす方法を解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-400man-tedori", "nenshu-600man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "nenshu-400man-tedori",
    title: "年収400万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収400万の手取り",
    description:
      "年収400万円の手取りは約317万円・月約26万円。所得税・住民税・社会保険料の内訳をわかりやすく解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-500man-tedori", "nenshu-600man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "nenshu-600man-tedori",
    title: "年収600万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収600万の手取り",
    description:
      "年収600万円の手取りは約463万円・月約38万円。所得税・住民税・社会保険料の内訳と節税の選択肢を解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-500man-tedori", "nenshu-400man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "furusato-nozei-yarikata",
    title: "ふるさと納税のやり方・始め方｜ワンストップ特例と確定申告の違い",
    shortTitle: "ふるさと納税のやり方",
    description:
      "ふるさと納税の手順を初心者向けに解説。上限額の確認、寄付、ワンストップ特例制度と確定申告の違い、期限までをまとめます。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: ["furusato-nozei-nenshu-betsu", "furusato-nozei-500man"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🎁",
  },
  {
    slug: "nisa-ideco-dochira",
    title: "NISAとiDeCoの違いは？どっちから始めるべきか目的別に解説",
    shortTitle: "NISAとiDeCoの違い",
    description:
      "新NISAとiDeCoの違いを一覧で比較。所得控除・引き出しの自由度・非課税メリットから、どっちを優先すべきかを目的別に解説します。",
    category: "toshi",
    targets: ["nisa", "ideco"],
    related: [],
    status: "live",
    updated: "2026年6月23日",
    emoji: "📈",
  },
  {
    slug: "nenshu-700man-tedori",
    title: "年収700万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収700万の手取り",
    description:
      "年収700万円の手取りは約531万円・月約44万円。所得税・住民税・社会保険料の内訳と、節税の選択肢を解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-500man-tedori", "nenshu-600man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "nenshu-no-kabe",
    title: "年収の壁とは？2025年は160万円に引き上げ｜106万・130万の壁も解説",
    shortTitle: "年収の壁（2025年の最新）",
    description:
      "パート・扶養で気になる「年収の壁」を整理。所得税の壁は2025年に103万→160万円へ引き上げ。106万・130万円の社会保険の壁との違いも解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-400man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🚧",
  },
  {
    slug: "sozokuzei-ikura-kara",
    title: "相続税はいくらから？基礎控除の早見表と納税額の目安",
    shortTitle: "相続税はいくらから",
    description:
      "相続税がかかるのは遺産が基礎控除（3000万＋600万×法定相続人）を超えたとき。早見表で納税額の目安を確認できます。",
    category: "zei",
    targets: ["sozokuzei"],
    related: [],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🏛️",
  },
  {
    slug: "jutaku-loan-atamakin",
    title: "住宅ローンの頭金はいくら必要？借入可能額の目安と考え方",
    shortTitle: "住宅ローンの頭金の目安",
    description:
      "頭金は物件価格の1〜2割が目安。年収倍率・返済負担率から無理のない借入額の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["kuriage-karikae-dochira"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🏠",
  },
  {
    slug: "kuriage-karikae-dochira",
    title: "繰り上げ返済と借り換えはどっちがお得？住宅ローンの見直し方",
    shortTitle: "繰上返済と借り換えどっち",
    description:
      "住宅ローンの負担を減らす「繰り上げ返済」と「借り換え」の違いと、どちらを選ぶべきかを状況別に解説します。",
    category: "loan",
    targets: ["kuriage-hensai", "karikae"],
    related: ["jutaku-loan-atamakin"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🔁",
  },
  {
    slug: "rougo-2000man",
    title: "老後2000万円問題とは？本当に必要な金額の考え方",
    shortTitle: "老後2000万円問題とは",
    description:
      "「老後2000万円問題」の意味を正しく整理。年金収入と支出の差から、自分に必要な老後資金を考える方法を解説します。",
    category: "life",
    targets: ["rougo-shikin", "nenkin-mikomi"],
    related: [],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🗓️",
  },
  {
    slug: "nenshu-1000man-tedori",
    title: "年収1000万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収1000万の手取り",
    description:
      "年収1000万円の手取りは約727万円・月約60万円。所得税・住民税・社会保険料の内訳と、負担を抑える方法を解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-700man-tedori", "nenshu-600man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "taishokukin-zeikin",
    title: "退職金にかかる税金は？手取りの計算方法をわかりやすく解説",
    shortTitle: "退職金の税金・手取り",
    description:
      "退職金は「退職所得控除」と「1/2課税」で大きく優遇されます。税金の計算方法と手取りの目安、注意点を解説します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: [],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🧾",
  },
  {
    slug: "kyoikuhi-ikura",
    title: "教育費はいくらかかる？幼稚園〜大学の総額の目安",
    shortTitle: "教育費はいくら",
    description:
      "子ども1人の教育費は、進路（公立・私立）でオール公立約800万〜オール私立約2400万円。段階別の目安と準備方法を解説します。",
    category: "life",
    targets: ["kyoiku-shikin"],
    related: [],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🎓",
  },
  {
    slug: "ideco-demerit",
    title: "iDeCoのデメリットは？始める前に知っておきたい注意点",
    shortTitle: "iDeCoのデメリット",
    description:
      "iDeCoは節税メリットが大きい一方、原則60歳まで引き出せない・手数料がかかるなどの注意点も。デメリットを正しく理解しましょう。",
    category: "toshi",
    targets: ["ideco"],
    related: ["nisa-ideco-dochira"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🐷",
  },
  {
    slug: "shin-nisa-waku",
    title: "新NISAのつみたて投資枠と成長投資枠の違いは？使い分けを解説",
    shortTitle: "NISAの2つの投資枠",
    description:
      "新NISAの「つみたて投資枠（年120万）」と「成長投資枠（年240万）」の違い、対象商品、使い分けの考え方を解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-ideco-dochira"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "📈",
  },
  {
    slug: "jikyu-1000-1500",
    title: "時給1000円・1500円は月収・年収いくら？フルタイム・パート別に解説",
    shortTitle: "時給→月収・年収はいくら",
    description:
      "時給1000円・1500円で働くと月収・年収はいくら？労働時間・日数別の換算と、手取りの目安をわかりやすく解説します。",
    category: "kyuyo",
    targets: ["jikyu-nenshu"],
    related: ["nenshu-no-kabe"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "⏱️",
  },
  {
    slug: "setsuzei-nenshu-betsu",
    title: "年収別の節税対策まとめ｜会社員ができる節税を一覧で解説",
    shortTitle: "年収別の節税対策まとめ",
    description:
      "会社員ができる節税は年収（税率）で最適解が変わります。ふるさと納税・iDeCo・NISAを中心に、年収別のおすすめ節税対策を一覧で解説します。",
    category: "zei",
    targets: ["furusato-nozei", "ideco", "nisa", "tedori"],
    related: ["setsuzei-500man", "setsuzei-700man", "setsuzei-1000man"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🧮",
  },
  {
    slug: "setsuzei-500man",
    title: "年収500万円の節税対策｜ふるさと納税・iDeCo・NISAの使い分け",
    shortTitle: "年収500万の節税対策",
    description:
      "年収500万円の会社員が使える節税対策を優先順位つきで解説。ふるさと納税の上限約6万円、iDeCoの節税、NISAの非課税を実数値で紹介します。",
    category: "zei",
    targets: ["furusato-nozei", "ideco", "nisa"],
    related: ["setsuzei-nenshu-betsu", "setsuzei-700man"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "setsuzei-700man",
    title: "年収700万円の節税対策｜税率20%帯で効く節税を解説",
    shortTitle: "年収700万の節税対策",
    description:
      "年収700万円は所得税率が上がり、節税の効果が大きくなる年収帯。ふるさと納税約11万円、iDeCo・NISAを使った具体的な節税策を解説します。",
    category: "zei",
    targets: ["ideco", "furusato-nozei", "nisa"],
    related: ["setsuzei-nenshu-betsu", "setsuzei-1000man"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "setsuzei-1000man",
    title: "年収1000万円の節税対策｜高所得者が使える控除を総動員",
    shortTitle: "年収1000万の節税対策",
    description:
      "年収1000万円は税負担が重く、節税の効果も最大級。ふるさと納税約18万円、iDeCo、各種控除、年収の壁まで、高所得者向けの節税策を解説します。",
    category: "zei",
    targets: ["ideco", "furusato-nozei", "nisa"],
    related: ["setsuzei-nenshu-betsu", "setsuzei-700man"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "setsuzei-freelance",
    title: "個人事業主・フリーランスの節税対策｜青色申告・小規模企業共済・iDeCo",
    shortTitle: "フリーランスの節税対策",
    description:
      "個人事業主・フリーランスが使える節税を解説。青色申告特別控除65万円、経費、小規模企業共済、iDeCo（月6.8万円まで）など会社員より幅広い節税策を紹介します。",
    category: "zei",
    targets: ["ideco", "tedori"],
    related: ["setsuzei-nenshu-betsu"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🧑‍💻",
  },
  {
    slug: "kakutei-shinkoku-yarikata",
    title: "確定申告のやり方｜会社員でも必要なケースと手順をやさしく解説",
    shortTitle: "確定申告のやり方",
    description:
      "確定申告が必要なのはどんな人？医療費控除・ふるさと納税・副業などのケースと、e-Taxでの手順・期限をわかりやすく解説します。",
    category: "zei",
    targets: ["furusato-nozei", "ideco"],
    related: ["furusato-nozei-yarikata"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "📝",
  },
  {
    slug: "jutaku-hendou-kotei",
    title: "住宅ローンは変動金利と固定金利どっち？違いと選び方を解説",
    shortTitle: "住宅ローン 変動と固定どっち",
    description:
      "住宅ローンの変動金利と固定金利の違い、メリット・デメリット、どちらが向いているかを解説。返済額の試算もあわせてどうぞ。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-atamakin", "kuriage-karikae-dochira"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🏠",
  },
  {
    slug: "setsuzei-300man",
    title: "年収300万円の節税対策｜無理なくできるふるさと納税・NISA",
    shortTitle: "年収300万の節税対策",
    description:
      "年収300万円台は税率が低めなので、まずは生活防衛資金とNISA、少額のふるさと納税から。無理のない節税の始め方を解説します。",
    category: "zei",
    targets: ["furusato-nozei", "nisa"],
    related: ["setsuzei-nenshu-betsu", "setsuzei-500man"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "setsuzei-tomobataraki",
    title: "共働き世帯の節税対策｜2人分の枠・配偶者控除・年収の壁",
    shortTitle: "共働き世帯の節税",
    description:
      "共働きはふるさと納税・iDeCo・NISAの枠を2人分使えるのが強み。配偶者控除や年収の壁もふまえた共働きならではの節税を解説します。",
    category: "zei",
    targets: ["tedori", "furusato-nozei"],
    related: ["setsuzei-nenshu-betsu", "nenshu-no-kabe"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "👫",
  },
  {
    slug: "nenshu-300man-tedori",
    title: "年収300万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収300万の手取り",
    description:
      "年収300万円の手取りは約240万円・月約20万円。所得税・住民税・社会保険料の内訳をわかりやすく解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-400man-tedori", "nenshu-500man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "💴",
  },
  {
    slug: "bonus-tedori",
    title: "ボーナス（賞与）の手取りはいくら？計算方法と引かれるもの",
    shortTitle: "ボーナスの手取り",
    description:
      "ボーナスからも税金・社会保険料は引かれます。手取りの計算方法と、額面のおよそ8割が手取りになる理由を解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-500man-tedori"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🎁",
  },
  {
    slug: "juuminzei-ikura",
    title: "住民税はいくら？年収別の目安と計算方法をわかりやすく解説",
    shortTitle: "住民税はいくら",
    description:
      "住民税は所得割（約10%）と均等割（約5,000円）の合計。年収別の目安と計算方法、いつ・どう払うかを解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-500man-tedori", "furusato-nozei-yarikata"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🏛️",
  },
  {
    slug: "nisa-tsukini-ikura",
    title: "NISAは毎月いくら積み立てるべき？金額別シミュレーション",
    shortTitle: "NISAは毎月いくら",
    description:
      "NISAは毎月いくら積み立てるとどれくらいになる？月1万・3万・5万円を年5%で運用した場合の将来額をシミュレーションします。",
    category: "toshi",
    targets: ["nisa"],
    related: ["shin-nisa-waku", "nisa-ideco-dochira"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "📈",
  },
  {
    slug: "nenkin-kurisage",
    title: "年金の繰り下げ受給は得？何歳から受け取ると有利かを解説",
    shortTitle: "年金の繰り下げは得か",
    description:
      "年金を遅らせて受け取る「繰り下げ受給」は1ヶ月0.7%増、最大84%増。損益分岐は約82歳。得かどうかを目安つきで解説します。",
    category: "nenkin",
    targets: ["nenkin-mikomi"],
    related: ["rougo-2000man"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🧾",
  },
  {
    slug: "jutaku-3000man-hensai",
    title: "住宅ローン3000万円・35年の月々返済額はいくら？金利別の目安",
    shortTitle: "3000万ローンの返済額",
    description:
      "住宅ローン3,000万円を35年で借りた場合の毎月の返済額は、金利1%で約8.5万円。金利別の返済額・総返済額の目安を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-atamakin", "jutaku-hendou-kotei"],
    status: "live",
    updated: "2026年6月23日",
    emoji: "🏠",
  },
  {
    slug: "furusato-nozei-nenshu-betsu",
    title:
      "ふるさと納税の上限額 年収別早見表【2026年版】独身・夫婦・子どもありで比較",
    shortTitle: "上限額の年収別早見表",
    description:
      "ふるさと納税の控除上限額を年収別・家族構成別の早見表で確認。年収250万〜2000万の独身・共働き・夫婦・子持ちの目安と、自己負担2,000円で寄付できる金額の考え方を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-500man",
      "furusato-nozei-700man",
      "furusato-nozei-yarikata",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📊",
  },
  {
    slug: "furusato-nozei-500man",
    title:
      "年収500万円のふるさと納税 上限額はいくら？独身・共働き・子ありで比較",
    shortTitle: "年収500万の上限額",
    description:
      "年収500万円のふるさと納税の上限額の目安は、独身・共働きで約6.1万円。家族構成別の早見表と、ワンストップ特例で足りるか、無理のない寄付額の決め方を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-600man",
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-yarikata",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-600man",
    title:
      "年収600万円のふるさと納税 上限額はいくら？独身・共働き・子ありで比較",
    shortTitle: "年収600万の上限額",
    description:
      "年収600万円のふるさと納税の上限額の目安は、独身・共働きで約7.7万円。家族構成別の早見表と、ワンストップ特例の使い方、おすすめの寄付額を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-500man",
      "furusato-nozei-700man",
      "furusato-nozei-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-700man",
    title:
      "年収700万円のふるさと納税 上限額はいくら？独身・共働き・子ありで比較",
    shortTitle: "年収700万の上限額",
    description:
      "年収700万円のふるさと納税の上限額の目安は、独身・共働きで約10.8万円。家族構成別の早見表と、ワンストップ特例で足りるか、寄付額の決め方を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-600man",
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-yarikata",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-tomobataraki",
    title:
      "共働き夫婦のふるさと納税 上限額は？年収別の早見表とそれぞれ寄付する方法",
    shortTitle: "共働きの上限額",
    description:
      "共働き夫婦は配偶者控除がないぶん上限額が高め。年収別の早見表と、夫婦それぞれが自分の名義で寄付するときの注意点（名義・ワンストップ特例）を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-500man",
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-yarikata",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "👫",
  },
  {
    slug: "furusato-nozei-300man",
    title:
      "年収300万円のふるさと納税 上限額はいくら？独身・夫婦・子ありで比較",
    shortTitle: "年収300万の上限額",
    description:
      "年収300万円のふるさと納税の上限額の目安は、独身・共働きで約2.8万円。家族構成別の早見表と、少額でも得になる仕組み、無理のない寄付額を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-400man",
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-yarikata",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-400man",
    title:
      "年収400万円のふるさと納税 上限額はいくら？独身・夫婦・子ありで比較",
    shortTitle: "年収400万の上限額",
    description:
      "年収400万円のふるさと納税の上限額の目安は、独身・共働きで約4.2万円。家族構成別の早見表と、ワンストップ特例の使い方、おすすめの寄付額を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-300man",
      "furusato-nozei-500man",
      "furusato-nozei-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-800man",
    title:
      "年収800万円のふるさと納税 上限額はいくら？独身・夫婦・子ありで比較",
    shortTitle: "年収800万の上限額",
    description:
      "年収800万円のふるさと納税の上限額の目安は、独身・共働きで約13.1万円。家族構成別の早見表と、寄付先の分け方、住宅ローン控除との関係を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-700man",
      "furusato-nozei-1000man",
      "furusato-nozei-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-1000man",
    title:
      "年収1000万円のふるさと納税 上限額はいくら？独身・夫婦・子ありで比較",
    shortTitle: "年収1000万の上限額",
    description:
      "年収1000万円のふるさと納税の上限額の目安は、独身・共働きで約18.3万円。家族構成別の早見表と、高所得者ならではの注意点（住宅ローン控除・確定申告）を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-800man",
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-jieigyou",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-jieigyou",
    title:
      "自営業・個人事業主のふるさと納税 上限額は？課税所得別の早見表と計算方法",
    shortTitle: "自営業の上限額",
    description:
      "自営業・個人事業主のふるさと納税の上限額は「課税所得」で決まります。課税所得別の早見表と、会社員との違い（ワンストップ特例が使えない等）、計算方法を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-1000man",
      "furusato-nozei-yarikata",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🧑‍💼",
  },
];

// ---- ヘルパー ----
export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** 公開済みガイド */
export function liveGuides(): Guide[] {
  return GUIDES.filter((g) => g.status === "live");
}

/** カテゴリ内の公開済みガイド */
export function guidesInCategory(categorySlug: string): Guide[] {
  return liveGuides().filter((g) => g.category === categorySlug);
}

/** ある計算機に紐づく公開済みガイド（計算機ページの「関連ガイド」用） */
export function guidesForCalculator(calcSlug: string): Guide[] {
  return liveGuides().filter((g) => g.targets.includes(calcSlug));
}

/** 関連ガイドを解決（存在する公開済みのみ） */
export function relatedGuides(slug: string): Guide[] {
  const g = getGuide(slug);
  if (!g) return [];
  return g.related
    .map((s) => getGuide(s))
    .filter((x): x is Guide => x !== undefined && x.status === "live");
}
