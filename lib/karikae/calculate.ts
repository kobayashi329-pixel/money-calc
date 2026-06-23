// =============================================================
//  住宅ローン 借り換え 比較シミュレータ — 計算ロジック（純粋関数）
//  「現在のローンをこのまま返済し続けた場合」と「同じ残高・残期間で
//  低い金利に借り換えた場合」を、元利均等返済で月次に償却して比較する。
//  借り換えには諸費用（事務手数料・保証料・登記費用など）がかかるため、
//  総返済額の差から諸費用を引いた「正味のメリット」を示す。
//  出典: 一般的な元利均等返済の償却計算（月次・円未満四捨五入）
// =============================================================
import { equalPaymentMonthly } from "../loan/calculate";

export interface KarikaeInput {
  /** 現在のローン残高（借り換える元本・円） */
  balance: number;
  /** 残りの返済期間（年） */
  remainingYears: number;
  /** 現在の金利（年率・%） */
  currentRatePercent: number;
  /** 借り換え後の金利（年率・%） */
  newRatePercent: number;
  /** 借り換えにかかる諸費用（円） */
  fee: number;
}

export interface LoanSummary {
  /** 毎月の返済額 */
  monthlyPayment: number;
  /** 総返済額（元金＋利息） */
  totalPayment: number;
  /** 利息総額 */
  totalInterest: number;
}

export interface KarikaeResult {
  /** 現在のローンを返し続けた場合 */
  current: LoanSummary;
  /** 借り換えた場合 */
  refinanced: LoanSummary;
  /** 借り換え諸費用 */
  fee: number;
  /** 毎月の返済額の軽減（現在 − 借換後。マイナスなら増加） */
  monthlyReduction: number;
  /** 総返済額の差（現在 − 借換後。諸費用控除前） */
  totalSaved: number;
  /** 正味のメリット（総返済額の差 − 諸費用） */
  netBenefit: number;
  /** 借り換えにメリットがあるか（正味メリット > 0） */
  worthIt: boolean;
}

/** 元利均等返済を月次で償却し、総返済額・利息を求める */
function amortize(balance: number, annualRatePercent: number, months: number): LoanSummary {
  const principal = Math.max(0, Math.round(balance));
  const monthlyRate = annualRatePercent / 100 / 12;
  if (principal === 0 || months === 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
  }
  const payment = Math.round(equalPaymentMonthly(principal, monthlyRate, months));

  let bal = principal;
  let totalPayment = 0;
  let totalInterest = 0;
  for (let m = 1; m <= months; m++) {
    const interest = monthlyRate === 0 ? 0 : Math.round(bal * monthlyRate);
    let principalPart = m === months ? bal : payment - interest;
    if (principalPart > bal) principalPart = bal;
    bal -= principalPart;
    totalPayment += principalPart + interest;
    totalInterest += interest;
  }
  return { monthlyPayment: payment, totalPayment, totalInterest };
}

export function calculateKarikae(input: KarikaeInput): KarikaeResult {
  const balance = Math.max(0, Math.round(input.balance));
  const months = Math.max(0, Math.round(input.remainingYears * 12));
  const fee = Math.max(0, Math.round(input.fee));

  const current = amortize(balance, input.currentRatePercent, months);
  const refinanced = amortize(balance, input.newRatePercent, months);

  const monthlyReduction = current.monthlyPayment - refinanced.monthlyPayment;
  const totalSaved = current.totalPayment - refinanced.totalPayment;
  const netBenefit = totalSaved - fee;

  return {
    current,
    refinanced,
    fee,
    monthlyReduction,
    totalSaved,
    netBenefit,
    worthIt: netBenefit > 0,
  };
}
