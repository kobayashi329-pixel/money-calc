import { describe, it, expect } from "vitest";
import { calculateLifePlan } from "./calculate";
import type { LifePlanInput } from "./types";

const base: LifePlanInput = {
  currentAge: 40,
  untilAge: 95,
  retireAge: 65,
  currentYear: 2026,
  annualIncome: 5_000_000,
  incomeGrowthPercent: 0,
  pensionAnnual: 2_000_000,
  annualExpense: 4_000_000,
  retireExpense: 3_000_000,
  expenseInflationPercent: 0,
  currentSavings: 10_000_000,
  savingRatePercent: 0,
  events: [],
};

describe("生涯キャッシュフローの基本", () => {
  const r = calculateLifePlan(base);

  it("現在〜想定寿命までの行数（40〜95歳＝56年分）", () => {
    expect(r.rows).toHaveLength(56);
    expect(r.rows[0].age).toBe(40);
    expect(r.rows[r.rows.length - 1].age).toBe(95);
  });

  it("先頭行の年は currentYear、年齢とともに進む", () => {
    expect(r.rows[0].year).toBe(2026);
    expect(r.rows[10].year).toBe(2036);
  });

  it("現役は黒字で残高が増え、退職時にピーク（3,500万円）", () => {
    expect(r.peakBalance).toBe(35_000_000);
    // 退職直前（64歳）の残高がピーク
    const at64 = r.rows.find((x) => x.age === 64)!;
    expect(at64.balance).toBe(35_000_000);
  });

  it("退職後は赤字で取り崩し、最終残高400万円・枯渇しない", () => {
    expect(r.finalBalance).toBe(4_000_000);
    expect(r.depletionAge).toBeNull();
  });

  it("各行: 収支＝収入−支出", () => {
    for (const row of r.rows) {
      expect(row.net).toBe(row.income - row.expense);
    }
  });
});

describe("貯蓄の枯渇判定", () => {
  it("退職後支出が多いと貯蓄が底をつく年齢が出る", () => {
    const r = calculateLifePlan({ ...base, retireExpense: 4_000_000 });
    expect(r.depletionAge).toBe(82);
    expect(r.finalBalance).toBeLessThan(0);
  });

  it("退職後収入が支出を上回れば枯渇しない", () => {
    const r = calculateLifePlan({ ...base, pensionAnnual: 4_000_000, retireExpense: 3_000_000 });
    expect(r.depletionAge).toBeNull();
  });
});

describe("各種前提の反映", () => {
  it("昇給率を上げると現役の収入と残高が増える", () => {
    const flat = calculateLifePlan(base);
    const grow = calculateLifePlan({ ...base, incomeGrowthPercent: 2 });
    expect(grow.peakBalance).toBeGreaterThan(flat.peakBalance);
  });

  it("インフレ率を上げると支出が増え最終残高が減る", () => {
    const flat = calculateLifePlan(base);
    const infl = calculateLifePlan({ ...base, expenseInflationPercent: 2 });
    expect(infl.finalBalance).toBeLessThan(flat.finalBalance);
  });

  it("運用利回りを上げると最終残高が増える", () => {
    const flat = calculateLifePlan(base);
    const inv = calculateLifePlan({ ...base, savingRatePercent: 3 });
    expect(inv.finalBalance).toBeGreaterThan(flat.finalBalance);
  });

  it("ライフイベント支出はその年齢の支出に上乗せされる", () => {
    const r = calculateLifePlan({ ...base, events: [{ age: 45, amount: 3_000_000, label: "車" }] });
    const at45 = r.rows.find((x) => x.age === 45)!;
    const at44 = r.rows.find((x) => x.age === 44)!;
    expect(at45.expense).toBe(at44.expense + 3_000_000);
  });
});
