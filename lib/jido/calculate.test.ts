import { describe, it, expect } from "vitest";
import { calculateJido, LIFETIME_TOTAL } from "./calculate";

describe("児童手当 計算（2024年10月拡充後）", () => {
  it("0〜3歳未満は15,000円、3歳〜高校生は10,000円", () => {
    expect(calculateJido([1]).monthlyTotal).toBe(15_000);
    expect(calculateJido([10]).monthlyTotal).toBe(10_000);
  });

  it("第3子以降は一律30,000円（0歳でも高校生でも）", () => {
    // 3人：8歳(第1子1万)＋5歳(第2子1万)＋1歳(第3子3万)＝5万円
    const r = calculateJido([8, 5, 1]);
    expect(r.monthlyTotal).toBe(10_000 + 10_000 + 30_000);
    expect(r.children.find((c) => c.age === 1)?.monthly).toBe(30_000);
  });

  it("大学生（19〜22歳）は支給0だが第◯子の数えには含む", () => {
    // 20歳(第1子・支給0)＋16歳(第2子1万)＋10歳(第3子3万)
    const r = calculateJido([20, 16, 10]);
    expect(r.children.find((c) => c.age === 20)?.monthly).toBe(0);
    expect(r.children.find((c) => c.age === 20)?.birthOrder).toBe(1);
    expect(r.children.find((c) => c.age === 10)?.birthOrder).toBe(3);
    expect(r.monthlyTotal).toBe(10_000 + 30_000);
  });

  it("22歳超はカウント対象外", () => {
    // 24歳は除外 → 16歳が第1子、10歳が第2子
    const r = calculateJido([24, 16, 10]);
    expect(r.children.length).toBe(2);
    expect(r.monthlyTotal).toBe(10_000 + 10_000);
  });

  it("年額＝月額×12", () => {
    const r = calculateJido([2, 5]);
    expect(r.annualTotal).toBe(r.monthlyTotal * 12);
  });

  it("生涯総額の目安：第1子約234万・第3子約648万", () => {
    expect(LIFETIME_TOTAL.first).toBe(2_340_000);
    expect(LIFETIME_TOTAL.third).toBe(6_480_000);
  });
});
