import * as from from "@open-dpe-logement/ademe-models";

export type { Input } from "../types.js";

export type Paroi = BaieVitree | Mur | PlancherBas | PlancherHaut | Porte;

export type ParoiOpaque = Mur | PlancherBas | PlancherHaut;

export type ParoiVitree = BaieVitree | Porte;

export type BaieVitree =
	| from.dpe.v22.BaieVitree
	| from.dpe.v23.BaieVitree
	| from.dpe.v24.BaieVitree
	| from.dpe.v25.BaieVitree
	| from.dpe.v26.BaieVitree;

export type BaieVitreeDoubleFenetre =
	| from.dpe.v22.BaieVitreeDoubleFenetre
	| from.dpe.v23.BaieVitreeDoubleFenetre
	| from.dpe.v24.BaieVitreeDoubleFenetre
	| from.dpe.v25.BaieVitreeDoubleFenetre
	| from.dpe.v26.BaieVitreeDoubleFenetre;

export type Mur = from.dpe.Mur;

export type PlancherBas = from.dpe.PlancherBas;

export type PlancherHaut = from.dpe.PlancherHaut;

export type Porte = from.dpe.Porte;

export type PontThermique = from.dpe.PontThermique;

export type MasqueLointainNonHomogene = from.dpe.MasqueLointainNonHomogene;

export type Ets = from.dpe.Ets;

export type BaieEts = from.dpe.BaieEts;

export type OrientationEnum = from.dpe.enums.OrientationEnum;
