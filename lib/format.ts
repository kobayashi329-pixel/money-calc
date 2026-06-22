// 表示用フォーマッタ

/** 円の整数を「1,234,567円」形式に */
export function yen(value: number): string {
  return `${Math.round(value).toLocaleString("ja-JP")}円`;
}

/** 円を「123万円」「1,234万円」風の万円表記に（概算ラベル用） */
export function manYen(value: number): string {
  const man = value / 10000;
  // 小数第1位まで（端数があるときのみ）
  const rounded = Math.round(man * 10) / 10;
  return `${rounded.toLocaleString("ja-JP")}万円`;
}

/** 0〜1 の比率を「84.2%」形式に */
export function percent(rate: number, digits = 1): string {
  return `${(rate * 100).toFixed(digits)}%`;
}
