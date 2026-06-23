// =============================================================
//  相続税の計算ロジック（純粋関数）
//  日本の相続税は「法定相続分で按分してから税率を適用し、合算する」方式。
//  計算順序:
//    課税価格の合計（遺産総額）
//      → 基礎控除（3000万 + 600万 × 法定相続人数）を引く
//      → 課税遺産総額
//      → 各法定相続人が法定相続分で取得したと仮定して速算表を適用
//      → 合算 = 相続税の総額
//      → 実際の取得割合で按分（本ツールは法定相続分どおりと仮定）
//      → 配偶者の税額軽減（法定相続分 または 1.6億円まで非課税）
//
//  ※ 本ツールは「配偶者＋子」を中心とした簡易版。法定相続分どおりに分割した
//    場合の納税額の目安を示す。第2順位(父母)・第3順位(兄弟)や、孫養子の
//    2割加算、各種特例（小規模宅地等）は対象外。
//
//  出典:
//    国税庁 No.4152 相続税の計算 https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4152.htm
//    国税庁 No.4155 相続税の税率 https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4155.htm
//    国税庁 No.4158 配偶者の税額の軽減 https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4158.htm
// =============================================================
import {
  BASIC_EXEMPTION_BASE,
  BASIC_EXEMPTION_PER_HEIR,
  INHERITANCE_TAX_BRACKETS,
  SPOUSE_CREDIT_FLOOR,
} from "./constants";
import type { SozokuInput, SozokuResult, HeirShare } from "./types";

/** 速算表から1人分の税額を求める（法定相続分に応ずる取得金額ベース） */
export function bracketTax(amount: number): number {
  const a = Math.max(0, amount);
  for (const b of INHERITANCE_TAX_BRACKETS) {
    if (a <= b.maxAmount) return Math.max(0, a * b.rate - b.deduction);
  }
  return 0;
}

/**
 * 法定相続人の構成から、各人の法定相続分（割合）を求める。
 * 配偶者＋子 を中心とした簡易版。
 */
function legalShares(hasSpouse: boolean, children: number): HeirShare[] {
  const shares: HeirShare[] = [];
  const kids = Math.max(0, Math.round(children));

  if (hasSpouse && kids > 0) {
    shares.push({ kind: "spouse", share: 1 / 2 });
    for (let i = 0; i < kids; i++) shares.push({ kind: "child", share: (1 / 2) / kids });
  } else if (hasSpouse && kids === 0) {
    // 簡易版: 配偶者のみが相続すると仮定（父母・兄弟は対象外）
    shares.push({ kind: "spouse", share: 1 });
  } else if (!hasSpouse && kids > 0) {
    for (let i = 0; i < kids; i++) shares.push({ kind: "child", share: 1 / kids });
  }
  return shares;
}

export function calculateSozoku(input: SozokuInput): SozokuResult {
  const estate = Math.max(0, Math.round(input.taxableEstate));
  const hasSpouse = input.hasSpouse;
  const children = Math.max(0, Math.round(input.children));

  const shares = legalShares(hasSpouse, children);
  const heirCount = shares.length;

  // 基礎控除
  const basicExemption = BASIC_EXEMPTION_BASE + BASIC_EXEMPTION_PER_HEIR * heirCount;

  // 課税遺産総額（基礎控除後）
  const taxableEstateAfterExemption = Math.max(0, estate - basicExemption);

  // 課税対象がなければ相続税はかからない
  if (heirCount === 0 || taxableEstateAfterExemption === 0) {
    return {
      estate,
      heirCount,
      basicExemption,
      taxableEstateAfterExemption,
      totalTax: 0,
      spouseTaxBeforeCredit: 0,
      spouseCredit: 0,
      payableTax: 0,
      heirs: shares.map((s) => ({ ...s, legalAmount: 0, taxBeforeCredit: 0, payable: 0 })),
      isTaxable: false,
    };
  }

  // 各法定相続人の取得額（法定相続分どおり）と速算表による税額
  const heirDetails = shares.map((s) => {
    const legalAmount = Math.floor((taxableEstateAfterExemption * s.share) / 1000) * 1000;
    return { ...s, legalAmount, taxBeforeCredit: bracketTax(legalAmount) };
  });

  // 相続税の総額（合算・100円未満切捨て）
  const totalTax = Math.floor(heirDetails.reduce((sum, h) => sum + h.taxBeforeCredit, 0) / 100) * 100;

  // 実際の取得割合（本ツールは法定相続分どおりと仮定）で按分
  const heirs = heirDetails.map((h) => {
    const payableBeforeCredit = Math.round(totalTax * h.share);
    return { ...h, payable: payableBeforeCredit };
  });

  // 配偶者の税額軽減: 配偶者の取得が「法定相続分 または 1.6億円」のいずれか多い額まで非課税。
  // 本ツールは法定相続分どおりに取得する前提なので、配偶者分は全額が軽減される。
  let spouseTaxBeforeCredit = 0;
  let spouseCredit = 0;
  const spouse = heirs.find((h) => h.kind === "spouse");
  if (spouse) {
    spouseTaxBeforeCredit = spouse.payable;
    // 取得額 = estate × share。法定相続分 と 1.6億 の多い方が非課税枠。
    const spouseAcquired = estate * spouse.share;
    const exemptCeiling = Math.max(SPOUSE_CREDIT_FLOOR, estate * spouse.share);
    spouseCredit = spouseAcquired <= exemptCeiling ? spouseTaxBeforeCredit : 0;
    spouse.payable = spouseTaxBeforeCredit - spouseCredit;
  }

  const payableTax = heirs.reduce((sum, h) => sum + h.payable, 0);

  return {
    estate,
    heirCount,
    basicExemption,
    taxableEstateAfterExemption,
    totalTax,
    spouseTaxBeforeCredit,
    spouseCredit,
    payableTax,
    heirs: heirs.map((h) => ({
      kind: h.kind,
      share: h.share,
      legalAmount: h.legalAmount,
      taxBeforeCredit: h.taxBeforeCredit,
      payable: h.payable,
    })),
    isTaxable: true,
  };
}
