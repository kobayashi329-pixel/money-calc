// =============================================================
//  児童手当 計算ロジック（純粋関数・2024年10月拡充後）
//  支給額（月額・子1人あたり）:
//    ・0〜3歳未満：15,000円
//    ・3歳〜高校生年代（18歳到達後最初の3/31）まで：10,000円
//    ・第3子以降：0歳〜高校生年代まで一律 30,000円
//  ・所得制限は撤廃（2024年10月〜）
//  ・第3子の数え方：養育している22歳年度末までの子を年齢順に数える
//    （大学生年代の子も算定対象。ただし支給は高校生年代まで）
//  ・支給は偶数月・年6回
//  出典: こども家庭庁「児童手当制度のご案内」／政府広報オンライン
//        https://www.cfa.go.jp/policies/kokoseido/jidouteate/mottoouen
// =============================================================

/** 数え方の対象年齢の上限（22歳年度末まで＝おおむね22歳） */
const COUNT_MAX_AGE = 22;
/** 支給対象の年齢の上限（高校生年代＝おおむね18歳） */
const PAY_MAX_AGE = 18;

export interface JidoChild {
  age: number;
  /** 第何子か（年齢順・1始まり） */
  birthOrder: number;
  /** この子の月額 */
  monthly: number;
}

export interface JidoResult {
  children: JidoChild[];
  /** 月額合計 */
  monthlyTotal: number;
  /** 年額合計 */
  annualTotal: number;
}

/** 子の年齢の配列（何人でも）から児童手当の月額を計算する */
export function calculateJido(ages: number[]): JidoResult {
  // 数え方の対象（22歳以下）を年齢の高い順に並べ、第N子を決める
  const counted = ages
    .filter((a) => a >= 0 && a <= COUNT_MAX_AGE)
    .sort((a, b) => b - a);

  const children: JidoChild[] = counted.map((age, i) => {
    const birthOrder = i + 1;
    let monthly = 0;
    if (age <= PAY_MAX_AGE) {
      if (birthOrder >= 3) monthly = 30_000;
      else if (age < 3) monthly = 15_000;
      else monthly = 10_000;
    }
    return { age, birthOrder, monthly };
  });

  const monthlyTotal = children.reduce((s, c) => s + c.monthly, 0);
  return { children, monthlyTotal, annualTotal: monthlyTotal * 12 };
}

/** 生まれてから高校卒業までの1人あたり総受給額の目安（静的な参考値） */
export const LIFETIME_TOTAL = {
  /** 第1子・第2子：15,000×36か月＋10,000×180か月 */
  first: 15_000 * 36 + 10_000 * 180, // 2,340,000
  /** 第3子以降：30,000×216か月 */
  third: 30_000 * 216, // 6,480,000
};
