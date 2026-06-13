import type { UUID, OrientationCardinale } from "../common/common.js";
import { buildEnum } from "../utils.js";

/**
 * @see https://schemas.open-dpe.fr/enveloppe/common/primitives../$defs/inertie
 */
export const INERTIES = ["tres_lourde", "lourde", "moyenne", "legere"] as const;
export type Inertie = (typeof INERTIES)[number];
export const InertieEnum = buildEnum(INERTIES);

/**
 * @see https://schemas.open-dpe.fr/enveloppe/common/primitives../$defs/inertie_paroi
 */
export const INERTIES_PAROI = ["lourde", "legere"] as const;
export type InertieParoi = (typeof INERTIES_PAROI)[number];
export const InertieParoiEnum = buildEnum(INERTIES_PAROI);

/**
 * @see https://schemas.open-dpe.fr/enveloppe/common/primitives../$defs/mitoyennete
 */
export const MITOYENNETES = [
	"exterieur",
	"enterre",
	"vide_sanitaire",
	"terre_plein",
	"sous_sol_non_chauffe",
	"local_non_chauffe",
	"local_non_residentiel",
	"local_residentiel",
	"local_non_accessible",
] as const;
export type Mitoyennete = (typeof MITOYENNETES)[number];
export const MitoyenneteEnum = buildEnum(MITOYENNETES);

/**
 * @see https://schemas.open-dpe.fr/enveloppe/common/primitives../$defs/orientation
 */
export type Orientation = OrientationCardinale | typeof OrientationHorizontale;
export const OrientationHorizontale = "horizontale" as const;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/common/primitives../$defs/type_pose
 */
export const TYPES_POSE = ["nu_exterieur", "nu_interieur", "tunnel"] as const;
export type TypePose = (typeof TYPES_POSE)[number];
export const TypePoseEnum = buildEnum(TYPES_POSE);

/**
 * @see https://schemas.open-dpe.fr/enveloppe/common/primitives../$defs/type_isolation
 */
export const TYPES_ISOLATION = [
	"iti",
	"ite",
	"itr",
	"iti_ite",
	"itr_iti",
	"itr_ite",
	"itr_iti_ite",
] as const;
export type TypeIsolation = (typeof TYPES_ISOLATION)[number];
export const TypeIsolationEnum = buildEnum(TYPES_ISOLATION);

/**
 * @see https://schemas.open-dpe.fr/enveloppe/common/components../$defs/position
 */
export type Position = PositionParoiLocalNonChauffe | PositionParoiAutres;

export type PositionBase = {
	surface: number;
	mitoyennete: Mitoyennete;
	local_non_chauffe_id: UUID | null;
};

export type PositionParoiLocalNonChauffe = PositionBase & {
	mitoyennete: typeof MitoyenneteEnum.local_non_chauffe;
	local_non_chauffe_id: UUID;
};

export type PositionParoiAutres = PositionBase & {
	mitoyennete: Exclude<Mitoyennete, typeof MitoyenneteEnum.local_non_chauffe>;
	local_non_chauffe_id: null;
};

export function isPositionParoiLocalNonChauffe(
	position: Position,
): position is PositionParoiLocalNonChauffe {
	return position.mitoyennete === MitoyenneteEnum.local_non_chauffe;
}

export function isPositionParoiAutres(
	position: Position,
): position is PositionParoiAutres {
	return position.mitoyennete !== MitoyenneteEnum.local_non_chauffe;
}

/**
 * @see https://schemas.open-dpe.fr/enveloppe/common/components../$defs/position
 */
export type Isolation =
	| SansIsolation
	| IsolationInconnue
	| TypeIsolationInconnue
	| IsolationConnue;

export type SansIsolation = {
	etat: false;
	type: null;
	annee_installation: null;
	epaisseur: null;
	resistance_thermique: null;
};

export type IsolationInconnue = {
	etat: null;
	type: null;
	annee_installation: null;
	epaisseur: null;
	resistance_thermique: null;
};

export type TypeIsolationInconnue = {
	etat: true;
	type: null;
	annee_installation: null;
	epaisseur: null;
	resistance_thermique: null;
};

export type IsolationConnue = {
	etat: true;
	type: TypeIsolation;
	annee_installation: number | null;
	epaisseur: number | null;
	resistance_thermique: number | null;
};

export function isSansIsolation(
	isolation: Isolation,
): isolation is SansIsolation {
	return isolation.etat === false;
}

export function isIsolationInconnue(
	isolation: Isolation,
): isolation is IsolationInconnue {
	return isolation.etat === null;
}

export function isTypeIsolationInconnue(
	isolation: Isolation,
): isolation is TypeIsolationInconnue {
	return isolation.etat === true && isolation.type === null;
}

export function isIsolationConnue(
	isolation: Isolation,
): isolation is IsolationConnue {
	return isolation.etat === true && isolation.type !== null;
}
