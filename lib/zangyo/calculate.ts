// =============================================================
//  残業代（割増賃金）計算ロジック（純粋関数）
//  1時間あたりの基礎賃金 ＝ 月の基礎賃金 ÷ 月平均所定労働時間
//  割増賃金（労働基準法）:
//    ・時間外（法定外）労働：25%増（1.25）
//      └ 1か月60時間を超える時間外は50%増（1.5）※中小企業も2023年4月から適用
//    ・深夜労働（22時〜翌5時）：25%加算（時間外と重複可。例：時間外＋深夜＝1.5）
//    ・法定休日労働：35%増（1.35）
//  出典: 厚生労働省「割増賃金の計算方法」「時間外労働の割増賃金率」
//        https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/shienjigyou/03.html
//  ※基礎賃金には家族手当・通勤手当・住宅手当など一部の手当は含めない。
// =============================================================

/** 割増率 */
export const RATE_OT = 0.25; // 時間外（60時間以下）
export const RATE_OT_OVER60 = 0.5; // 時間外（60時間超）
export const RATE_NIGHT = 0.25; // 深夜（加算）
export const RATE_HOLIDAY = 0.35; // 法定休日
const OT_THRESHOLD = 60;

export interface ZangyoInput {
  /** 月の基礎賃金（基本給＋割増の基礎となる手当） */
  baseWage: number;
  /** 月平均所定労働時間 */
  monthlyHours: number;
  /** 時間外労働の時間（月・法定外） */
  overtimeHours: number;
  /** うち深夜（22〜5時）に当たる時間 */
  nightHours: number;
  /** 法定休日労働の時間（月） */
  holidayHours: number;
}

export interface ZangyoResult {
  /** 1時間あたりの基礎賃金 */
  hourlyWage: number;
  /** 時間外手当（60時間以下・25%増の分） */
  payOvertime: number;
  /** 時間外手当（60時間超・50%増の分） */
  payOvertimeOver60: number;
  /** 深夜割増（25%加算分） */
  payNight: number;
  /** 法定休日手当（35%増の分） */
  payHoliday: number;
  /** 残業代の合計 */
  total: number;
}

export function calculateZangyo(input: ZangyoInput): ZangyoResult {
  const hours = Math.max(1, input.monthlyHours);
  const hourlyWage = input.baseWage / hours;

  const ot = Math.max(0, input.overtimeHours);
  const otUnder = Math.min(ot, OT_THRESHOLD);
  const otOver = Math.max(0, ot - OT_THRESHOLD);

  const payOvertime = Math.round(otUnder * hourlyWage * (1 + RATE_OT));
  const payOvertimeOver60 = Math.round(otOver * hourlyWage * (1 + RATE_OT_OVER60));
  const payNight = Math.round(Math.max(0, input.nightHours) * hourlyWage * RATE_NIGHT);
  const payHoliday = Math.round(
    Math.max(0, input.holidayHours) * hourlyWage * (1 + RATE_HOLIDAY),
  );

  return {
    hourlyWage: Math.round(hourlyWage),
    payOvertime,
    payOvertimeOver60,
    payNight,
    payHoliday,
    total: payOvertime + payOvertimeOver60 + payNight + payHoliday,
  };
}
