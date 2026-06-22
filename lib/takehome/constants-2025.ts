// =============================================================
//  年収手取り計算機 — 定数（令和7年分＝2025年適用）
// =============================================================
//  税制改正に追従できるよう、料率・控除額は年度ごとにこのファイルへ分離する。
//  すべて一次情報（国税庁・総務省・協会けんぽ・日本年金機構・厚生労働省）を出典とする。
//  ※ 金額はすべて「円」単位。料率は小数（例: 0.0991 = 9.91%）。
// =============================================================

/** この定数セットが適用される税年度（西暦） */
export const TAX_YEAR = 2025; // 令和7年分（所得税）／令和7年度（住民税・社会保険）

// -------------------------------------------------------------
// 1. 給与所得控除（令和7年分）
//    出典: 国税庁 No.1410 https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
//    令和7年度改正で最低保障額が55万円→65万円に引き上げ（令和7年分以後）。
//    https://www.nta.go.jp/users/gensen/2025kiso/index.htm
// -------------------------------------------------------------
export interface SalaryDeductionBracket {
  /** 給与等の収入金額の上限（この値以下に適用）。最終段は Infinity。 */
  maxIncome: number;
  /** 控除額の計算: income * rate + add （定額の場合 rate=0） */
  rate: number;
  add: number;
}

export const SALARY_DEDUCTION_BRACKETS: SalaryDeductionBracket[] = [
  { maxIncome: 1_900_000, rate: 0, add: 650_000 }, // 最低保障（改正後65万円）
  { maxIncome: 3_600_000, rate: 0.3, add: 80_000 },
  { maxIncome: 6_600_000, rate: 0.2, add: 440_000 },
  { maxIncome: 8_500_000, rate: 0.1, add: 1_100_000 },
  { maxIncome: Infinity, rate: 0, add: 1_950_000 }, // 上限（850万円超は定額）
];

// -------------------------------------------------------------
// 2. 基礎控除（所得税・令和7年分／令和7・8年限定の上乗せを含む）
//    出典: 国税庁 No.1199 https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm
//    改正特設: https://www.nta.go.jp/users/gensen/2025kiso/index.htm
//    判定基準は「合計所得金額」（給与のみなら給与所得控除後の金額）。
//    ※ 132万円超〜655万円以下の上乗せ（88万/68万/63万）は令和7・8年分の2年限定特例。
// -------------------------------------------------------------
export interface DeductionBracket {
  /** 合計所得金額の上限（この値以下に適用）。最終段は Infinity。 */
  maxTotalIncome: number;
  amount: number;
}

export const BASIC_DEDUCTION_INCOME_TAX: DeductionBracket[] = [
  { maxTotalIncome: 1_320_000, amount: 950_000 }, // 58万＋37万
  { maxTotalIncome: 3_360_000, amount: 880_000 }, // 58万＋30万
  { maxTotalIncome: 4_890_000, amount: 680_000 }, // 58万＋10万
  { maxTotalIncome: 6_550_000, amount: 630_000 }, // 58万＋ 5万
  { maxTotalIncome: 23_500_000, amount: 580_000 }, // 恒久新基本額
  { maxTotalIncome: 24_000_000, amount: 480_000 },
  { maxTotalIncome: 24_500_000, amount: 320_000 },
  { maxTotalIncome: 25_000_000, amount: 160_000 },
  { maxTotalIncome: Infinity, amount: 0 },
];

// -------------------------------------------------------------
// 3. 住民税の基礎控除（令和7年度・据え置き43万円）
//    出典: 総務省 個人住民税
//    https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/150790_06.html
//    ※ 所得税の基礎控除改正（58万円系）は住民税には及ばない。43万円のまま。
// -------------------------------------------------------------
export const BASIC_DEDUCTION_RESIDENT_TAX: DeductionBracket[] = [
  { maxTotalIncome: 24_000_000, amount: 430_000 },
  { maxTotalIncome: 24_500_000, amount: 290_000 },
  { maxTotalIncome: 25_000_000, amount: 150_000 },
  { maxTotalIncome: Infinity, amount: 0 },
];

// -------------------------------------------------------------
// 4. 扶養控除（一般の控除対象扶養親族・16歳以上を想定した簡易版）
//    出典: 国税庁 No.1180 扶養控除
//    https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm
//    ※ 本計算機は「扶養人数」を一般扶養控除としてまとめて扱う簡易版。
//      特定扶養（19〜22歳=63万）・老人扶養・16歳未満（控除なし）・配偶者控除は別途。
// -------------------------------------------------------------
export const DEPENDENT_DEDUCTION_INCOME_TAX = 380_000; // 一般扶養（所得税）
export const DEPENDENT_DEDUCTION_RESIDENT_TAX = 330_000; // 一般扶養（住民税）
/** 人的控除額の差（所得税38万 − 住民税33万）。調整控除の計算に使用。 */
export const DEPENDENT_PERSONAL_DEDUCTION_DIFF = 50_000;

