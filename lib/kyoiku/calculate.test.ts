import { describe, it, expect } from "vitest";
import { calculateKyoiku } from "./calculate";
import type { KyoikuInput } from "./types";

const allPublic: KyoikuInput = {
  kindergarten: "public",
  elementary: "public",
  juniorHigh: "public",
  highSchool: "public",
  university: "national",
  childAge: 0,
  savingRatePercent: 2,
};

describe("教育費の総額", () => {
  it("オール公立＋国公立大学＝約819万円", () => {
    const r = calculateKyoiku(allPublic);
    expect(r.total).toBe(8_194_000);
    expect(r.universityCost).toBe(2_425_000);
  });

  it("オール私立＋私立理系＝約2,391万円", () => {
    const r = calculateKyoiku({
      kindergarten: "private",
      elementary: "private",
      juniorHigh: "private",
      highSchool: "private",
      university: "privateScience",
      childAge: 0,
      savingRatePercent: 2,
    });
    expect(r.total).toBe(23_909_000);
  });

  it("段階ごとの内訳の合計は総額に一致する", () => {
    const r = calculateKyoiku(allPublic);
    const sum = r.stages.reduce((s, st) => s + st.cost, 0);
    expect(sum).toBe(r.total);
  });

  it("私立は公立より高い", () => {
    const pub = calculateKyoiku(allPublic);
    const priv = calculateKyoiku({ ...allPublic, elementary: "private" });
    expect(priv.total).toBeGreaterThan(pub.total);
  });

  it("幼稚園・大学を「進学しない」にすると費用が減る", () => {
    const withAll = calculateKyoiku(allPublic);
    const noKinderNoUni = calculateKyoiku({ ...allPublic, kindergarten: "none", university: "none" });
    expect(noKinderNoUni.total).toBeLessThan(withAll.total);
    expect(noKinderNoUni.universityCost).toBe(0);
  });
});

describe("大学費用の積立", () => {
  it("0歳・利回り2%なら18年（216ヶ月）で国公立大費用を月9,336円", () => {
    const r = calculateKyoiku(allPublic);
    expect(r.monthsUntilUniversity).toBe(216);
    expect(r.requiredMonthlyForUniversity).toBe(9_336);
  });

  it("子の年齢が高い（残り期間が短い）ほど毎月の積立額は大きい", () => {
    const baby = calculateKyoiku({ ...allPublic, childAge: 0 });
    const teen = calculateKyoiku({ ...allPublic, childAge: 15 });
    expect(teen.requiredMonthlyForUniversity).toBeGreaterThan(baby.requiredMonthlyForUniversity);
  });

  it("大学に進学しないなら積立は不要", () => {
    const r = calculateKyoiku({ ...allPublic, university: "none" });
    expect(r.requiredMonthlyForUniversity).toBe(0);
  });

  it("既に18歳以上なら積立期間0で積立額0（費用は別途必要）", () => {
    const r = calculateKyoiku({ ...allPublic, childAge: 18 });
    expect(r.monthsUntilUniversity).toBe(0);
    expect(r.requiredMonthlyForUniversity).toBe(0);
  });

  it("利回り0%なら積立額＝大学費用÷積立月数", () => {
    const r = calculateKyoiku({ ...allPublic, savingRatePercent: 0 });
    expect(r.requiredMonthlyForUniversity).toBe(Math.round(2_425_000 / 216));
  });
});
