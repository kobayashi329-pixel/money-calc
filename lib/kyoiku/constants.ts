// =============================================================
//  教育資金シミュレーション — 費用の定数
//  幼稚園〜高校は文部科学省「令和3年度 子供の学習費調査」の学習費総額
//  （学校教育費＋給食費＋学校外活動費）を各段階の在学年数で合計した概算。
//  大学は日本政策金融公庫「教育費負担の実態調査」等をもとにした入学・在学費用の概算。
//  ※ いずれも代表的な目安。実際は学校・地域・家庭の方針で大きく変わる。
//  出典:
//    文部科学省 子供の学習費調査 https://www.mext.go.jp/b_menu/toukei/chousa03/gakushuuhi/1268091.htm
//    日本政策金融公庫 教育費負担の実態調査 https://www.jfc.go.jp/n/findings/gakind.html
// =============================================================

/** 各段階の費用（在学期間の総額・円） */
export const STAGE_COSTS = {
  // 幼稚園（3年）
  kindergarten: {
    none: 0,
    public: 495_000, // 約16.5万円/年 × 3年
    private: 927_000, // 約30.9万円/年 × 3年
  },
  // 小学校（6年）
  elementary: {
    public: 2_118_000, // 約35.3万円/年 × 6年
    private: 10_002_000, // 約166.7万円/年 × 6年
  },
  // 中学校（3年）
  juniorHigh: {
    public: 1_617_000, // 約53.9万円/年 × 3年
    private: 4_308_000, // 約143.6万円/年 × 3年
  },
  // 高校（3年・全日制）
  highSchool: {
    public: 1_539_000, // 約51.3万円/年 × 3年
    private: 3_162_000, // 約105.4万円/年 × 3年
  },
  // 大学（4年・入学費用＋在学費用）
  university: {
    none: 0,
    national: 2_425_000, // 国公立大学
    privateLiberal: 4_080_000, // 私立大学（文系）
    privateScience: 5_510_000, // 私立大学（理系）
  },
} as const;

/** 表示用ラベル */
export const STAGE_LABELS: Record<string, string> = {
  kindergarten: "幼稚園",
  elementary: "小学校",
  juniorHigh: "中学校",
  highSchool: "高校",
  university: "大学",
};

export const CHOICE_LABELS: Record<string, string> = {
  none: "進学しない",
  public: "公立",
  private: "私立",
  national: "国公立",
  privateLiberal: "私立（文系）",
  privateScience: "私立（理系）",
};

/** 大学に入学する年齢（積立の目標時点） */
export const UNIVERSITY_START_AGE = 18;
