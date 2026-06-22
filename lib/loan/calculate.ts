// =============================================================
//  住宅ローン返済シミュレータ — 計算ロジック（純粋関数）
//  元利均等返済・元金均等返済に対応。月ごとに利息を円未満四捨五入する
//  （金融機関の実務に近い）方式で償却表を作り、総返済額・利息総額を算出。
// =============================================================

/** 返済方式 */
export type RepaymentMethod = "equal-payment" | "equal-principal";
// equal-payment   = 元利均等返済（毎月の返済額が一定）
// equal-principal = 元金均等返済（毎月の元金が一定・返済額は徐々に減る）

export interface LoanInput {
  /** 借入額（円） */
  principal: number;
  /** 年利（%）。例: 1.0 */
  annualRatePercent: number;
  /** 返済期間（年） */
  years: number;
  /** 返済方式 */
  method: RepaymentMethod;
}

/** 年ごとの残高推移（グラフ用） */
export interface YearlyPoint {
  /** 経過年（1〜years） */
  year: number;
  /** その年末のローン残高（円） */
  balance: number;
}

export interface LoanResult {
  principal: number;
  months: number;
  method: RepaymentMethod;
  /** 毎月の返済額（元利均等は一定、元金均等は初回＝最大） */
  monthlyPayment: number;
  /** 初回の返済額 */
  firstPayment: number;
  /** 最終回の返済額 */
  lastPayment: number;
  /** 総返済額（円） */
  totalPayment: number;
  /** 利息総額（円） */
  totalInterest: number;
  /** 年ごとの残高推移 */
  yearlyBalance: YearlyPoint[];
}

/** 元利均等返済の毎月返済額（四捨五入前の理論値） */
export function equalPaymentMonthly(
  principal: number,
  monthlyRate: number,
  months: number,
): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  const x = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * x) / (x - 1);
}

/**
 * 住宅ローンを計算する。月次の償却表を作り、総額・残高推移を返す。
 */
export function calculateLoan(input: LoanInput): LoanResult {
  const principal = Math.max(0, Math.round(input.principal));
  const months = Math.max(0, Math.round(input.years * 12));
  const monthlyRate = input.annualRatePercent / 100 / 12;
  const method = input.method;

  const result: LoanResult = {
    principal,
    months,
    method,
    monthlyPayment: 0,
    firstPayment: 0,
    lastPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    yearlyBalance: [],
  };
  if (principal === 0 || months === 0) return result;

  // 元利均等の毎月返済額（四捨五入）
  const fixedPayment = Math.round(equalPaymentMonthly(principal, monthlyRate, months));
  // 元金均等の毎月元金（四捨五入。端数は最終回で調整）
  const fixedPrincipal = Math.round(principal / months);

  let balance = principal;
  let totalPayment = 0;
  let totalInterest = 0;
  const yearly: YearlyPoint[] = [];

  for (let m = 1; m <= months; m++) {
    const interest = Math.round(balance * monthlyRate);
    let principalPart: number;
    if (method === "equal-payment") {
      principalPart = m === months ? balance : fixedPayment - interest;
    } else {
      principalPart = m === months ? balance : fixedPrincipal;
    }
    // 残高を超えない
    if (principalPart > balance) principalPart = balance;
    const payment = principalPart + interest;

    balance -= principalPart;
    totalPayment += payment;
    totalInterest += interest;

    if (m === 1) result.firstPayment = payment;
    if (m === months) result.lastPayment = payment;

    // 年末（12ヶ月ごと）または最終月の残高を記録
    if (m % 12 === 0 || m === months) {
      yearly.push({ year: Math.ceil(m / 12), balance: Math.max(0, balance) });
    }
  }

  result.monthlyPayment = method === "equal-payment" ? fixedPayment : result.firstPayment;
  result.totalPayment = totalPayment;
  result.totalInterest = totalInterest;
  result.yearlyBalance = yearly;
  return result;
}
