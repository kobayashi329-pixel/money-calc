// 埋め込み（/embed/<slug>）用：計算機slug → 本体コンポーネントのマップ。
import type { ComponentType } from "react";
import { TakeHomeCalculator } from "./TakeHomeCalculator";
import { LoanCalculator } from "./LoanCalculator";
import { FurusatoCalculator } from "./FurusatoCalculator";
import { NisaCalculator } from "./NisaCalculator";
import { IdecoCalculator } from "./IdecoCalculator";
import { KuriageCalculator } from "./KuriageCalculator";
import { SozokuCalculator } from "./SozokuCalculator";
import { KarikaeCalculator } from "./KarikaeCalculator";
import { RougoCalculator } from "./RougoCalculator";
import { KyoikuCalculator } from "./KyoikuCalculator";
import { LifePlanCalculator } from "./LifePlanCalculator";
import { NenkinCalculator } from "./NenkinCalculator";
import { TaishokuCalculator } from "./TaishokuCalculator";
import { ShohizeiCalculator } from "./ShohizeiCalculator";
import { JikyuCalculator } from "./JikyuCalculator";
import { JidoshazeiCalculator } from "./JidoshazeiCalculator";
import { KoteiCalculator } from "./KoteiCalculator";
import { JuuminzeiCalculator } from "./JuuminzeiCalculator";
import { ShahoCalculator } from "./ShahoCalculator";
import { ZouyoCalculator } from "./ZouyoCalculator";
import { ZangyoCalculator } from "./ZangyoCalculator";
import { ShitsugyoCalculator } from "./ShitsugyoCalculator";
import { IkukyuCalculator } from "./IkukyuCalculator";
import { ShoubyoCalculator } from "./ShoubyoCalculator";
import { ShussanCalculator } from "./ShussanCalculator";
import { JidoCalculator } from "./JidoCalculator";
import { JuloanKojoCalculator } from "./JuloanKojoCalculator";
import { ShotokuCalculator } from "./ShotokuCalculator";
import { IryouhiCalculator } from "./IryouhiCalculator";
import { KokuhoCalculator } from "./KokuhoCalculator";

export const EMBEDDABLE: Record<string, ComponentType> = {
  tedori: TakeHomeCalculator,
  "jutaku-loan": LoanCalculator,
  "furusato-nozei": FurusatoCalculator,
  nisa: NisaCalculator,
  ideco: IdecoCalculator,
  "kuriage-hensai": KuriageCalculator,
  sozokuzei: SozokuCalculator,
  karikae: KarikaeCalculator,
  "rougo-shikin": RougoCalculator,
  "kyoiku-shikin": KyoikuCalculator,
  "life-plan": LifePlanCalculator,
  "nenkin-mikomi": NenkinCalculator,
  taishokukin: TaishokuCalculator,
  shohizei: ShohizeiCalculator,
  "jikyu-nenshu": JikyuCalculator,
  jidoshazei: JidoshazeiCalculator,
  "kotei-shisanzei": KoteiCalculator,
  juuminzei: JuuminzeiCalculator,
  shahoken: ShahoCalculator,
  zouyozei: ZouyoCalculator,
  zangyodai: ZangyoCalculator,
  "shitsugyo-hoken": ShitsugyoCalculator,
  "ikukyu-kyufu": IkukyuCalculator,
  "shoubyo-teate": ShoubyoCalculator,
  "shussan-teate": ShussanCalculator,
  "jido-teate": JidoCalculator,
  "jutaku-loan-kojo": JuloanKojoCalculator,
  shotokuzei: ShotokuCalculator,
  "iryouhi-koujo": IryouhiCalculator,
  "kokumin-kenkohoken": KokuhoCalculator,
};
