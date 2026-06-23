// 相続税計算機の型定義（金額はすべて「円」単位）

export interface SozokuInput {
  /** 課税価格の合計額（遺産総額・債務控除後の正味の遺産額） */
  taxableEstate: number;
  /** 配偶者がいるか */
  hasSpouse: boolean;
  /** 子の人数（法定相続人となる子） */
  children: number;
}

/** 相続人の種別 */
export type HeirKind = "spouse" | "child";

/** 法定相続分の割当（計算途中） */
export interface HeirShare {
  kind: HeirKind;
  /** 法定相続分（割合・0〜1） */
  share: number;
}

/** 相続人ごとの内訳 */
export interface HeirDetail {
  kind: HeirKind;
  /** 法定相続分（割合） */
  share: number;
  /** 法定相続分に応ずる取得金額（速算表の基礎） */
  legalAmount: number;
  /** 軽減前の税額（按分後） */
  taxBeforeCredit: number;
  /** 実際の納税額（配偶者は税額軽減を適用） */
  payable: number;
}

export interface SozokuResult {
  /** 遺産総額（入力） */
  estate: number;
  /** 法定相続人の数 */
  heirCount: number;
  /** 基礎控除額 */
  basicExemption: number;
  /** 課税遺産総額（基礎控除後） */
  taxableEstateAfterExemption: number;
  /** 相続税の総額（配偶者の税額軽減を適用する前の全体額） */
  totalTax: number;
  /** 配偶者の軽減前税額 */
  spouseTaxBeforeCredit: number;
  /** 配偶者の税額軽減額 */
  spouseCredit: number;
  /** 実際に納める相続税の合計（配偶者軽減後） */
  payableTax: number;
  /** 相続人ごとの内訳 */
  heirs: HeirDetail[];
  /** 課税対象か（基礎控除以下なら false＝相続税はかからない） */
  isTaxable: boolean;
}
