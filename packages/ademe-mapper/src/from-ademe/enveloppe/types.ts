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
	| from.dpe.v26.BaieVitree
	| from.audit.BaieVitree;

export type BaieVitreeDoubleFenetre =
	| from.dpe.v22.BaieVitreeDoubleFenetre
	| from.dpe.v23.BaieVitreeDoubleFenetre
	| from.dpe.v24.BaieVitreeDoubleFenetre
	| from.dpe.v25.BaieVitreeDoubleFenetre
	| from.dpe.v26.BaieVitreeDoubleFenetre
	| from.audit.BaieVitreeDoubleFenetre;

export type Mur =
	| from.dpe.v22.Mur
	| from.dpe.v23.Mur
	| from.dpe.v24.Mur
	| from.dpe.v25.Mur
	| from.dpe.v26.Mur
	| from.audit.Mur;

export type PlancherBas =
	| from.dpe.v22.PlancherBas
	| from.dpe.v23.PlancherBas
	| from.dpe.v24.PlancherBas
	| from.dpe.v25.PlancherBas
	| from.dpe.v26.PlancherBas
	| from.audit.PlancherBas;

export type PlancherHaut =
	| from.dpe.v22.PlancherHaut
	| from.dpe.v23.PlancherHaut
	| from.dpe.v24.PlancherHaut
	| from.dpe.v25.PlancherHaut
	| from.dpe.v26.PlancherHaut
	| from.audit.PlancherHaut;

export type Porte =
	| from.dpe.v22.Porte
	| from.dpe.v23.Porte
	| from.dpe.v24.Porte
	| from.dpe.v25.Porte
	| from.dpe.v26.Porte
	| from.audit.Porte;

export type PontThermique =
	| from.dpe.v22.PontThermique
	| from.dpe.v23.PontThermique
	| from.dpe.v24.PontThermique
	| from.dpe.v25.PontThermique
	| from.dpe.v26.PontThermique
	| from.audit.PontThermique;

export type MasqueLointainNonHomogene = from.dpe.MasqueLointainNonHomogene;

export type Ets =
	| from.dpe.v22.Ets
	| from.dpe.v23.Ets
	| from.dpe.v24.Ets
	| from.dpe.v25.Ets
	| from.dpe.v26.Ets
	| from.audit.Ets;

export type BaieEts =
	| from.dpe.v22.BaieEts
	| from.dpe.v23.BaieEts
	| from.dpe.v24.BaieEts
	| from.dpe.v25.BaieEts
	| from.dpe.v26.BaieEts
	| from.audit.BaieEts;

export type Orientation = from.dpe.enums.OrientationEnum;
