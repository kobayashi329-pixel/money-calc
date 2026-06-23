// 教育資金シミュレーションの型定義（金額はすべて「円」単位）

export type KindergartenChoice = "none" | "public" | "private";
export type SchoolChoice = "public" | "private";
export type UniversityChoice = "none" | "national" | "privateLiberal" | "privateScience";

export interface KyoikuInput {
  /** 幼稚園 */
  kindergarten: KindergartenChoice;
  /** 小学校 */
  elementary: SchoolChoice;
  /** 中学校 */
  juniorHigh: SchoolChoice;
  /** 高校 */
  highSchool: SchoolChoice;
  /** 大学 */
  university: UniversityChoice;
  /** 子どもの現在の年齢（歳）。大学費用の積立シミュレーションに使用。 */
  childAge: number;
  /** 教育資金積立の想定利回り（年率・%） */
  savingRatePercent: number;
}

export interface KyoikuStage {
  key: string;
  /** 段階名（幼稚園・小学校など） */
  name: string;
  /** 選択（public/private など） */
  choice: string;
  /** 選択の表示名 */
  choiceLabel: string;
  /** その段階の費用（総額） */
  cost: number;
}

export interface KyoikuResult {
  /** 段階ごとの費用 */
  stages: KyoikuStage[];
  /** 教育費の総額 */
  total: number;
  /** 大学の費用 */
  universityCost: number;
  /** 大学入学（18歳）までの月数 */
  monthsUntilUniversity: number;
  /** 大学費用を18歳までに貯めるための毎月の積立額 */
  requiredMonthlyForUniversity: number;
}
