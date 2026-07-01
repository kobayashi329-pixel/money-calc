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
    related: ["daigaku-hiyou", "zouyozei-kyoiku"],
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
    targets: ["juuminzei", "tedori"],
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
  {
    slug: "furusato-nozei-350man",
    title:
      "年収350万円のふるさと納税 上限額はいくら？独身・夫婦・子ありで比較",
    shortTitle: "年収350万の上限額",
    description:
      "年収350万円のふるさと納税の上限額の目安は、独身・共働きで約3.5万円。家族構成別の早見表と、少額でも得になる仕組み、ワンストップ特例を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-300man",
      "furusato-nozei-400man",
      "furusato-nozei-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-450man",
    title:
      "年収450万円のふるさと納税 上限額はいくら？独身・夫婦・子ありで比較",
    shortTitle: "年収450万の上限額",
    description:
      "年収450万円のふるさと納税の上限額の目安は、独身・共働きで約5.0万円。家族構成別の早見表と、ワンストップ特例の使い方、おすすめの寄付額を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-400man",
      "furusato-nozei-500man",
      "furusato-nozei-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-900man",
    title:
      "年収900万円のふるさと納税 上限額はいくら？独身・夫婦・子ありで比較",
    shortTitle: "年収900万の上限額",
    description:
      "年収900万円のふるさと納税の上限額の目安は、独身・共働きで約15.6万円。家族構成別の早見表と、寄付先の分け方、住宅ローン控除との関係を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-800man",
      "furusato-nozei-1000man",
      "furusato-nozei-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-1200man",
    title:
      "年収1200万円のふるさと納税 上限額はいくら？独身・夫婦・子ありで比較",
    shortTitle: "年収1200万の上限額",
    description:
      "年収1200万円のふるさと納税の上限額の目安は、独身・共働きで約24.9万円。家族構成別の早見表と、高所得者の注意点（住宅ローン控除・確定申告）を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-1000man",
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-jieigyou",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "furusato-nozei-sengyoshufu",
    title:
      "専業主婦（夫）世帯のふるさと納税 上限額は？配偶者控除がある場合の早見表",
    shortTitle: "専業主婦世帯の上限額",
    description:
      "配偶者を扶養する専業主婦（主夫）世帯は、共働きより上限額が下がります。年収別の早見表と、配偶者控除・配偶者特別控除・パート収入の壁との関係を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-tomobataraki",
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-kosodate",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "furusato-nozei-kosodate",
    title:
      "子供がいる家庭のふるさと納税 上限額は？扶養と年齢でいくら変わるか",
    shortTitle: "子育て世帯の上限額",
    description:
      "子供がいると扶養控除でふるさと納税の上限額が変わります。16歳未満・高校生・大学生で違う扱いと、年収別の早見表をわかりやすく解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-sengyoshufu",
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-500man",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "👨‍👩‍👧",
  },
  {
    slug: "furusato-nozei-itsumade",
    title:
      "ふるさと納税はいつまで？2026年の期限とワンストップ特例の締め切り",
    shortTitle: "ふるさと納税はいつまで",
    description:
      "ふるさと納税の寄付は毎年12月31日まで、ワンストップ特例の申請は翌年1月10日必着。年末の駆け込みで間に合わせる注意点とスケジュールを解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-onestop",
      "furusato-nozei-yarikata",
      "furusato-nozei-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📅",
  },
  {
    slug: "furusato-nozei-onestop",
    title:
      "ふるさと納税ワンストップ特例とは？申請方法・期限・5自治体ルール",
    shortTitle: "ワンストップ特例とは",
    description:
      "ワンストップ特例は確定申告なしで控除を受けられる仕組み。使える条件（寄付先5自治体以内など）、申請書と本人確認書類、1月10日必着の期限を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-kakutei-shinkoku",
      "furusato-nozei-itsumade",
      "furusato-nozei-yarikata",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📮",
  },
  {
    slug: "furusato-nozei-demerit",
    title:
      "ふるさと納税のデメリットは？やめたほうがいい人・損する人を解説",
    shortTitle: "デメリット・注意点",
    description:
      "ふるさと納税は誰でも得とは限りません。上限超過・自己負担2,000円・控除は翌年など、デメリットと「やめたほうがいい人（収入が低い・住宅ローン控除が大きい等）」を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-nenshu-betsu",
      "furusato-nozei-onestop",
      "furusato-nozei-kojo-kakunin",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "⚠️",
  },
  {
    slug: "furusato-nozei-kakutei-shinkoku",
    title:
      "ふるさと納税の確定申告のやり方｜必要書類・書き方・期限を解説",
    shortTitle: "確定申告のやり方",
    description:
      "ワンストップ特例を使わない場合の確定申告の手順を解説。寄附金受領証明書（または寄附金控除に関する証明書）、書き方、e-Tax、期限（原則3月15日）までをまとめます。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-onestop",
      "furusato-nozei-kojo-kakunin",
      "furusato-nozei-itsumade",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📝",
  },
  {
    slug: "furusato-nozei-kojo-kakunin",
    title:
      "ふるさと納税の控除はいつから？住民税決定通知書での確認方法",
    shortTitle: "控除の確認方法",
    description:
      "ふるさと納税の控除は翌年の住民税から。6月ごろの住民税決定通知書で「寄附金税額控除」を確認する方法と、正しく控除されているかのチェック方法を解説します。",
    category: "zei",
    targets: ["furusato-nozei"],
    related: [
      "furusato-nozei-kakutei-shinkoku",
      "furusato-nozei-demerit",
      "furusato-nozei-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🔍",
  },
  {
    slug: "jutaku-loan-nenshu-betsu",
    title:
      "住宅ローンはいくら借りられる？年収別の借入可能額 早見表【2026年】",
    shortTitle: "借入可能額の年収別早見表",
    description:
      "住宅ローンの借入可能額は年収の約5〜7倍が目安。年収300万〜1000万の「無理のない額」と「審査上限の目安」を返済負担率から早見表で解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-loan-500man",
      "jutaku-loan-700man",
      "jutaku-loan-atamakin",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📊",
  },
  {
    slug: "jutaku-loan-300man",
    title:
      "年収300万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収300万の借入可能額",
    description:
      "年収300万円の住宅ローン借入可能額は、無理のない目安で約2,040万円、審査上限の目安で約2,270万円。月々の返済額や無理のない物件価格の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-loan-400man",
      "jutaku-loan-nenshu-betsu",
      "jutaku-loan-atamakin",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-400man",
    title:
      "年収400万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収400万の借入可能額",
    description:
      "年収400万円の住宅ローン借入可能額は、無理のない目安で約2,720万円、審査上限の目安で約3,030万円。月々の返済額や無理のない物件価格の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-loan-300man",
      "jutaku-loan-500man",
      "jutaku-loan-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-500man",
    title:
      "年収500万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収500万の借入可能額",
    description:
      "年収500万円の住宅ローン借入可能額は、無理のない目安で約3,400万円、審査上限の目安で約3,790万円。月々の返済額や無理のない物件価格の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-loan-400man",
      "jutaku-loan-600man",
      "jutaku-loan-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-600man",
    title:
      "年収600万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収600万の借入可能額",
    description:
      "年収600万円の住宅ローン借入可能額は、無理のない目安で約4,080万円、審査上限の目安で約4,550万円。月々の返済額や無理のない物件価格の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-loan-500man",
      "jutaku-loan-700man",
      "jutaku-loan-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-700man",
    title:
      "年収700万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収700万の借入可能額",
    description:
      "年収700万円の住宅ローン借入可能額は、無理のない目安で約4,760万円、審査上限の目安で約5,310万円。月々の返済額や無理のない物件価格の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-loan-600man",
      "jutaku-loan-800man",
      "jutaku-loan-pair",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-800man",
    title:
      "年収800万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収800万の借入可能額",
    description:
      "年収800万円の住宅ローン借入可能額は、無理のない目安で約5,440万円、審査上限の目安で約6,060万円。月々の返済額や借りすぎないための考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-loan-700man",
      "jutaku-loan-1000man",
      "jutaku-loan-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-1000man",
    title:
      "年収1000万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収1000万の借入可能額",
    description:
      "年収1000万円の住宅ローン借入可能額は、無理のない目安で約6,800万円、審査上限の目安で約7,580万円。高年収でも借りすぎないための考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-loan-800man",
      "jutaku-loan-nenshu-betsu",
      "jutaku-loan-pair",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-pair",
    title:
      "共働き夫婦の住宅ローン｜ペアローン・収入合算でいくら借りられる？",
    shortTitle: "共働き・ペアローン",
    description:
      "共働きなら収入合算やペアローンで借入可能額を増やせます。合算の方法（連帯保証・連帯債務・ペアローン）の違いと、住宅ローン控除・団信の注意点を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-loan-nenshu-betsu",
      "jutaku-loan-600man",
      "jutaku-loan-atamakin",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "👫",
  },

  // ===== 住宅ローン 借入額別の返済額クラスター（loan） =====
  {
    slug: "jutaku-hensai-betsu",
    title:
      "住宅ローンの毎月返済額 早見表｜借入額別（1000万〜5000万）・金利別の目安",
    shortTitle: "返済額の借入額別早見表",
    description:
      "住宅ローンの毎月返済額を借入額別・金利別の早見表で確認。1,000万〜5,000万円を金利0.5〜2%・35年で試算した目安と、総返済額・利息の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-2000man-hensai",
      "jutaku-3000man-hensai",
      "jutaku-loan-nenshu-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📊",
  },
  {
    slug: "jutaku-1000man-hensai",
    title: "住宅ローン1000万円の毎月返済額はいくら？金利別の目安と総返済額",
    shortTitle: "1000万ローンの返済額",
    description:
      "住宅ローン1,000万円を35年で借りた場合の毎月返済額は、金利1%で約28,229円。金利別の返済額・総返済額の目安と、無理のない年収の目安を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-2000man-hensai",
      "jutaku-hensai-betsu",
      "jutaku-loan-300man",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-2000man-hensai",
    title: "住宅ローン2000万円の毎月返済額はいくら？金利別の目安と総返済額",
    shortTitle: "2000万ローンの返済額",
    description:
      "住宅ローン2,000万円を35年で借りた場合の毎月返済額は、金利1%で約56,457円。金利別の返済額・総返済額の目安と、無理のない年収の目安を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-2500man-hensai",
      "jutaku-3000man-hensai",
      "jutaku-hensai-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-2500man-hensai",
    title: "住宅ローン2500万円の毎月返済額はいくら？金利別の目安と総返済額",
    shortTitle: "2500万ローンの返済額",
    description:
      "住宅ローン2,500万円を35年で借りた場合の毎月返済額は、金利1%で約70,571円。金利別の返済額・総返済額の目安と、無理のない年収の目安を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-2000man-hensai",
      "jutaku-3000man-hensai",
      "jutaku-hensai-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-4000man-hensai",
    title: "住宅ローン4000万円の毎月返済額はいくら？金利別の目安と総返済額",
    shortTitle: "4000万ローンの返済額",
    description:
      "住宅ローン4,000万円を35年で借りた場合の毎月返済額は、金利1%で約112,914円。金利別の返済額・総返済額の目安と、無理のない年収の目安を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-3000man-hensai",
      "jutaku-5000man-hensai",
      "jutaku-hensai-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-5000man-hensai",
    title: "住宅ローン5000万円の毎月返済額はいくら？金利別の目安と総返済額",
    shortTitle: "5000万ローンの返済額",
    description:
      "住宅ローン5,000万円を35年で借りた場合の毎月返済額は、金利1%で約141,143円。金利別の返済額・総返済額の目安と、無理のない年収の目安を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: [
      "jutaku-4000man-hensai",
      "jutaku-hensai-betsu",
      "jutaku-loan-1000man",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },

  // ===== NISA クラスター強化（toshi）＝サーチコンソールで表示されているクエリ =====
  {
    slug: "nisa-seichou-toushiwaku",
    title: "新NISAの成長投資枠とは？対象商品・年240万円の使い方をわかりやすく",
    shortTitle: "成長投資枠とは",
    description:
      "新NISAの成長投資枠は年間240万円・生涯1,200万円まで。個別株・ETF・投資信託が対象で、つみたて投資枠との違いや使い方をわかりやすく解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: [
      "nisa-tsumitate-toushiwaku",
      "shin-nisa-waku",
      "nisa-tsukini-ikura",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📈",
  },
  {
    slug: "nisa-tsumitate-toushiwaku",
    title: "新NISAのつみたて投資枠とは？対象商品・年120万円の使い方を解説",
    shortTitle: "つみたて投資枠とは",
    description:
      "新NISAのつみたて投資枠は年間120万円まで。金融庁が選んだ長期・積立向けの投資信託が対象で、成長投資枠との違いや初心者の使い方を解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: [
      "nisa-seichou-toushiwaku",
      "shin-nisa-waku",
      "nisa-tsukini-ikura",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📈",
  },
  {
    slug: "nisa-kojin-jigyounushi",
    title: "個人事業主・フリーランスのNISA｜経費にできる？節税になる？",
    shortTitle: "個人事業主のNISA",
    description:
      "NISAの掛金は経費にできず所得控除もありません。個人事業主・フリーランスがNISA・iDeCo・小規模企業共済をどう使い分けるか、節税の観点から解説します。",
    category: "toshi",
    targets: ["nisa", "ideco"],
    related: [
      "nisa-ideco-dochira",
      "furusato-nozei-jieigyou",
      "nisa-seichou-toushiwaku",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🧑‍💼",
  },

  // ===== 退職金クラスター（nenkin）＝サーチコンソールで「定年退職金 計算」表示中 =====
  {
    slug: "taishokukin-kingaku-betsu",
    title:
      "退職金の手取り早見表｜金額別・勤続年数別の税金（1000万〜3000万）",
    shortTitle: "退職金の手取り早見表",
    description:
      "退職金の手取りは金額と勤続年数で決まります。1,000万〜3,000万円を勤続20〜38年で試算した税金・手取りの早見表と、退職所得控除・1/2課税の仕組みを解説します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: [
      "taishokukin-2000man",
      "taishokukin-zeikin",
      "taishokukin-heikin",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📊",
  },
  {
    slug: "taishokukin-1000man",
    title: "退職金1000万円の手取りはいくら？勤続年数別の税金の目安",
    shortTitle: "退職金1000万の手取り",
    description:
      "退職金1,000万円の手取りは、勤続25年以上なら税金0で全額手取りになるケースも。勤続年数別の税金・手取りの目安と、退職所得控除の仕組みを解説します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: [
      "taishokukin-1500man",
      "taishokukin-kingaku-betsu",
      "taishokukin-zeikin",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },
  {
    slug: "taishokukin-1500man",
    title: "退職金1500万円の手取りはいくら？勤続年数別の税金の目安",
    shortTitle: "退職金1500万の手取り",
    description:
      "退職金1,500万円の手取りは、勤続30年以上なら税金0で全額手取りになるケースも。勤続年数別の税金・手取りの目安と、退職所得控除の仕組みを解説します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: [
      "taishokukin-1000man",
      "taishokukin-2000man",
      "taishokukin-kingaku-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },
  {
    slug: "taishokukin-2000man",
    title: "退職金2000万円の手取りはいくら？勤続年数別の税金の目安",
    shortTitle: "退職金2000万の手取り",
    description:
      "退職金2,000万円の手取りは、勤続38年（定年）なら退職所得控除2,060万円で税金0。勤続20年だと税金約139万円。勤続年数別の税金・手取りを解説します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: [
      "taishokukin-1500man",
      "taishokukin-2500man",
      "taishokukin-kingaku-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },
  {
    slug: "taishokukin-2500man",
    title: "退職金2500万円の手取りはいくら？勤続年数別の税金の目安",
    shortTitle: "退職金2500万の手取り",
    description:
      "退職金2,500万円の手取りは、勤続38年（定年）で税金約35万円・手取り約2,466万円。勤続年数別の税金・手取りの目安と、退職所得控除の仕組みを解説します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: [
      "taishokukin-2000man",
      "taishokukin-3000man",
      "taishokukin-kingaku-betsu",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },
  {
    slug: "taishokukin-3000man",
    title: "退職金3000万円の手取りはいくら？勤続年数別の税金の目安",
    shortTitle: "退職金3000万の手取り",
    description:
      "退職金3,000万円の手取りは、勤続38年（定年）で税金約99万円・手取り約2,901万円。勤続年数別の税金・手取りの目安と、退職所得控除の仕組みを解説します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: [
      "taishokukin-2500man",
      "taishokukin-kingaku-betsu",
      "taishokukin-zeikin",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },
  {
    slug: "taishokukin-heikin",
    title: "退職金の平均はいくら？大卒・高卒・中小・公務員の相場",
    shortTitle: "退職金の平均・相場",
    description:
      "退職金の平均額は、大卒の定年退職で約1,900万円が目安（厚生労働省調査）。学歴・企業規模・退職理由による相場の違いと、手取りの考え方を解説します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: [
      "taishokukin-2000man",
      "taishokukin-kingaku-betsu",
      "rougo-2000man",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📈",
  },
  {
    slug: "taishokukin-kakutei-shinkoku",
    title: "退職金に確定申告は必要？「受給に関する申告書」と還付されるケース",
    shortTitle: "退職金と確定申告",
    description:
      "「退職所得の受給に関する申告書」を勤務先に出せば、原則確定申告は不要です。出さないと一律20.42%が源泉徴収され、確定申告で取り戻すことになります。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: [
      "taishokukin-zeikin",
      "taishokukin-kingaku-betsu",
      "taishokukin-2000man",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📝",
  },

  // ===== 相続税クラスター（zei） =====
  {
    slug: "sozokuzei-isan-betsu",
    title:
      "相続税はいくら？遺産総額別・相続人別の早見表（5000万〜2億）",
    shortTitle: "相続税の遺産総額別早見表",
    description:
      "相続税の納税額を遺産総額別・相続人別の早見表で確認。遺産5,000万〜2億円を配偶者あり/なし・子の人数別に試算した目安と、基礎控除・配偶者の税額軽減を解説します。",
    category: "zei",
    targets: ["sozokuzei"],
    related: [
      "sozokuzei-ikura-kara",
      "sozokuzei-haiguusha-keigen",
      "sozokuzei-1oku",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📊",
  },
  {
    slug: "sozokuzei-haiguusha-keigen",
    title: "配偶者の相続税はゼロになる？配偶者の税額軽減（1.6億円）を解説",
    shortTitle: "配偶者の税額軽減",
    description:
      "配偶者が相続した財産は「1億6,000万円」または「法定相続分」まで相続税がかかりません。配偶者の税額軽減の仕組みと、使うときの注意点（二次相続）を解説します。",
    category: "zei",
    targets: ["sozokuzei"],
    related: [
      "sozokuzei-isan-betsu",
      "sozokuzei-ikura-kara",
      "sozokuzei-1oku",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💑",
  },
  {
    slug: "sozokuzei-5000man",
    title: "遺産5000万円の相続税はいくら？相続人別の早見表と計算方法",
    shortTitle: "遺産5000万の相続税",
    description:
      "遺産5,000万円の相続税は、配偶者と子2人なら約10万円、子2人のみなら約80万円が目安。基礎控除を超えた分にかかる相続税を相続人別に解説します。",
    category: "zei",
    targets: ["sozokuzei"],
    related: [
      "sozokuzei-1oku",
      "sozokuzei-isan-betsu",
      "sozokuzei-ikura-kara",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },
  {
    slug: "sozokuzei-1oku",
    title: "遺産1億円の相続税はいくら？相続人別の早見表と計算方法",
    shortTitle: "遺産1億円の相続税",
    description:
      "遺産1億円の相続税は、配偶者と子2人なら約315万円、子2人のみなら約770万円が目安。配偶者の税額軽減を使った場合の負担と計算方法を相続人別に解説します。",
    category: "zei",
    targets: ["sozokuzei"],
    related: [
      "sozokuzei-5000man",
      "sozokuzei-isan-betsu",
      "sozokuzei-haiguusha-keigen",
    ],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },

  // ===== NISA 年代別クラスター（toshi） =====
  {
    slug: "nisa-20dai",
    title: "20代のNISAはいくら積み立てる？40年運用のシミュレーション",
    shortTitle: "20代のNISA",
    description:
      "20代は運用期間が長く、複利の効果を最大限に活かせます。月1万〜5万円を年5%・40年積み立てた場合の将来額と、無理のない始め方を解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-30dai", "nisa-tsukini-ikura", "shin-nisa-waku"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📈",
  },
  {
    slug: "nisa-30dai",
    title: "30代のNISAはいくら積み立てる？30年運用のシミュレーション",
    shortTitle: "30代のNISA",
    description:
      "30代は教育費・住宅とのバランスを取りつつ、30年の運用期間を活かせます。月1万〜5万円を年5%・30年積み立てた場合の将来額と始め方を解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-20dai", "nisa-40dai", "nisa-tsukini-ikura"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📈",
  },
  {
    slug: "nisa-40dai",
    title: "40代のNISAはいくら積み立てる？20年運用のシミュレーション",
    shortTitle: "40代のNISA",
    description:
      "40代は老後資金づくりの本番。残り20年でも複利は十分に効きます。月1万〜5万円を年5%・20年積み立てた場合の将来額と、無理のない金額を解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-30dai", "nisa-50dai", "nisa-tsukini-ikura"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📈",
  },
  {
    slug: "nisa-50dai",
    title: "50代から新NISAは遅い？10年運用のシミュレーションと始め方",
    shortTitle: "50代のNISA",
    description:
      "50代から新NISAを始めても遅くありません。月1万〜5万円を年5%・10年積み立てた場合の将来額と、退職金・年金とあわせた老後資金の考え方を解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-40dai", "nisa-tsukini-ikura", "rougo-2000man"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📈",
  },

  // ===== iDeCo クラスター（toshi） =====
  {
    slug: "ideco-kakekin-jougen",
    title: "iDeCoの掛金はいくらまで？職業・加入区分別の上限額（月額）",
    shortTitle: "iDeCoの掛金上限",
    description:
      "iDeCoの掛金の上限は、会社員（企業年金なし）で月2.3万円、自営業で月6.8万円、公務員で月2万円など職業で異なります。加入区分別の上限額と決め方を解説します。",
    category: "toshi",
    targets: ["ideco"],
    related: ["ideco-setsuzei", "ideco-merit", "nisa-ideco-dochira"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📊",
  },
  {
    slug: "ideco-setsuzei",
    title: "iDeCoの節税額はいくら？年収別の年間節税シミュレーション",
    shortTitle: "iDeCoの節税額",
    description:
      "iDeCoの掛金は全額所得控除。会社員が月2.3万円拠出すると、年収500万円で年約5.6万円、年収700万円で年約8.4万円の節税になります。年収別の節税額を解説します。",
    category: "toshi",
    targets: ["ideco"],
    related: ["ideco-kakekin-jougen", "ideco-merit", "ideco-demerit"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💰",
  },
  {
    slug: "ideco-merit",
    title: "iDeCoのメリットは？3つの税制優遇をわかりやすく解説",
    shortTitle: "iDeCoのメリット",
    description:
      "iDeCoには「掛金が全額所得控除」「運用益が非課税」「受取時も控除」の3つの税制優遇があります。NISAとの違いも含め、メリットをわかりやすく解説します。",
    category: "toshi",
    targets: ["ideco"],
    related: ["ideco-demerit", "ideco-setsuzei", "nisa-ideco-dochira"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "✅",
  },
  {
    slug: "ideco-uketori",
    title: "iDeCoの受け取り方｜一時金と年金どっちが得？税金の違いを解説",
    shortTitle: "iDeCoの受け取り方",
    description:
      "iDeCoは60歳以降に一時金・年金・併用で受け取れます。一時金は退職所得控除、年金は公的年金等控除の対象。退職金との重複に注意した受け取り方を解説します。",
    category: "toshi",
    targets: ["ideco"],
    related: ["ideco-merit", "taishokukin-kingaku-betsu", "ideco-50dai"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🧾",
  },
  {
    slug: "ideco-40dai",
    title: "40代からのiDeCoは遅い？20年運用と節税のシミュレーション",
    shortTitle: "40代のiDeCo",
    description:
      "40代からiDeCoを始めても十分間に合います。会社員が月2.3万円・年5%で20年運用すると評価額は約945万円、節税は累計約112万円。40代の始め方を解説します。",
    category: "toshi",
    targets: ["ideco"],
    related: ["ideco-50dai", "ideco-setsuzei", "nisa-40dai"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📈",
  },
  {
    slug: "ideco-50dai",
    title: "50代からのiDeCoは意味ある？10年運用と節税のシミュレーション",
    shortTitle: "50代のiDeCo",
    description:
      "50代からのiDeCoも節税メリットは十分。会社員が月2.3万円・年5%で10年運用すると評価額は約357万円、節税は累計約56万円。受け取り方の注意点も解説します。",
    category: "toshi",
    targets: ["ideco"],
    related: ["ideco-40dai", "ideco-uketori", "nisa-50dai"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📈",
  },

  // ===== 年収手取りシリーズ拡充（kyuyo・既存クラスター深掘り） =====
  {
    slug: "nenshu-tedori-ichiran",
    title: "年収別の手取り早見表｜300万〜1000万の手取り・月収一覧",
    shortTitle: "年収別手取りの早見表",
    description:
      "年収別の手取りを早見表で確認。年収300万〜1,000万円の手取り額・月収・手取り率の一覧と、年収が上がるほど手取り率が下がる理由を解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-500man-tedori", "nenshu-450man-tedori", "juuminzei-ikura"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📊",
  },
  {
    slug: "nenshu-350man-tedori",
    title: "年収350万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収350万の手取り",
    description:
      "年収350万円の手取りは約279万円・月約23万円。所得税・住民税・社会保険料の内訳と、手取りを増やす方法をわかりやすく解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-300man-tedori", "nenshu-400man-tedori", "nenshu-tedori-ichiran"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },
  {
    slug: "nenshu-450man-tedori",
    title: "年収450万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収450万の手取り",
    description:
      "年収450万円の手取りは約355万円・月約30万円。所得税・住民税・社会保険料の内訳と、手取りを増やす方法をわかりやすく解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-400man-tedori", "nenshu-500man-tedori", "nenshu-tedori-ichiran"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },
  {
    slug: "nenshu-550man-tedori",
    title: "年収550万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収550万の手取り",
    description:
      "年収550万円の手取りは約427万円・月約36万円。所得税・住民税・社会保険料の内訳と、手取りを増やす方法をわかりやすく解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-500man-tedori", "nenshu-600man-tedori", "nenshu-tedori-ichiran"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },
  {
    slug: "nenshu-650man-tedori",
    title: "年収650万円の手取りはいくら？税金・社会保険料の内訳と月収",
    shortTitle: "年収650万の手取り",
    description:
      "年収650万円の手取りは約499万円・月約42万円。所得税・住民税・社会保険料の内訳と、手取りを増やす方法をわかりやすく解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["nenshu-600man-tedori", "nenshu-700man-tedori", "nenshu-tedori-ichiran"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "💴",
  },

  // ===== 住宅ローン借入可能額 年収帯gap（loan） =====
  {
    slug: "jutaku-loan-450man",
    title:
      "年収450万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収450万の借入可能額",
    description:
      "年収450万円の住宅ローン借入可能額は、無理のない目安で約3,060万円、審査上限の目安で約3,410万円。月々の返済額や無理のない物件価格の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-400man", "jutaku-loan-500man", "jutaku-loan-nenshu-betsu"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-550man",
    title:
      "年収550万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収550万の借入可能額",
    description:
      "年収550万円の住宅ローン借入可能額は、無理のない目安で約3,740万円、審査上限の目安で約4,170万円。月々の返済額や無理のない物件価格の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-500man", "jutaku-loan-600man", "jutaku-loan-nenshu-betsu"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-650man",
    title:
      "年収650万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収650万の借入可能額",
    description:
      "年収650万円の住宅ローン借入可能額は、無理のない目安で約4,420万円、審査上限の目安で約4,930万円。月々の返済額や無理のない物件価格の考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-600man", "jutaku-loan-700man", "jutaku-loan-nenshu-betsu"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-900man",
    title:
      "年収900万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収900万の借入可能額",
    description:
      "年収900万円の住宅ローン借入可能額は、無理のない目安で約6,120万円、審査上限の目安で約6,820万円。借りすぎないための考え方とあわせて解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-800man", "jutaku-loan-1000man", "jutaku-loan-nenshu-betsu"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "jutaku-loan-1200man",
    title:
      "年収1200万円で住宅ローンはいくら借りられる？借入可能額と月返済額の目安",
    shortTitle: "年収1200万の借入可能額",
    description:
      "年収1200万円の住宅ローン借入可能額は、無理のない目安で約8,170万円、審査上限の目安で約9,090万円。高年収でも借りすぎないための考え方を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-1000man", "jutaku-loan-nenshu-betsu", "jutaku-loan-pair"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },

  // ===== 贈与税クラスター（zei） =====
  {
    slug: "zouyozei-ikura",
    title: "贈与税はいくら？金額別の早見表と計算方法（暦年課税）",
    shortTitle: "贈与税の金額別早見表",
    description:
      "贈与税は年間110万円の基礎控除を超えた分にかかります。贈与額別の税額の早見表（特例税率・一般税率）と計算方法、非課税にする方法をわかりやすく解説します。",
    category: "zei",
    targets: ["zouyozei", "sozokuzei"],
    related: ["zouyozei-rekinen", "zouyozei-jutaku", "sozokuzei-isan-betsu"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📊",
  },
  {
    slug: "zouyozei-rekinen",
    title: "年間110万円までの贈与は非課税｜暦年贈与と相続対策のポイント",
    shortTitle: "暦年贈与（110万円）",
    description:
      "贈与税には年間110万円の基礎控除があり、その範囲内なら非課税です。暦年贈与を使った相続対策のポイントと、注意点（生前贈与加算）を解説します。",
    category: "zei",
    targets: ["zouyozei", "sozokuzei"],
    related: ["zouyozei-ikura", "sozokuzei-isan-betsu", "sozokuzei-haiguusha-keigen"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎁",
  },
  {
    slug: "zouyozei-jutaku",
    title: "住宅取得資金の贈与は非課税に｜親からの援助でいくらまで？",
    shortTitle: "住宅取得資金の贈与",
    description:
      "マイホーム購入のための親・祖父母からの資金援助は、一定額まで贈与税が非課税になります。非課税の上限・条件と、住宅ローンとの組み合わせ方を解説します。",
    category: "zei",
    targets: ["zouyozei", "sozokuzei"],
    related: ["zouyozei-ikura", "zouyozei-rekinen", "jutaku-loan-nenshu-betsu"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "zouyozei-kyoiku",
    title: "教育資金の一括贈与は1500万円まで非課税｜制度と注意点",
    shortTitle: "教育資金の一括贈与",
    description:
      "祖父母などからの教育資金は、一括贈与の特例で最大1,500万円まで非課税にできます。制度の条件・使い道・使い残しの扱いと、暦年贈与との違いを解説します。",
    category: "zei",
    targets: ["zouyozei", "sozokuzei"],
    related: ["zouyozei-rekinen", "zouyozei-ikura", "daigaku-hiyou"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎓",
  },

  // ===== 教育費 深掘り（life） =====
  {
    slug: "daigaku-hiyou",
    title: "大学の費用はいくら？国公立・私立文系・理系の4年間の総額",
    shortTitle: "大学の費用",
    description:
      "大学4年間の費用は、国公立で約240万円、私立文系で約410万円、私立理系で約550万円が目安。入学費用・在学費用の内訳と、準備方法（学資保険・NISA）を解説します。",
    category: "life",
    targets: ["kyoiku-shikin"],
    related: ["kyoikuhi-ikura", "zouyozei-kyoiku", "nisa-tsukini-ikura"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🎓",
  },

  // ===== 相続税 深掘り（zei） =====
  {
    slug: "sozokuzei-shoukibo-takuchi",
    title: "小規模宅地等の特例とは｜自宅の土地の評価が最大80%減",
    shortTitle: "小規模宅地等の特例",
    description:
      "小規模宅地等の特例を使うと、自宅の土地（330㎡まで）の相続税評価額が最大80%減額されます。対象・要件・減額割合と、使うときの注意点を解説します。",
    category: "zei",
    targets: ["sozokuzei"],
    related: ["sozokuzei-isan-betsu", "sozokuzei-seimei-hoken", "sozokuzei-shinkoku"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "sozokuzei-seimei-hoken",
    title: "生命保険金の相続税は非課税枠あり｜500万円×法定相続人",
    shortTitle: "生命保険の非課税枠",
    description:
      "死亡保険金には「500万円×法定相続人の数」の非課税枠があります。相続税対策としての生命保険の使い方と、課税される場合の計算方法を解説します。",
    category: "zei",
    targets: ["sozokuzei"],
    related: ["sozokuzei-shoukibo-takuchi", "sozokuzei-isan-betsu", "zouyozei-rekinen"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🛡️",
  },
  {
    slug: "sozokuzei-shinkoku",
    title: "相続税の申告期限は10か月｜必要書類と申告の流れ",
    shortTitle: "相続税の申告・期限",
    description:
      "相続税の申告・納税の期限は、相続開始を知った日の翌日から10か月以内です。必要書類・申告の流れ・期限に間に合わないときの対応を解説します。",
    category: "zei",
    targets: ["sozokuzei"],
    related: ["sozokuzei-isan-betsu", "sozokuzei-shoukibo-takuchi", "sozokuzei-niji"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📝",
  },
  {
    slug: "sozokuzei-niji",
    title: "二次相続とは｜配偶者の税額軽減を使いすぎると損する理由",
    shortTitle: "二次相続の対策",
    description:
      "一次相続で配偶者にすべて相続させると、二次相続（配偶者の相続）で子の相続税が高くなることがあります。二次相続まで見据えた分け方のポイントを解説します。",
    category: "zei",
    targets: ["sozokuzei"],
    related: ["sozokuzei-haiguusha-keigen", "sozokuzei-isan-betsu", "zouyozei-rekinen"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "👪",
  },

  // ===== 公的年金 深掘り（nenkin） =====
  {
    slug: "nenkin-nenshu-betsu",
    title: "年金は年収別にいくらもらえる？会社員の受給見込み早見表",
    shortTitle: "年金の年収別早見表",
    description:
      "会社員の年金は、年収300万円で月約12万円、年収500万円で月約16万円、年収700万円で月約20万円が目安。年収別・加入年数別の受給見込み額を解説します。",
    category: "nenkin",
    targets: ["nenkin-mikomi"],
    related: ["nenkin-kousei", "nenkin-kokumin", "nenkin-kurisage"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📊",
  },
  {
    slug: "nenkin-kousei",
    title: "厚生年金はいくらもらえる？年収・加入年数別の目安",
    shortTitle: "厚生年金はいくら",
    description:
      "厚生年金（報酬比例部分）は、年収と加入年数で決まります。年収500万円で40年加入なら年約110万円が目安。基礎年金とあわせた受給額の計算方法を解説します。",
    category: "nenkin",
    targets: ["nenkin-mikomi"],
    related: ["nenkin-nenshu-betsu", "nenkin-kokumin", "nenkin-kurisage"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🧾",
  },
  {
    slug: "nenkin-kokumin",
    title: "国民年金はいくら？満額・納付月数別の受給額（令和7年度）",
    shortTitle: "国民年金はいくら",
    description:
      "国民年金（老齢基礎年金）の満額は、令和7年度で月約6.9万円・年約83万円。納付月数で変わる受給額と、自営業・フリーランスの年金の増やし方を解説します。",
    category: "nenkin",
    targets: ["nenkin-mikomi"],
    related: ["nenkin-sengyoshufu", "nenkin-nenshu-betsu", "nenkin-kousei"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🗾",
  },
  {
    slug: "nenkin-sengyoshufu",
    title: "専業主婦（第3号）の年金はいくら？将来もらえる額と注意点",
    shortTitle: "専業主婦の年金",
    description:
      "専業主婦・主夫（第3号被保険者）は、保険料負担なしで国民年金を受け取れます。満額で月約6.9万円。働き方が変わったときの切り替えと注意点を解説します。",
    category: "nenkin",
    targets: ["nenkin-mikomi"],
    related: ["nenkin-kokumin", "nenkin-nenshu-betsu", "furusato-nozei-sengyoshufu"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },

  // ===== 自動車税 関連ガイド（zei） =====
  {
    slug: "jidoshazei-itsumade",
    title: "自動車税はいつ払う？納付期限と払い忘れたときの対応",
    shortTitle: "自動車税はいつ払う",
    description:
      "自動車税（種別割）は毎年5月末まで（自治体により6月末）に納めます。納付方法・払い忘れたときの延滞金・車検への影響をわかりやすく解説します。",
    category: "zei",
    targets: ["jidoshazei"],
    related: ["jidoshazei-kei", "kotei-itsumade"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🚗",
  },
  {
    slug: "jidoshazei-kei",
    title: "軽自動車税はいくら？普通車との違いと13年超の重課",
    shortTitle: "軽自動車税はいくら",
    description:
      "軽自動車税（種別割）は自家用乗用で年10,800円。普通自動車の自動車税との違い、13年超の重課（12,900円）、いつ払うかを解説します。",
    category: "zei",
    targets: ["jidoshazei"],
    related: ["jidoshazei-itsumade"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🚙",
  },

  // ===== 固定資産税 関連ガイド（zei） =====
  {
    slug: "kotei-heikin",
    title: "固定資産税の平均はいくら？一戸建て・マンションの目安",
    shortTitle: "固定資産税の平均",
    description:
      "固定資産税は、一戸建てで年10万〜15万円、マンションで年8万〜15万円が一つの目安。評価額・住宅用地の特例による違いと、平均の考え方を解説します。",
    category: "zei",
    targets: ["kotei-shisanzei"],
    related: ["kotei-shinchiku", "kotei-itsumade"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏡",
  },
  {
    slug: "kotei-shinchiku",
    title: "新築の固定資産税はいくら？軽減措置と3年後に上がる理由",
    shortTitle: "新築の固定資産税",
    description:
      "新築住宅は一定期間、建物の固定資産税が1/2に軽減されます。軽減の期間・要件と、軽減が終わって税額が上がるタイミングをわかりやすく解説します。",
    category: "zei",
    targets: ["kotei-shisanzei"],
    related: ["kotei-heikin", "kotei-itsumade"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏠",
  },
  {
    slug: "kotei-itsumade",
    title: "固定資産税はいつ払う？納付時期と分割・一括の選び方",
    shortTitle: "固定資産税はいつ払う",
    description:
      "固定資産税・都市計画税は、4〜6月ごろに納税通知書が届き、年4回の分割または一括で納めます。納付時期・支払方法・お得な払い方を解説します。",
    category: "zei",
    targets: ["kotei-shisanzei"],
    related: ["kotei-heikin", "kotei-shinchiku"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📅",
  },

  // ===== 年収の壁／扶養 深掘り（kyuyo・既存クラスター強化） =====
  {
    slug: "kabe-106man",
    title: "106万円の壁とは？社会保険に加入する条件と手取りへの影響",
    shortTitle: "106万円の壁",
    description:
      "106万円の壁は、一定の勤務先で社会保険（厚生年金・健康保険）に加入する年収ラインです。加入条件・手取りの減り方・将来の年金が増えるメリットを解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["kabe-130man", "nenshu-no-kabe", "fuyou-ikura"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🧱",
  },
  {
    slug: "kabe-130man",
    title: "130万円の壁とは？扶養を外れるラインと働き損の考え方",
    shortTitle: "130万円の壁",
    description:
      "130万円の壁は、配偶者などの社会保険の扶養から外れ、自分で社会保険料を払うラインです。手取りが減る「働き損」と、それでも働くメリットを解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["kabe-106man", "kabe-150man", "fuyou-ikura"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🧱",
  },
  {
    slug: "kabe-150man",
    title: "150万円・160万円の壁とは？配偶者特別控除と所得税の壁",
    shortTitle: "150万円の壁",
    description:
      "150万円の壁は配偶者特別控除が満額受けられる上限、2025年からの所得税の壁は160万円。配偶者控除・配偶者特別控除の仕組みをわかりやすく解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["kabe-130man", "nenshu-no-kabe", "fuyou-ikura"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🧱",
  },
  {
    slug: "fuyou-ikura",
    title: "扶養はいくらまで？税金・社会保険の扶養の年収条件まとめ",
    shortTitle: "扶養はいくらまで",
    description:
      "「扶養の範囲内」には税金の扶養と社会保険の扶養の2種類があります。所得税・住民税・社会保険それぞれの年収ラインを一覧でわかりやすく解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["kabe-130man", "kabe-106man", "nenshu-no-kabe"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "👪",
  },

  // ===== 住民税 計算機の関連ガイド（kyuyo） =====
  {
    slug: "juuminzei-itsu",
    title: "住民税はいつから払う？2年目・退職後・徴収方法をわかりやすく",
    shortTitle: "住民税はいつから",
    description:
      "住民税は前年の所得に対して翌年6月から課税されます。新社会人が2年目から引かれる理由、退職・転職時の支払い、特別徴収と普通徴収の違いを解説します。",
    category: "kyuyo",
    targets: ["juuminzei"],
    related: ["juuminzei-ikura", "nenshu-tedori-ichiran"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🏛️",
  },

  // ===== 社会保険料 計算機の関連ガイド（kyuyo） =====
  {
    slug: "hyoujun-houshuu",
    title: "標準報酬月額とは？社会保険料の決まり方をわかりやすく解説",
    shortTitle: "標準報酬月額とは",
    description:
      "社会保険料は「標準報酬月額」をもとに計算されます。標準報酬月額の決まり方（等級表）と、健康保険・厚生年金の保険料への影響をわかりやすく解説します。",
    category: "kyuyo",
    targets: ["shahoken"],
    related: ["shahoken-4-6gatsu", "nenshu-tedori-ichiran"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📐",
  },
  {
    slug: "shahoken-4-6gatsu",
    title: "社会保険料は4〜6月の給料で決まる？定時決定と残業の関係",
    shortTitle: "社会保険料と4〜6月",
    description:
      "社会保険料は、毎年4〜6月の給与をもとに「定時決定」で1年分が決まります。この時期の残業で保険料が上がる仕組みと、知っておきたい注意点を解説します。",
    category: "kyuyo",
    targets: ["shahoken"],
    related: ["hyoujun-houshuu", "nenshu-tedori-ichiran"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "📅",
  },

  // ===== 贈与税 計算機の関連ガイド（zei） =====
  {
    slug: "souzoku-seisan-kazei",
    title: "相続時精算課税とは？2500万円まで贈与税が非課税になる制度",
    shortTitle: "相続時精算課税",
    description:
      "相続時精算課税は、累計2,500万円までの贈与に贈与税がかからない制度です（相続時に精算）。2024年から年110万円の基礎控除も新設。暦年課税との違いを解説します。",
    category: "zei",
    targets: ["zouyozei", "sozokuzei"],
    related: ["zouyozei-ikura", "zouyozei-rekinen", "sozokuzei-isan-betsu"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🔄",
  },
  {
    slug: "zouyozei-bareru",
    title: "贈与税は申告しないとばれる？税務署に把握される理由と加算税",
    shortTitle: "贈与税はばれる？",
    description:
      "贈与の申告をしないと、不動産登記・保険金・相続調査などから税務署に把握されることがあります。無申告のペナルティ（加算税・延滞税）と正しい申告を解説します。",
    category: "zei",
    targets: ["zouyozei"],
    related: ["zouyozei-ikura", "zouyozei-oyako", "zouyozei-rekinen"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "🔍",
  },
  {
    slug: "zouyozei-oyako",
    title: "親子間の贈与はいくらまで非課税？生活費・仕送りの扱い",
    shortTitle: "親子間の贈与",
    description:
      "親子間でも年110万円を超える贈与には贈与税がかかります。一方、通常必要な生活費・教育費を都度渡す分は非課税。親子間の贈与の非課税ラインを解説します。",
    category: "zei",
    targets: ["zouyozei"],
    related: ["zouyozei-rekinen", "zouyozei-bareru", "zouyozei-ikura"],
    status: "live",
    updated: "2026年6月24日",
    emoji: "👨‍👧",
  },

  // ===== NISA・投資 クラスター深掘り（toshi） =====
  {
    slug: "nisa-1800man",
    title: "新NISAの1800万円はいつ埋まる？生涯投資枠の使い方と年数",
    shortTitle: "NISAの1800万円枠",
    description:
      "新NISAの生涯投資枠は1,800万円。毎月いくらで何年で埋まるか（満額5年〜月3万50年）と、枠の再利用・成長投資枠1,200万円の上限をわかりやすく解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-tsukini-ikura", "shin-nisa-waku", "nisa-deguchi"],
    status: "live",
    updated: "2026年6月29日",
    emoji: "🗓️",
  },
  {
    slug: "nisa-deguchi",
    title: "NISAの出口戦略｜いつ売る？老後の取り崩し方をわかりやすく",
    shortTitle: "NISAの出口戦略",
    description:
      "NISAは「いつ売るか（出口）」も大切です。非課税期間が無期限の新NISAでの取り崩しの考え方（定額・定率）、暴落時に慌てないための方針を解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-genpon-ware", "nisa-1800man", "rougo-2000man"],
    status: "live",
    updated: "2026年6月29日",
    emoji: "🚪",
  },
  {
    slug: "nisa-demerit",
    title: "NISAのデメリットは？始める前に知っておきたい注意点",
    shortTitle: "NISAのデメリット",
    description:
      "NISAは運用益が非課税の一方、元本割れの可能性・損益通算や繰越控除ができない・対象外商品があるなどの注意点も。デメリットを正しく理解しましょう。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-genpon-ware", "ideco-demerit", "nisa-nani-kau"],
    status: "live",
    updated: "2026年6月29日",
    emoji: "⚠️",
  },
  {
    slug: "nisa-genpon-ware",
    title: "NISAで元本割れしたらどうする？暴落時の正しい向き合い方",
    shortTitle: "NISAの元本割れ",
    description:
      "NISAは投資なので元本割れの可能性があります。値下がり・暴落時に慌てて売らないための考え方（長期・積立・分散、ドルコスト平均法）をわかりやすく解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-demerit", "nisa-deguchi", "fukuri"],
    status: "live",
    updated: "2026年6月29日",
    emoji: "📉",
  },
  {
    slug: "nisa-nani-kau",
    title: "NISAで何を買う？初心者向けの投資信託の選び方",
    shortTitle: "NISAで何を買う",
    description:
      "NISAで何を買うか迷う初心者向けに、投資信託の選び方の基本（低コストのインデックス投信・全世界株式や米国株式）を、特定商品の推奨ではなく一般論として解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-tsumitate-toushiwaku", "nisa-demerit", "fukuri"],
    status: "live",
    updated: "2026年6月29日",
    emoji: "🛒",
  },
  {
    slug: "nisa-1000man",
    title: "NISAで1000万円貯めるには？毎月いくら×何年のシミュレーション",
    shortTitle: "NISAで1000万円",
    description:
      "NISAで1,000万円を目指すには、年5%運用で月3万円なら約18年、月5万円なら約13年、月10万円なら約7年が目安。毎月の積立額別の到達年数を解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-tsukini-ikura", "nisa-1800man", "fukuri"],
    status: "live",
    updated: "2026年6月29日",
    emoji: "🎯",
  },
  {
    slug: "fukuri",
    title: "複利とは？72の法則と長期投資で資産が増える仕組み",
    shortTitle: "複利と72の法則",
    description:
      "複利は「利息が利息を生む」仕組みで、長期投資の効果の源です。72の法則（72÷利回り＝資産が2倍になる年数）と、積立投資での複利効果をわかりやすく解説します。",
    category: "toshi",
    targets: ["nisa", "ideco"],
    related: ["nisa-tsukini-ikura", "nisa-1000man", "nisa-genpon-ware"],
    status: "live",
    updated: "2026年6月29日",
    emoji: "🔁",
  },

  // ===== 失業保険（基本手当）クラスター（teate）=====
  {
    slug: "shitsugyo-ikura",
    title: "失業保険はいくらもらえる？月給別の早見表と給付日数【2026年】",
    shortTitle: "失業保険はいくら",
    description:
      "失業保険（基本手当）の受給額を月給別の早見表で確認。月給20万〜50万の基本手当日額・給付日数・受給総額の目安と、自己都合・会社都合での違いを解説します。",
    category: "teate",
    targets: ["shitsugyo-hoken"],
    related: ["shitsugyo-itsumade", "shitsugyo-jiko-kaisha", "shitsugyo-keisan"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "📊",
  },
  {
    slug: "shitsugyo-itsumade",
    title: "失業保険はいつから・いつまでもらえる？給付日数と給付制限",
    shortTitle: "失業保険はいつまで",
    description:
      "失業保険はいつから受け取れて、いつまで続くのかを解説。待期7日・自己都合の給付制限2か月、被保険者期間と離職理由で決まる給付日数（90〜330日）の目安をまとめます。",
    category: "teate",
    targets: ["shitsugyo-hoken"],
    related: ["shitsugyo-ikura", "shitsugyo-jiko-kaisha"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "📅",
  },
  {
    slug: "shitsugyo-jiko-kaisha",
    title: "失業保険 自己都合と会社都合の違い｜給付日数・給付制限を比較",
    shortTitle: "自己都合と会社都合の違い",
    description:
      "失業保険は離職理由で大きく変わります。自己都合（一般）と会社都合（特定受給資格者）の給付日数・給付制限・受給開始時期の違いを早見表で比較します。",
    category: "teate",
    targets: ["shitsugyo-hoken"],
    related: ["shitsugyo-ikura", "shitsugyo-itsumade"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "⚖️",
  },
  {
    slug: "shitsugyo-keisan",
    title: "失業保険の計算方法｜賃金日額・給付率・基本手当日額の出し方",
    shortTitle: "失業保険の計算方法",
    description:
      "失業保険の基本手当日額の計算方法を解説。賃金日額（離職前6か月の賃金÷180）と給付率（50〜80%）、年齢別の上限額（令和7年8月改定）の仕組みをわかりやすく。",
    category: "teate",
    targets: ["shitsugyo-hoken"],
    related: ["shitsugyo-ikura", "shitsugyo-jiko-kaisha"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "🧮",
  },

  // ===== 育児休業給付金クラスター（teate）=====
  {
    slug: "ikukyu-ikura",
    title: "育休手当はいくらもらえる？月給別の早見表【67%・50%】",
    shortTitle: "育休手当はいくら",
    description:
      "育児休業給付金の受給額を月給別の早見表で確認。月給20万〜50万の月額（最初6か月67%・以降50%）と1年の総額の目安、支給上限額（令和7年8月）を解説します。",
    category: "teate",
    targets: ["ikukyu-kyufu"],
    related: ["ikukyu-itsu", "ikukyu-tedori"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "📊",
  },
  {
    slug: "ikukyu-itsu",
    title: "育休手当はいつ振り込まれる？申請から入金までの流れ",
    shortTitle: "育休手当はいつ振り込まれる",
    description:
      "育児休業給付金がいつ振り込まれるかを解説。初回は育休開始から約2〜3か月後、その後は原則2か月ごと。申請の手順と入金が遅れる場合の注意点をまとめます。",
    category: "teate",
    targets: ["ikukyu-kyufu"],
    related: ["ikukyu-ikura", "ikukyu-tedori"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "📅",
  },
  {
    slug: "ikukyu-tedori",
    title: "育休手当は実質手取り8割？非課税・社会保険料免除の理由",
    shortTitle: "育休手当は実質手取り8割",
    description:
      "育児休業給付金は支給率67%でも実質手取りの約8割になる理由を解説。非課税で所得税・住民税がかからず、社会保険料も免除されるため、額面ほど手取りは下がりません。",
    category: "teate",
    targets: ["ikukyu-kyufu"],
    related: ["ikukyu-ikura", "ikukyu-itsu"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "💴",
  },

  // ===== 傷病手当金クラスター（teate）=====
  {
    slug: "shoubyo-ikura",
    title: "傷病手当金はいくらもらえる？月給別の早見表と計算方法",
    shortTitle: "傷病手当金はいくら",
    description:
      "傷病手当金の受給額を月給別の早見表で確認。月給20万〜50万の1日あたりの額（標準報酬日額の2/3）と、30日休んだ場合の受給総額の目安を解説します。",
    category: "teate",
    targets: ["shoubyo-teate"],
    related: ["shoubyo-kikan", "shoubyo-taishoku"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "📊",
  },
  {
    slug: "shoubyo-kikan",
    title: "傷病手当金はいつまで？待期3日と通算1年6か月の仕組み",
    shortTitle: "傷病手当金はいつまで",
    description:
      "傷病手当金は連続3日の待期のあと4日目から支給され、同一の傷病で通算1年6か月まで受け取れます。支給開始日・待期の数え方・支給期間の仕組みを解説します。",
    category: "teate",
    targets: ["shoubyo-teate"],
    related: ["shoubyo-ikura", "shoubyo-taishoku"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "📅",
  },
  {
    slug: "shoubyo-taishoku",
    title: "退職後も傷病手当金はもらえる？継続給付の条件を解説",
    shortTitle: "退職後の傷病手当金",
    description:
      "退職後も傷病手当金を受け取れる「継続給付」の条件を解説。被保険者期間が継続して1年以上・退職日に受給しているか受給できる状態などの要件をわかりやすく。",
    category: "teate",
    targets: ["shoubyo-teate"],
    related: ["shoubyo-ikura", "shoubyo-kikan"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "🚪",
  },

  // ===== 残業代クラスター（kyuyo）=====
  {
    slug: "zangyo-ikura",
    title: "残業代はいくら？月給×残業時間の早見表【割増率つき】",
    shortTitle: "残業代はいくら",
    description:
      "残業代を月給×残業時間の早見表で確認。月給25万〜40万の時給単価と、時間外10〜60時間の残業代の目安、深夜・休日の割増もあわせて解説します。",
    category: "kyuyo",
    targets: ["zangyodai"],
    related: ["zangyo-keisan", "zangyo-minashi"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "📊",
  },
  {
    slug: "zangyo-keisan",
    title: "残業代の計算方法と割増率｜時間外25%・深夜25%・休日35%",
    shortTitle: "残業代の計算方法",
    description:
      "残業代の計算方法を解説。1時間あたりの基礎賃金の出し方、時間外25%（月60時間超50%）・深夜25%加算・法定休日35%の割増率と、組み合わせた場合の計算をまとめます。",
    category: "kyuyo",
    targets: ["zangyodai"],
    related: ["zangyo-ikura", "zangyo-minashi"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "🧮",
  },
  {
    slug: "zangyo-minashi",
    title: "みなし残業（固定残業代）とは？超えた分は請求できる",
    shortTitle: "みなし残業とは",
    description:
      "みなし残業（固定残業代）の仕組みと注意点を解説。固定残業時間を超えた分の残業代は別途請求でき、深夜・休日割増も対象。求人票の見方や違法になるケースもまとめます。",
    category: "kyuyo",
    targets: ["zangyodai"],
    related: ["zangyo-ikura", "zangyo-keisan"],
    status: "live",
    updated: "2026年6月30日",
    emoji: "📄",
  },

  // ===== サーチコンソール需要対応：退職金クラスター深掘り（nenkin）=====
  {
    slug: "taishokukin-ideco",
    title:
      "退職金とiDeCoを一緒に受け取るときの税金｜退職所得控除の重複と10年ルール【2026年改正】",
    shortTitle: "退職金とiDeCoの受け取り",
    description:
      "退職金とiDeCo（確定拠出年金）の一時金を近い年に受け取ると、退職所得控除が重複して税金が増えることがあります。2026年施行の「10年ルール」と、税負担を抑える受け取り方を解説します。",
    category: "nenkin",
    targets: ["taishokukin", "ideco"],
    related: ["taishokukin-zeikin", "taishokukin-ichiji-nenkin", "ideco-uketori"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "🔀",
  },
  {
    slug: "taishokukin-ichiji-nenkin",
    title: "退職金は一時金と年金受取どっちが得？税金・手取りで比較",
    shortTitle: "退職金 一時金と年金どっち",
    description:
      "退職金の受け取り方は「一時金」と「年金」で税金が大きく変わります。退職所得控除が使える一時金と、公的年金等控除の年金受取を、税金・社会保険料・手取りの観点で比較します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: ["taishokukin-zeikin", "taishokukin-ideco", "taishokukin-kingaku-betsu"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "⚖️",
  },

  // ===== サーチコンソール需要対応：フリーランス・個人事業主（kyuyo/zei）=====
  {
    slug: "freelance-tedori",
    title: "フリーランス・個人事業主の手取りはいくら？会社員との違いと計算方法",
    shortTitle: "フリーランスの手取り",
    description:
      "フリーランス・個人事業主の手取りは、会社員と計算方法が違います。国民健康保険・国民年金・青色申告特別控除・個人事業税をふまえ、売上からの手取りの目安と会社員との違いを解説します。",
    category: "kyuyo",
    targets: ["tedori"],
    related: ["setsuzei-freelance", "kojin-jigyouzei", "nisa-kojin-jigyounushi"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "🧑‍💻",
  },
  {
    slug: "kojin-jigyouzei",
    title: "個人事業税とは？税率・計算方法・かからない条件【個人事業主】",
    shortTitle: "個人事業税とは",
    description:
      "個人事業税は、事業所得から事業主控除290万円を引いた額に3〜5%かかる都道府県税です。税率・計算方法・かからない条件（所得290万円以下など）を、計算例つきで解説します。",
    category: "zei",
    targets: ["tedori"],
    related: ["freelance-tedori", "setsuzei-freelance"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "🏢",
  },

  // ===== サーチコンソール需要対応：住宅ローン需要クエリ（loan）=====
  {
    slug: "jutaku-loan-setai-1000man",
    title: "世帯年収1000万円の住宅ローンはいくら借りられる？共働き・ペアローン",
    shortTitle: "世帯年収1000万の住宅ローン",
    description:
      "世帯年収1000万円（共働き）の住宅ローン借入可能額は、無理のない目安で約6,800万円、審査上限で約7,580万円。収入合算・ペアローンの違いと、共働きならではの注意点を解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-pair", "jutaku-loan-1000man", "jutaku-loan-nenshu-betsu"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "👫",
  },
  {
    slug: "karikae-simulation",
    title: "住宅ローンの借り換えはいくら得？諸費用込みの損益分岐シミュレーション",
    shortTitle: "借り換えはいくら得",
    description:
      "住宅ローンの借り換えは「金利差0.5%以上・残債1000万円以上・残期間10年以上」が得の目安。諸費用を引いた正味メリットを、残債・金利別のシミュレーション例で解説します。",
    category: "loan",
    targets: ["karikae"],
    related: ["kuriage-karikae-dochira", "jutaku-loan-nenshu-betsu"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "🔁",
  },

  // ===== 需要対応クラスター 第2弾（住宅ローン/フリーランス/NISA/退職金）=====
  {
    slug: "jutaku-loan-nenshu-baisuu",
    title: "住宅ローンは年収の何倍まで借りられる？無理のない年収倍率",
    shortTitle: "住宅ローンは年収の何倍",
    description:
      "住宅ローンの借入額は年収の約7倍が目安ですが、無理なく返すなら年収の約5〜6倍が安心です。年収倍率の考え方と、返済負担率から見た無理のない借入額を年収別に解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-nenshu-betsu", "jutaku-loan-atamakin-nashi", "jutaku-loan-500man"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "📐",
  },
  {
    slug: "jutaku-loan-atamakin-nashi",
    title: "頭金なし（フルローン）で住宅ローンは組める？メリットと注意点",
    shortTitle: "頭金なしで住宅ローン",
    description:
      "頭金なしのフルローンでも住宅ローンは組めます。頭金なしのメリット・デメリット、諸費用の扱い、返済負担が重くなりやすい点や審査への影響をわかりやすく解説します。",
    category: "loan",
    targets: ["jutaku-loan"],
    related: ["jutaku-loan-atamakin", "jutaku-loan-nenshu-baisuu", "jutaku-loan-nenshu-betsu"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "🏠",
  },
  {
    slug: "shokibo-kyosai",
    title: "小規模企業共済とは？フリーランス・個人事業主の節税と退職金づくり",
    shortTitle: "小規模企業共済とは",
    description:
      "小規模企業共済は、掛金が全額所得控除になり、将来は退職金として受け取れる制度です。掛金（月1,000〜7万円）・節税額の目安・iDeCoとの違いを、フリーランス視点で解説します。",
    category: "zei",
    targets: ["ideco", "tedori"],
    related: ["setsuzei-freelance", "freelance-tedori", "nisa-kojin-jigyounushi"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "🏦",
  },
  {
    slug: "invoice-kojin",
    title: "インボイス制度は個人事業主にどう影響する？2割特例もわかりやすく",
    shortTitle: "インボイスと個人事業主",
    description:
      "インボイス制度で、免税事業者だった個人事業主も課税事業者になるか判断が必要に。登録の要否、消費税の負担、当面の「2割特例」による軽減をわかりやすく解説します。",
    category: "zei",
    targets: ["shohizei"],
    related: ["kojin-jigyouzei", "freelance-tedori", "setsuzei-freelance"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "🧾",
  },
  {
    slug: "nisa-hikidashi",
    title: "NISAは途中で引き出せる？売却のルールと非課税枠の復活",
    shortTitle: "NISAは途中で引き出せる",
    description:
      "NISAはいつでも売却・引き出しが可能です。売却した分の非課税枠は翌年に復活し、再利用できます。引き出しの注意点と、長期運用を続けるための考え方を解説します。",
    category: "toshi",
    targets: ["nisa"],
    related: ["nisa-deguchi", "nisa-demerit", "nisa-tsukini-ikura"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "💸",
  },
  {
    slug: "taishokukin-itsu",
    title: "退職金はいつもらえる？支給時期と受け取りまでの流れ",
    shortTitle: "退職金はいつもらえる",
    description:
      "退職金は、退職後おおむね1〜2か月後に支給されるのが一般的です。支給時期は就業規則で決まります。受け取りまでの流れ・必要な手続き（退職所得の受給に関する申告書）を解説します。",
    category: "nenkin",
    targets: ["taishokukin"],
    related: ["taishokukin-kingaku-betsu", "taishokukin-zeikin", "taishokukin-kakutei-shinkoku"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "📅",
  },

  // ===== 新計算機クラスター：出産手当金（teate）=====
  {
    slug: "shussan-teate-ikura",
    title: "出産手当金はいくらもらえる？月給別の早見表と計算方法",
    shortTitle: "出産手当金はいくら",
    description:
      "出産手当金は標準報酬日額の2/3×98日。月給20万〜40万の1日あたり・受給総額の目安を早見表で確認できます。育児休業給付金との違いや支給期間も解説します。",
    category: "teate",
    targets: ["shussan-teate"],
    related: ["shussan-teate-itsu", "ikukyu-ikura", "shoubyo-ikura"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "📊",
  },
  {
    slug: "shussan-teate-itsu",
    title: "出産手当金はいつもらえる？産休手当の申請から入金までの流れ",
    shortTitle: "出産手当金はいつもらえる",
    description:
      "出産手当金は産後休業のあと、申請から1〜2か月後に振り込まれるのが一般的です。支給期間（産前42日＋産後56日）・申請の流れ・育休給付金との時期の違いを解説します。",
    category: "teate",
    targets: ["shussan-teate"],
    related: ["shussan-teate-ikura", "ikukyu-itsu"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "📅",
  },

  // ===== 新計算機クラスター：児童手当（life）=====
  {
    slug: "jido-teate-ikura",
    title: "児童手当はいくら？年齢・人数別の早見表【2024年10月拡充】",
    shortTitle: "児童手当はいくら",
    description:
      "児童手当は0〜3歳未満15,000円、3歳〜高校生10,000円、第3子以降は月3万円。人数・年齢別の月額と、生まれてから高校卒業までの総額の目安を早見表で解説します。",
    category: "life",
    targets: ["jido-teate"],
    related: ["jido-teate-daisanshi", "kyoikuhi-ikura", "shussan-teate-ikura"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "📊",
  },
  {
    slug: "jido-teate-daisanshi",
    title: "児童手当 第3子の数え方は？月3万円になる条件【2024年拡充】",
    shortTitle: "児童手当 第3子の数え方",
    description:
      "児童手当の第3子以降は月3万円。数え方は22歳年度末までの子を年齢順に数え、大学生年代も算定に含めます。第3子の判定・所得制限撤廃をわかりやすく解説します。",
    category: "life",
    targets: ["jido-teate"],
    related: ["jido-teate-ikura", "kyoikuhi-ikura"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "👨‍👩‍👧‍👦",
  },

  // ===== 新計算機クラスター：住宅ローン控除（loan）=====
  {
    slug: "jutaku-loan-kojo-ikura",
    title: "住宅ローン控除はいくら戻る？残高別の早見表【2025年】",
    shortTitle: "住宅ローン控除はいくら",
    description:
      "住宅ローン控除は年末残高の0.7%。残高3,000万円なら年21万円が目安です。残高別の年間控除額、住宅性能別の借入限度額（子育て世帯は最大5,000万円）を早見表で解説します。",
    category: "loan",
    targets: ["jutaku-loan-kojo"],
    related: ["jutaku-loan-kojo-joken", "jutaku-loan-nenshu-betsu", "jutaku-hendou-kotei"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "📊",
  },
  {
    slug: "jutaku-loan-kojo-joken",
    title: "住宅ローン控除の条件は？年末調整と確定申告の手続き",
    shortTitle: "住宅ローン控除の条件・手続き",
    description:
      "住宅ローン控除の主な条件（床面積50㎡以上・合計所得2,000万円以下・省エネ基準など）と、1年目の確定申告・2年目以降の年末調整の手続きをわかりやすく解説します。",
    category: "loan",
    targets: ["jutaku-loan-kojo"],
    related: ["jutaku-loan-kojo-ikura", "jutaku-loan-atamakin"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "📝",
  },

  // ===== 新計算機クラスター：所得税（zei）=====
  {
    slug: "shotokuzei-keisan",
    title: "所得税の計算方法と速算表｜課税所得からいくら？",
    shortTitle: "所得税の計算方法",
    description:
      "所得税は「課税所得×税率−控除額」で計算します。5〜45%の速算表、課税所得と所得の違い、復興特別所得税（2.1%）、課税所得別の税額の目安をわかりやすく解説します。",
    category: "zei",
    targets: ["shotokuzei", "tedori"],
    related: ["juuminzei-ikura", "nenshu-500man-tedori"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "🧮",
  },

  // ===== 新計算機クラスター：医療費控除（zei）=====
  {
    slug: "iryouhi-koujo-ikura",
    title: "医療費控除でいくら戻る？金額別の早見表と計算方法",
    shortTitle: "医療費控除はいくら戻る",
    description:
      "医療費控除は「医療費−10万円」×税率が戻る目安。医療費20万〜100万の軽減額を所得別の早見表で確認できます。家族分の合算や計算方法もわかりやすく解説します。",
    category: "zei",
    targets: ["iryouhi-koujo"],
    related: ["iryouhi-koujo-taishou", "shotokuzei-keisan"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "📊",
  },
  {
    slug: "iryouhi-koujo-taishou",
    title: "医療費控除の対象になるもの・ならないもの一覧",
    shortTitle: "医療費控除の対象",
    description:
      "医療費控除の対象になるもの（治療・入院・通院交通費・歯科など）とならないもの（予防・美容・自家用車のガソリン代など）を一覧で整理。セルフメディケーション税制との違いも解説します。",
    category: "zei",
    targets: ["iryouhi-koujo"],
    related: ["iryouhi-koujo-ikura"],
    status: "live",
    updated: "2026年7月1日",
    emoji: "📋",
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

// ---- 並び替え（一覧・関連リンクのUX用） ----
// 登録順だと年収などが不規則に並んでしまうため、表示時に整列する。
const GUIDE_INDEX = new Map(GUIDES.map((g, i) => [g.slug, i]));

/** 同じシリーズ（テーマ）でまとめるためのキー。
 *  ふるさと納税・住宅ローン（借入可能額／返済額）はそれぞれ1グループにまとめ、
 *  それ以外はスラッグ先頭の英字トピックでまとめる。 */
function guideSeriesKey(g: Guide): string {
  if (g.slug.startsWith("furusato-nozei")) return "furusato-nozei";
  if (g.slug.startsWith("jutaku-loan")) return "jutaku-loan"; // 借入可能額（年収別）
  if (g.slug.includes("-hensai")) return "jutaku-hensai"; // 返済額（借入額別・早見表 jutaku-hensai-betsu 含む）
  const m = g.slug.match(/^[a-z]+/);
  return m ? m[0] : g.slug;
}

/** スラッグ内の「◯◯man」から年収・金額を取り出す（無ければ -1）。 */
function guideIncome(g: Guide): number {
  const m = g.slug.match(/(\d+)man/);
  return m ? Number(m[1]) : -1;
}

// シリーズが最初に登場した登録位置（シリーズ同士の並び順の基準）。
const SERIES_FIRST_INDEX = new Map<string, number>();
GUIDES.forEach((g, i) => {
  const k = guideSeriesKey(g);
  if (!SERIES_FIRST_INDEX.has(k)) SERIES_FIRST_INDEX.set(k, i);
});

/** 一覧・関連リンク表示用の並び替え。
 *  ①シリーズ（最初に登場した順）→ ②年収・金額の昇順（金額なしを先）→ ③登録順。 */
export function compareGuides(a: Guide, b: Guide): number {
  const sa = SERIES_FIRST_INDEX.get(guideSeriesKey(a)) ?? 0;
  const sb = SERIES_FIRST_INDEX.get(guideSeriesKey(b)) ?? 0;
  if (sa !== sb) return sa - sb;
  const ia = guideIncome(a);
  const ib = guideIncome(b);
  if (ia !== ib) return ia - ib;
  return (GUIDE_INDEX.get(a.slug) ?? 0) - (GUIDE_INDEX.get(b.slug) ?? 0);
}

/** カテゴリ内の公開済みガイド（表示順に整列済み） */
export function guidesInCategory(categorySlug: string): Guide[] {
  return liveGuides()
    .filter((g) => g.category === categorySlug)
    .sort(compareGuides);
}

// シリーズキー → 人が読めるシリーズ名（一覧のサブ見出し用）。
// 未登録のキーは記事数が少ない（「その他」へまとめる）ので先頭記事名で代用する。
const SERIES_LABELS: Record<string, string> = {
  nenshu: "年収別の手取り",
  kabe: "年収の壁・扶養",
  "furusato-nozei": "ふるさと納税",
  setsuzei: "節税対策",
  sozokuzei: "相続税",
  zouyozei: "贈与税",
  jidoshazei: "自動車税",
  kotei: "固定資産税",
  "jutaku-loan": "住宅ローン 借入可能額",
  "jutaku-hensai": "住宅ローン 返済額",
  nisa: "NISA・投資",
  ideco: "iDeCo",
  taishokukin: "退職金",
  nenkin: "年金",
  kyoiku: "教育費",
  shitsugyo: "失業保険",
  ikukyu: "育児休業給付金",
  shoubyo: "傷病手当金",
  zangyo: "残業代",
  shussan: "出産手当金",
  jido: "児童手当",
};

export interface SeriesGroup {
  key: string;
  label: string;
  /** シリーズの代表記事（早見表/master 等・先頭にピン留め表示する） */
  lead: Guide;
  /** lead を含むシリーズ全記事（表示順） */
  items: Guide[];
}

/** 任意のガイド配列（整列済み前提）をシリーズ単位にまとめる。
 *  一定数（threshold）以上のシリーズは独立した group に、
 *  少数シリーズ・単発記事は others にまとめて「壁」になるのを防ぐ。 */
export function groupBySeries(
  guides: Guide[],
  threshold = 3,
): { groups: SeriesGroup[]; others: Guide[] } {
  const map = new Map<string, Guide[]>();
  for (const g of guides) {
    const k = guideSeriesKey(g);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(g);
  }
  const groups: SeriesGroup[] = [];
  const others: Guide[] = [];
  for (const [key, items] of map) {
    if (items.length >= threshold) {
      groups.push({
        key,
        label: SERIES_LABELS[key] ?? items[0].shortTitle,
        lead: items[0],
        items,
      });
    } else {
      others.push(...items);
    }
  }
  return { groups, others };
}

/** カテゴリ内のガイドをシリーズ単位にまとめる（/guide 一覧用）。 */
export function guideSeriesGroups(
  categorySlug: string,
  threshold = 3,
): { groups: SeriesGroup[]; others: Guide[] } {
  return groupBySeries(guidesInCategory(categorySlug), threshold);
}

/** ある計算機に紐づくガイドをシリーズ単位にまとめる（計算機ページのピラー用）。 */
export function guidesForCalculatorGrouped(
  calcSlug: string,
  threshold = 3,
): { groups: SeriesGroup[]; others: Guide[] } {
  return groupBySeries(guidesForCalculator(calcSlug), threshold);
}

/** ある計算機に紐づく公開済みガイド（計算機ページの「関連ガイド」用・整列済み） */
export function guidesForCalculator(calcSlug: string): Guide[] {
  return liveGuides()
    .filter((g) => g.targets.includes(calcSlug))
    .sort(compareGuides);
}

/** 関連ガイドを解決（存在する公開済みのみ） */
export function relatedGuides(slug: string): Guide[] {
  const g = getGuide(slug);
  if (!g) return [];
  return g.related
    .map((s) => getGuide(s))
    .filter((x): x is Guide => x !== undefined && x.status === "live");
}

export interface SeriesInfo {
  key: string;
  label: string;
  /** シリーズの代表記事（早見表 📊 があれば優先・無ければ先頭）＝サブピラー */
  master: Guide;
  /** シリーズ全記事（表示順） */
  items: Guide[];
  /** この記事が master 自身か */
  isMaster: boolean;
}

/** 記事が属するシリーズの情報（master記事のサブピラー化用）。
 *  3記事未満のシリーズはハブ不要なので null を返す。 */
export function guideSeriesInfo(slug: string): SeriesInfo | null {
  const g = getGuide(slug);
  if (!g) return null;
  const key = guideSeriesKey(g);
  const items = liveGuides()
    .filter((x) => guideSeriesKey(x) === key)
    .sort(compareGuides);
  if (items.length < 3) return null;
  const master = items.find((x) => x.emoji === "📊") ?? items[0];
  return {
    key,
    label: SERIES_LABELS[key] ?? master.shortTitle,
    master,
    items,
    isMaster: slug === master.slug,
  };
}

/** 同じシリーズ内の前後の記事（前後ナビ用）。
 *  シリーズ＝guideSeriesKeyが同じ公開記事を compareGuides 順に並べた列。 */
export function seriesNeighbors(slug: string): {
  prev?: Guide;
  next?: Guide;
} {
  const g = getGuide(slug);
  if (!g) return {};
  const key = guideSeriesKey(g);
  const list = liveGuides()
    .filter((x) => guideSeriesKey(x) === key)
    .sort(compareGuides);
  const i = list.findIndex((x) => x.slug === slug);
  if (i < 0) return {};
  return { prev: list[i - 1], next: list[i + 1] };
}