// -------------------------------------------------------------
// 5. 所得税の速算表（課税所得金額・税率・控除額）
//    出典: 国税庁 No.2260 https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
//    所得税額 = 課税所得金額 × 税率 − 控除額（課税所得は1,000円未満切捨て）
// -------------------------------------------------------------
export interface IncomeTaxBracket {
  /** 課税所得金額の上限（この値以下に適用）。最終段は Infinity。 */
  maxTaxable: number;
  rate: number;
  deduction: number;
}

export const INCOME_TAX_BRACKETS: IncomeTaxBracket[] = [
  { maxTaxable: 1_949_000, rate: 0.05, deduction: 0 },
  { maxTaxable: 3_299_000, rate: 0.1, deduction: 97_500 },
  { maxTaxable: 6_949_000, rate: 0.2, deduction: 427_500 },
  { maxTaxable: 8_999_000, rate: 0.23, deduction: 636_000 },
  { maxTaxable: 17_999_000, rate: 0.33, deduction: 1_536_000 },
  { maxTaxable: 39_999_000, rate: 0.4, deduction: 2_796_000 },
  { maxTaxable: Infinity, rate: 0.45, deduction: 4_796_000 },
];

/** 復興特別所得税の税率（基準所得税額 × 2.1%）。平成25〜令和19年分。 */
export const RECONSTRUCTION_TAX_RATE = 0.021;

// -------------------------------------------------------------
// 6. 住民税（令和7年度・標準税率）
//    出典: 総務省 個人住民税 / 東京都主税局 https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju
// -------------------------------------------------------------
/** 所得割の標準税率（市町村民税6% + 道府県民税4% = 10%） */
export const RESIDENT_TAX_INCOME_RATE = 0.1;
/** 均等割（市町村民税3,000 + 道府県民税1,000 + 森林環境税1,000 = 5,000円） */
export const RESIDENT_TAX_PER_CAPITA = 5_000;
/** 調整控除の控除率（市3% + 県2% = 5%） */
export const ADJUSTMENT_CREDIT_RATE = 0.05;
/** 基礎控除分の人的控除額の差（所得税48万円相当 − 住民税43万円 = 5万円） */
export const BASIC_PERSONAL_DEDUCTION_DIFF = 50_000;

// -------------------------------------------------------------
// 7. 社会保険料率（令和7年度・会社員＝協会けんぽ）
//    出典:
//      健康保険（協会けんぽ・東京都）: https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r07/index.html
//      厚生年金: https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html
//      雇用保険（令和7年度）: https://www.mhlw.go.jp/content/001401966.pdf
//    料率は労使折半。ここでは「被保険者（本人）負担分」を保持する。
// -------------------------------------------------------------
/** 健康保険料率（東京都・介護なし、全体9.91%）の本人負担分 = 折半 */
export const HEALTH_INSURANCE_RATE_EMPLOYEE = 0.0991 / 2; // 4.955%
/** 介護保険料率（全国一律1.59%・40〜64歳）の本人負担分 = 折半 */
export const LONG_TERM_CARE_RATE_EMPLOYEE = 0.0159 / 2; // 0.795%
/** 厚生年金保険料率（18.3%固定）の本人負担分 = 折半 */
export const PENSION_RATE_EMPLOYEE = 0.183 / 2; // 9.15%
/** 雇用保険料率（一般の事業）の本人負担分（5.5/1000） */
export const EMPLOYMENT_INSURANCE_RATE_EMPLOYEE = 0.0055; // 0.55%

/** 介護保険の対象年齢（第2号被保険者: 40歳以上65歳未満） */
export const LONG_TERM_CARE_AGE_MIN = 40;
export const LONG_TERM_CARE_AGE_MAX = 64;

/**
 * 標準報酬月額の上限（令和7年度）。社会保険料の頭打ちを反映するための近似上限。
 * 出典: 協会けんぽ標準報酬月額表（健康保険 第50級 = 1,390,000円）/
 *       日本年金機構（厚生年金 第32級 = 650,000円）
 * ※ 本計算機は標準報酬月額の等級区分による端数処理は簡略化し、
 *   月額（年収÷12）に上限を適用したうえで料率を乗じる近似計算とする。
 */
export const HEALTH_MONTHLY_STANDARD_MAX = 1_390_000;
export const PENSION_MONTHLY_STANDARD_MAX = 650_000;
