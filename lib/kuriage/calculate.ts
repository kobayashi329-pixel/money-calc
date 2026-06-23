// =============================================================
//  住宅ローン 繰り上げ返済 比較シミュレータ — 計算ロジック（純粋関数）
//  元利均等返済を前提に、月次の償却表を作りながら「ある月にまとまった
//  繰上返済をした場合」を再現する。繰上返済には2方式ある：
//    ・期間短縮型: 毎月の返済額は変えず、残高を一気に減らして完済を早める
//    ・返済額軽減型: 完済時期は変えず、繰上後の残期間で毎月返済額を下げる
//  どちらも「繰上返済をしない場合」と比べて利息がいくら減るかを示す。
//  出典: 一般的な元利均等返済の償却計算（金融機関の実務に準拠した月次・円未満四捨五入）
// =============================================================
import { equalPaymentMonthly } from "../loan/calculate";

/** 繰上返済の方式 */
export type PrepaymentType = "shorten" | "reduce";
// shorten = 期間短縮型 / reduce = 返済額軽減型

export interface KuriageInput {
  /** 借入額（円） */
  principal: number;
  /** 年利（%） */
  annualRatePercent: number;
  /** 当初の返済期間（年） */
  years: number;
  /** 繰上返済額（円）。0なら繰上なし。 */
  prepayAmount: number;
  /** 繰上返済を実行する時期（何年後の時点か） */
  prepayAfterYears: number;
}

/** 1パターンのシミュレーション結果 */
export interface LoanScenario {
  /** 毎月の返済額（返済額軽減型は繰上後の額。期間短縮型・基準は当初額） */
  monthlyPayment: number;
  /** 完済までの月数 */
  payoffMonths: number;
  /** 総返済額（元金＋利息。繰上返済額も含む実際の支払総額） */
  totalPayment: number;
  /** 利息総額 */
  totalInterest: number;
  /** 年ごとの残高推移（グラフ用） */
  yearlyBalance: { year: number; balance: number }[];
}

export interface KuriageResult {
  /** 繰上返済をしない場合 */
  baseline: LoanScenario;
  /** 期間短縮型で繰上した場合 */
  shorten: LoanScenario;
  /** 返済額軽減型で繰上した場合 */
  reduce: LoanScenario;
  /** 繰上返済額（クランプ後） */
  prepayAmount: number;
  /** 繰上実行月（1始まり） */
  prepayMonth: number;
  /** 期間短縮型の利息軽減額（baseline − shorten） */
  shortenInterestSaved: number;
  /** 期間短縮型で短縮できる月数 */
  shortenMonthsReduced: number;
  /** 返済額軽減型の利息軽減額（baseline − reduce） */
  reduceInterestSaved: number;
  /** 返済額軽減型で下がる毎月の返済額（当初 − 軽減後） */
  reduceMonthlyReduced: number;
}

/**
 * 元利均等返済を月次でシミュレートする。
 * prepayMonth に prepayAmount を繰上返済（type で挙動が変わる）。
 */
function simulate(
  principal: number,
  monthlyRate: number,
  totalMonths: number,
  prepayAmount: number,
  prepayMonth: number, // 0なら繰上なし
  type: PrepaymentType,
): LoanScenario {
  let payment = Math.round(equalPaymentMonthly(principal, monthlyRate, totalMonths));
  let balance = principal;
  let totalPaid = 0;
  let totalInterest = 0;
  const yearly: { year: number; balance: number }[] = [];

  // 完済までループ（安全のため totalMonths*2 で打ち切り）
  const hardLimit = totalMonths * 2 + 12;
  let m = 0;
  while (balance > 0 && m < hardLimit) {
    m++;
    const interest = monthlyRate === 0 ? 0 : Math.round(balance * monthlyRate);
    let principalPart = payment - interest;
    if (principalPart > balance) principalPart = balance;
    balance -= principalPart;
    totalPaid += principalPart + interest;
    totalInterest += interest;

    // この月の通常返済後に繰上返済を実行
    if (prepayMonth > 0 && m === prepayMonth && balance > 0) {
      const prepay = Math.min(prepayAmount, balance);
      balance -= prepay;
      totalPaid += prepay;
      if (type === "reduce" && balance > 0) {
        // 残りの月数で毎月返済額を再計算（完済時期は変えない）。
        // 当初の完済月を超えないよう、円未満は切り上げる（最終回で残額調整）。
        const remaining = totalMonths - m;
        if (remaining > 0) {
          payment = Math.ceil(equalPaymentMonthly(balance, monthlyRate, remaining));
        }
      }
      // shorten 型は payment 据え置き → 完済が早まる
    }

    if (m % 12 === 0 || balance <= 0) {
      yearly.push({ year: Math.ceil(m / 12), balance: Math.max(0, balance) });
    }
  }

  return {
    monthlyPayment: payment,
    payoffMonths: m,
    totalPayment: totalPaid,
    totalInterest,
    yearlyBalance: yearly,
  };
}

export function calculateKuriage(input: KuriageInput): KuriageResult {
  const principal = Math.max(0, Math.round(input.principal));
  const totalMonths = Math.max(0, Math.round(input.years * 12));
  const monthlyRate = input.annualRatePercent / 100 / 12;
  const prepayMonth = Math.max(0, Math.round(input.prepayAfterYears * 12));
  const prepayAmount = Math.max(0, Math.round(input.prepayAmount));

  const baseline = simulate(principal, monthlyRate, totalMonths, 0, 0, "shorten");
  // 繰上額が0、または実行時期が完済後なら繰上なしと同じ
  const effectivePrepayMonth =
    prepayAmount > 0 && prepayMonth > 0 && prepayMonth < totalMonths ? prepayMonth : 0;

  const shorten = simulate(
    principal,
    monthlyRate,
    totalMonths,
    prepayAmount,
    effectivePrepayMonth,
    "shorten",
  );
  const reduce = simulate(
    principal,
    monthlyRate,
    totalMonths,
    prepayAmount,
    effectivePrepayMonth,
    "reduce",
  );

  return {
    baseline,
    shorten,
    reduce,
    prepayAmount,
    prepayMonth: effectivePrepayMonth,
    shortenInterestSaved: baseline.totalInterest - shorten.totalInterest,
    shortenMonthsReduced: baseline.payoffMonths - shorten.payoffMonths,
    reduceInterestSaved: baseline.totalInterest - reduce.totalInterest,
    reduceMonthlyReduced: baseline.monthlyPayment - reduce.monthlyPayment,
  };
}
