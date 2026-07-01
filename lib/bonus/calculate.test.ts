import { describe, it, expect } from "vitest";
import {
  calculateBonus,
  bonusTaxRate,
  BONUS_TAX_YEAR,
  HEALTH_STANDARD_BONUS_YEAR_MAX,
  PENSION_STANDARD_BONUS_MONTH_MAX,
} from "./calculate";

describe("bonusTaxRate（賞与の算出率・令和8年分 甲欄）", () => {
  it("扶養0人：前月控除後 68,276円 → 0%", () => {
    expect(bonusTaxRate(68_276, 0)).toBeCloseTo(0, 10);
  });
  it("扶養0人：82,000円未満は0%、82,000円で2.042%", () => {
    expect(bonusTaxRate(81_999, 0)).toBeCloseTo(0, 10);
    expect(bonusTaxRate(82_000, 0)).toBeCloseTo(0.02042, 10);
  });
  it("扶養0人：256,035円 → 4.084%", () => {
    expect(bonusTaxRate(256_035, 0)).toBeCloseTo(0.04084, 10);
  });
  it("扶養2人：512,070円 → 16.336%", () => {
    expect(bonusTaxRate(512_070, 2)).toBeCloseTo(0.16336, 10);
  });
  it("扶養0人：690,125円 → 22.462%", () => {
    expect(bonusTaxRate(690_125, 0)).toBeCloseTo(0.22462, 10);
  });
  it("扶養8人以上は7人の列で近似する", () => {
    expect(bonusTaxRate(300_000, 8)).toBe(bonusTaxRate(300_000, 7));
  });
  it("非常に高い前月給与は上限税率45.945%", () => {
    expect(bonusTaxRate(5_000_000, 0)).toBeCloseTo(0.45945, 10);
  });
});

describe("calculateBonus（賞与の手取り）", () => {
  it("賞与50万・前月給与30万・30歳・扶養0（東京）", () => {
    const r = calculateBonus({
      bonusAmount: 500_000,
      monthlySalary: 300_000,
      age: 30,
      dependents: 0,
    });
    expect(r.standardBonusHealth).toBe(500_000);
    expect(r.standardBonusPension).toBe(500_000);
    expect(r.health).toBe(24_775);
    expect(r.longTermCare).toBe(0);
    expect(r.pension).toBe(45_750);
    expect(r.employment).toBe(2_750);
    expect(r.socialInsurance).toBe(73_275);
    expect(r.prevMonthAfterSocial).toBe(256_035);
    expect(r.incomeTaxRate).toBeCloseTo(0.04084, 10);
    expect(r.incomeTax).toBe(17_427);
    expect(r.takeHome).toBe(409_298);
    expect(r.taxYear).toBe(BONUS_TAX_YEAR);
  });

  it("賞与50万・前月給与30万・45歳（介護保険あり）・扶養0", () => {
    const r = calculateBonus({
      bonusAmount: 500_000,
      monthlySalary: 300_000,
      age: 45,
      dependents: 0,
    });
    expect(r.hasLongTermCare).toBe(true);
    expect(r.longTermCare).toBe(3_975);
    expect(r.socialInsurance).toBe(77_250);
    expect(r.prevMonthAfterSocial).toBe(253_650);
    expect(r.incomeTaxRate).toBeCloseTo(0.04084, 10);
    expect(r.incomeTax).toBe(17_265);
    expect(r.takeHome).toBe(405_485);
  });

  it("賞与100万・前月給与60万・35歳・扶養2", () => {
    const r = calculateBonus({
      bonusAmount: 1_000_000,
      monthlySalary: 600_000,
      age: 35,
      dependents: 2,
    });
    expect(r.socialInsurance).toBe(146_550);
    expect(r.prevMonthAfterSocial).toBe(512_070);
    expect(r.incomeTaxRate).toBeCloseTo(0.16336, 10);
    expect(r.incomeTax).toBe(139_419);
    expect(r.takeHome).toBe(714_031);
  });

  it("賞与200万・前月給与80万・50歳・扶養0（厚生年金の上限が効く）", () => {
    const r = calculateBonus({
      bonusAmount: 2_000_000,
      monthlySalary: 800_000,
      age: 50,
      dependents: 0,
    });
    // 厚生年金の標準賞与額は月150万で頭打ち
    expect(r.standardBonusPension).toBe(PENSION_STANDARD_BONUS_MONTH_MAX);
    expect(r.pension).toBe(137_250);
    expect(r.socialInsurance).toBe(263_250);
    expect(r.prevMonthAfterSocial).toBe(690_125);
    expect(r.incomeTaxRate).toBeCloseTo(0.22462, 10);
    expect(r.incomeTax).toBe(390_108);
    expect(r.takeHome).toBe(1_346_642);
  });

  it("健康保険の標準賞与額は年度累計573万円が上限", () => {
    const r = calculateBonus({
      bonusAmount: 100_000,
      monthlySalary: 300_000,
      age: 30,
      dependents: 0,
      healthStandardBonusYtd: HEALTH_STANDARD_BONUS_YEAR_MAX - 30_000,
    });
    // 残り3万円だけが健康保険の対象
    expect(r.standardBonusHealth).toBe(30_000);
    expect(r.health).toBe(Math.round(30_000 * (0.0991 / 2)));
    // 厚生年金は月150万の別枠なので満額対象
    expect(r.standardBonusPension).toBe(100_000);
  });

  it("前月給与が低いと源泉所得税は0円になりうる", () => {
    const r = calculateBonus({
      bonusAmount: 200_000,
      monthlySalary: 80_000,
      age: 30,
      dependents: 0,
    });
    expect(r.prevMonthAfterSocial).toBeLessThan(82_000);
    expect(r.incomeTaxRate).toBe(0);
    expect(r.incomeTax).toBe(0);
  });

  it("手取り＝総支給−社会保険料−所得税、率は0〜1", () => {
    const r = calculateBonus({
      bonusAmount: 600_000,
      monthlySalary: 350_000,
      age: 30,
      dependents: 1,
    });
    expect(r.takeHome).toBe(r.bonusAmount - r.socialInsurance - r.incomeTax);
    expect(r.takeHomeRate).toBeGreaterThan(0);
    expect(r.takeHomeRate).toBeLessThan(1);
  });
});
