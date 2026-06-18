import { validate } from "@open-dpe-logement/schemas/enveloppe/plancher-haut";
import type { UUID } from "../common/common.js";
import { buildEnum } from "../utils.js";
import type {
	InertieParoi,
	Isolation,
	Position as PositionBase,
} from "./common.js";

export function isPlancherHaut(data: unknown): data is PlancherHaut {
	return validate(data).isValid;
}

/**
 * @see https://schemas.open-dpe.fr/enveloppe/plancher-haut
 */
export type PlancherHaut = {
	id: UUID;
	description: string;
	configuration: Configuration;
	type: TypePlancherHaut | null;
	inertie: InertieParoi | null;
	annee_construction: number | null;
	annee_renovation: number | null;
	u0: number | null;
	u: number | null;
	position: Position;
	isolation: Isolation;
};

export type PlancherHautWithData<T extends PlancherHaut = PlancherHaut> = T & {
	data: PlancherHautData;
};

export type PlancherHautData = {
	u0: number;
	u: number;
	b: number;
	sdep: number;
	dp: number;
};

export type Position = PositionBase;

export const CONFIGURATIONS = ["plancher", "rampants", "terrasse"] as const;
export type Configuration = (typeof CONFIGURATIONS)[number];
export const ConfigurationEnum = buildEnum(CONFIGURATIONS);

export const TYPES_PLANCHER_HAUT = [
	"plafond_avec_ou_sans_remplissage",
	"plafond_entre_solives_metalliques",
	"plafond_entre_solives_bois",
	"plafond_bois_sur_solives_metalliques",
	"plafond_bois_sous_solives_metalliques",
	"bardeaux_et_remplissage",
	"plafond_bois_sur_solives_bois",
	"plafond_bois_sous_solives_bois",
	"dalle_beton",
	"plafond_lourd",
	"combles_amenages_sous_rampant",
	"toiture_chaume",
	"plafond_patre",
	"bac_acier",
] as const;
export type TypePlancherHaut = (typeof TYPES_PLANCHER_HAUT)[number];
export const TypePlancherHautEnum = buildEnum(TYPES_PLANCHER_HAUT);
