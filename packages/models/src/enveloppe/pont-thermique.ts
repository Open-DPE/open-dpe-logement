import type { UUID } from "#/common/common";
import { buildEnum, createGuard } from "../utils";

export const isPontThermique = createGuard<PontThermique>(
	"/enveloppe/pont-thermique",
);

/**
 * @see https://schemas.open-dpe.fr/enveloppe/pont-thermique
 */
export type PontThermique = {
	id: UUID;
	description: string;
	longueur: number;
	kpt: number | null;
	liaison: Liaison;
};

export type PontThermiqueWithData<T extends PontThermique = PontThermique> =
	T & {
		data: PontThermiqueData;
	};

export type PontThermiqueData = {
	kpt: number;
	pt: number;
};

export type Liaison =
	| RefendMur
	| PlancherBasMur
	| PlancherHautMur
	| PlancherIntermediaireMur
	| PorteMur
	| BaieMur;

type LiaisonBase = {
	type: TypeLiaison;
	mur_id: UUID;
	plancher_id: UUID | null;
	ouverture_id: UUID | null;
	pont_thermique_partiel: boolean | null;
};

type LiaisonG<T = Partial<LiaisonBase>> = LiaisonBase & T;

export type RefendMur = LiaisonG<{
	type: typeof TypeLiaisonEnum.refend_mur;
	plancher_id: null;
	ouverture_id: null;
	pont_thermique_partiel: boolean;
}>;

export type PlancherBasMur = LiaisonG<{
	type: typeof TypeLiaisonEnum.plancher_bas_mur;
	plancher_id: string;
	ouverture_id: null;
	pont_thermique_partiel: false;
}>;

export type PlancherHautMur = LiaisonG<{
	type: typeof TypeLiaisonEnum.plancher_haut_mur;
	plancher_id: string;
	ouverture_id: null;
	pont_thermique_partiel: false;
}>;

export type PlancherIntermediaireMur = LiaisonG<{
	type: typeof TypeLiaisonEnum.plancher_intermediaire_mur;
	plancher_id: null;
	ouverture_id: null;
	pont_thermique_partiel: boolean;
}>;

export type PorteMur = LiaisonG<{
	type: typeof TypeLiaisonEnum.porte_mur;
	plancher_id: null;
	ouverture_id: string;
	pont_thermique_partiel: false;
}>;

export type BaieMur = LiaisonG<{
	type: typeof TypeLiaisonEnum.baie_mur;
	plancher_id: null;
	ouverture_id: string;
	pont_thermique_partiel: false;
}>;

export const TYPES_LIAISON = [
	"plancher_bas_mur",
	"plancher_intermediaire_mur",
	"plancher_haut_mur",
	"refend_mur",
	"porte_mur",
	"baie_mur",
] as const;
export type TypeLiaison = (typeof TYPES_LIAISON)[number];
export const TypeLiaisonEnum = buildEnum(TYPES_LIAISON);
