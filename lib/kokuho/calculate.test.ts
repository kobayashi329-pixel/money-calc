import { describe, it, expect } from "vitest";
import { calculateKokuho } from "./calculate";

describe("国民健康保険料 計算（標準モデル・東京23区）", () => {
  it("所得400万・1人・介護あり（40〜64歳）", () => {
    const r = calculateKokuho({ income: 4_000_000, members: 1, kaigoMembers: 1 });
    expect(r.base).toBe(3_570_000);
    expect(r.iryo).toBe(322_500); // 3,570,000×7.71%＋47,300
    expect(r.shien).toBe(112_800);
    expect(r.kaigo).toBe(102_500);
    expect(r.total).toBe(537_800);
  });

  it("所得300万・1人・介護なし（40歳未満）", () => {
    const r = calculateKokuho({ income: 3_000_000, members: 1, kaigoMembers: 0 });
    expect(r.iryo).toBe(245_400);
    expect(r.shien).toBe(85_900);
    expect(r.kaigo).toBe(0);
    expect(r.total).toBe(331_300);
  });

  it("高所得は賦課限度額で頭打ち（合計106万）", () => {
    const r = calculateKokuho({ income: 20_000_000, members: 1, kaigoMembers: 1 });
    expect(r.iryo).toBe(650_000);
    expect(r.shien).toBe(240_000);
    expect(r.kaigo).toBe(170_000);
    expect(r.total).toBe(1_060_000);
  });

  it("加入人数が増えると均等割が増える", () => {
    const one = calculateKokuho({ income: 3_000_000, members: 1, kaigoMembers: 0 }).total;
    const three = calculateKokuho({ income: 3_000_000, members: 3, kaigoMembers: 0 }).total;
    expect(three).toBeGreaterThan(one);
  });

  it("料率を自治体の値に変更できる", () => {
    const r = calculateKokuho({
      income: 3_000_000,
      members: 1,
      kaigoMembers: 0,
      rates: { iryoRate: 0.09, iryoPerCapita: 50_000 },
    });
    // 2,570,000×9%＋50,000 = 281,300
    expect(r.iryo).toBe(281_300);
  });
});
