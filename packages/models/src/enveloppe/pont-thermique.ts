import type { UUID } from "../common/common.js";
import { buildEnum } from "../utils.js";

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

export function isLiaison(value: LiaisonBase): value is Liaison {
	return (
		isRefendMur(value) ||
		isPlancherBasMur(value) ||
		isPlancherHautMur(value) ||
		isPlancherIntermediaireMur(value) ||
		isPorteMur(value) ||
		isBaieMur(value)
	);
}

export type LiaisonBase = {
	type: TypeLiaison;
	mur_id: UUID;
	plancher_id: UUID | null;
	ouverture_id: UUID | null;
	pont_thermique_partiel: boolean | null;
};

type _Liaison<T = Partial<LiaisonBase>> = LiaisonBase & T;

export type RefendMur = _Liaison<{
	type: typeof TypeLiaisonEnum.refend_mur;
	plancher_id: null;
	ouverture_id: null;
	pont_thermique_partiel: boolean;
}>;

export function isRefendMur(value: LiaisonBase): value is RefendMur {
	return value.type === TypeLiaisonEnum.refend_mur;
}

export type PlancherBasMur = _Liaison<{
	type: typeof TypeLiaisonEnum.plancher_bas_mur;
	plancher_id: string;
	ouverture_id: null;
	pont_thermique_partiel: false;
}>;

export function isPlancherBasMur(value: LiaisonBase): value is PlancherBasMur {
	return value.type === TypeLiaisonEnum.plancher_bas_mur;
}

export type PlancherHautMur = _Liaison<{
	type: typeof TypeLiaisonEnum.plancher_haut_mur;
	plancher_id: string;
	ouverture_id: null;
	pont_thermique_partiel: false;
}>;

export function isPlancherHautMur(
	value: LiaisonBase,
): value is PlancherHautMur {
	return value.type === TypeLiaisonEnum.plancher_haut_mur;
}

export type PlancherIntermediaireMur = _Liaison<{
	type: typeof TypeLiaisonEnum.plancher_intermediaire_mur;
	plancher_id: null;
	ouverture_id: null;
	pont_thermique_partiel: boolean;
}>;

export function isPlancherIntermediaireMur(
	value: LiaisonBase,
): value is PlancherIntermediaireMur {
	return value.type === TypeLiaisonEnum.plancher_intermediaire_mur;
}

export type PorteMur = _Liaison<{
	type: typeof TypeLiaisonEnum.porte_mur;
	plancher_id: null;
	ouverture_id: string;
	pont_thermique_partiel: false;
}>;

export function isPorteMur(value: LiaisonBase): value is PorteMur {
	return value.type === TypeLiaisonEnum.porte_mur;
}

export type BaieMur = _Liaison<{
	type: typeof TypeLiaisonEnum.baie_mur;
	plancher_id: null;
	ouverture_id: string;
	pont_thermique_partiel: false;
}>;

export function isBaieMur(value: LiaisonBase): value is BaieMur {
	return value.type === TypeLiaisonEnum.baie_mur;
}

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
