import type { UUID } from "../common/common.js";
import { buildEnum } from "../utils.js";
import {
	type InertieParoi,
	type Isolation,
	type Position as _Position,
	MitoyenneteEnum,
} from "./common.js";

/**
 * @see https://schemas.open-dpe.fr/enveloppe/plancher-bas
 */
export type PlancherBas = {
	id: UUID;
	description: string;
	type: TypePlancherBas | null;
	inertie: InertieParoi | null;
	annee_construction: number | null;
	annee_renovation: number | null;
	u0: number | null;
	u: number | null;
	position: Position;
	isolation: Isolation;
};

export type PlancherBasWithData<T extends PlancherBas = PlancherBas> = T & {
	data: PlancherBasData;
};

export type PlancherBasData = {
	u0: number;
	u: number;
	b: number;
	sdep: number;
	dp: number;
};

export type Position = PositionTerrePlein | PositionAutres;

export function isPosition(value: PositionBase): value is Position {
	return isPositionTerrePlein(value) || isPositionAutres(value);
}

export type PositionBase = _Position & {
	surface_ue: number | null;
	perimetre_ue: number | null;
};

export type PositionTerrePlein = PositionBase & {
	mitoyennete:
		| typeof MitoyenneteEnum.enterre
		| typeof MitoyenneteEnum.vide_sanitaire
		| typeof MitoyenneteEnum.terre_plein
		| typeof MitoyenneteEnum.sous_sol_non_chauffe;
	surface_ue: number;
	perimetre_ue: number;
};

export function isPositionTerrePlein(
	value: PositionBase,
): value is PositionTerrePlein {
	return (
		value.mitoyennete === MitoyenneteEnum.enterre ||
		value.mitoyennete === MitoyenneteEnum.vide_sanitaire ||
		value.mitoyennete === MitoyenneteEnum.terre_plein ||
		value.mitoyennete === MitoyenneteEnum.sous_sol_non_chauffe
	);
}

export type PositionAutres = PositionBase & {
	mitoyennete:
		| typeof MitoyenneteEnum.exterieur
		| typeof MitoyenneteEnum.local_non_chauffe
		| typeof MitoyenneteEnum.local_non_residentiel
		| typeof MitoyenneteEnum.local_residentiel
		| typeof MitoyenneteEnum.local_non_accessible;
	surface_ue: null;
	perimetre_ue: null;
};

export function isPositionAutres(value: PositionBase): value is PositionAutres {
	return (
		value.mitoyennete === MitoyenneteEnum.exterieur ||
		value.mitoyennete === MitoyenneteEnum.local_non_chauffe ||
		value.mitoyennete === MitoyenneteEnum.local_non_residentiel ||
		value.mitoyennete === MitoyenneteEnum.local_residentiel ||
		value.mitoyennete === MitoyenneteEnum.local_non_accessible
	);
}

export const TYPES_PLANCHER_BAS = [
	"plancher_avec_ou_sans_remplissage",
	"plancher_entre_solives_metalliques",
	"plancher_entre_solives_bois",
	"plancher_bois_sur_solives_metalliques",
	"bardeaux_et_remplissage",
	"voutains_sur_solives_metalliques",
	"voutains_briques_ou_moellons",
	"dalle_beton",
	"plancher_bois_sur_solives_bois",
	"plancher_lourd_type_entrevous_terre_cuite_ou_poutrelles_beton",
	"plancher_entrevous_isolant",
] as const;
export type TypePlancherBas = (typeof TYPES_PLANCHER_BAS)[number];
export const TypePlancherBasEnum = buildEnum(TYPES_PLANCHER_BAS);
