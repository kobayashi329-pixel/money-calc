import { describe, it, expect } from "vitest";
import { calculateJuuminzei } from "./calculate";

const base = { age: 30, hasSpouse: false, dependents: 0 };

describe("住民税 計算", () => {
  it("年収500万・独身は所得割＋均等割で約24万円台", () => {
    const r = calculateJuuminzei({ ...base, annualIncome: 5_000_000 });
    // 公知の目安（年収500万独身で住民税 約24万円前後）
    expect(r.total).toBeGreaterThan(220_000);
    expect(r.total).toBeLessThan(260_000);
    // 均等割は標準5,000円
    expect(r.perCapitaLevy).toBe(5_000);
  });

  it("所得割＝合計−均等割", () => {
    const r = calculateJuuminzei({ ...base, annualIncome: 6_000_000 });
    expect(r.incomeLevy).toBe(r.total - r.perCapitaLevy);
  });

  it("配偶者・扶養がいると住民税は下がる", () => {
    const single = calculateJuuminzei({ ...base, annualIncome: 5_000_000 });
    const family = calculateJuuminzei({ ...base, annualIncome: 5_000_000, hasSpouse: true, dependents: 1 });
    expect(family.total).toBeLessThan(single.total);
  });

  it("年収が高いほど住民税は増える（単調増加）", () => {
    const incomes = [3_000_000, 5_000_000, 7_000_000, 10_000_000];
    const totals = incomes.map((annualIncome) => calculateJuuminzei({ ...base, annualIncome }).total);
    for (let i = 1; i < totals.length; i++) expect(totals[i]).toBeGreaterThan(totals[i - 1]);
  });

  it("低収入で所得割が生じない場合は均等割のみ", () => {
    const r = calculateJuuminzei({ ...base, annualIncome: 1_000_000 });
    expect(r.incomeLevy).toBe(0);
  });
});
