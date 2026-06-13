import type { UUID } from "../common/common.js";
import { buildEnum, createGuard } from "../utils.js";
import {
	type InertieParoi,
	type Isolation,
	type Position as PositionBase,
	MitoyenneteEnum,
} from "./common.js";

export const isPlancherBas = createGuard<PlancherBas>(
	"/enveloppe/plancher-bas",
);

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

export type PositionTerrePlein = PositionBase & {
	mitoyennete:
		| typeof MitoyenneteEnum.enterre
		| typeof MitoyenneteEnum.vide_sanitaire
		| typeof MitoyenneteEnum.terre_plein
		| typeof MitoyenneteEnum.sous_sol_non_chauffe;
	surface_ue: number;
	perimetre_ue: number;
};

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

export function isPositionTerrePlein(
	position: Position,
): position is PositionTerrePlein {
	return (
		position.mitoyennete === MitoyenneteEnum.enterre ||
		position.mitoyennete === MitoyenneteEnum.vide_sanitaire ||
		position.mitoyennete === MitoyenneteEnum.terre_plein ||
		position.mitoyennete === MitoyenneteEnum.sous_sol_non_chauffe
	);
}

export function isPositionAutres(
	position: Position,
): position is PositionAutres {
	return (
		position.mitoyennete === MitoyenneteEnum.exterieur ||
		position.mitoyennete === MitoyenneteEnum.local_non_chauffe ||
		position.mitoyennete === MitoyenneteEnum.local_non_residentiel ||
		position.mitoyennete === MitoyenneteEnum.local_residentiel ||
		position.mitoyennete === MitoyenneteEnum.local_non_accessible
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
