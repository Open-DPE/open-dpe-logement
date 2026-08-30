import * as z from "zod";
import {
	ORIENTATIONS_CARDINALES,
	OrientationCardinaleEnum,
} from "../../common/enums.js";

export const MITOYENNETES = {
	exterieur: "exterieur",
	enterre: "enterre",
	vide_sanitaire: "vide_sanitaire",
	terre_plein: "terre_plein",
	sous_sol_non_chauffe: "sous_sol_non_chauffe",
	local_non_chauffe: "local_non_chauffe",
	local_non_residentiel: "local_non_residentiel",
	local_residentiel: "local_residentiel",
	local_non_accessible: "local_non_accessible",
} as const;
export const MitoyenneteEnum = z.enum(MITOYENNETES);
export type MitoyenneteEnum = z.infer<typeof MitoyenneteEnum>;

export const TYPES_POSE = {
	nu_exterieur: "nu_exterieur",
	nu_interieur: "nu_interieur",
	tunnel: "tunnel",
} as const;
export const TypePoseEnum = z.enum(TYPES_POSE);
export type TypePoseEnum = z.infer<typeof TypePoseEnum>;

export const TYPES_ISOLATION = {
	iti: "iti",
	ite: "ite",
	itr: "itr",
	iti_ite: "iti_ite",
	itr_iti: "itr_iti",
	itr_ite: "itr_ite",
	itr_iti_ite: "itr_iti_ite",
} as const;
export const TypeIsolationEnum = z.enum(TYPES_ISOLATION);
export type TypeIsolationEnum = z.infer<typeof TypeIsolationEnum>;

export const INERTIES_PAROI = {
	lourde: "lourde",
	legere: "legere",
} as const;
export const InertieParoiEnum = z.enum(INERTIES_PAROI);
export type InertieParoiEnum = z.infer<typeof InertieParoiEnum>;

/**
 * Classe d'inertie thermique du bâtiment/niveau (4 classes 3CL-DPE) — champ calculé,
 * pas de liste fermée explicite dans le schéma (x-enum: enveloppe:inertie sans `enum`),
 * valeurs reprises de l'implémentation existante (méthode 3CL-DPE).
 */
export const INERTIES = {
	tres_lourde: "tres_lourde",
	lourde: "lourde",
	moyenne: "moyenne",
	legere: "legere",
} as const;
export const InertieEnum = z.enum(INERTIES);
export type InertieEnum = z.infer<typeof InertieEnum>;

export const OrientationHorizontale = "horizontale" as const;
/**
 * @see https://schemas.open-dpe.fr/enveloppe/paroi#/$defs/orientation
 */
export const OrientationParoiEnum = z.union([
	OrientationCardinaleEnum,
	z.literal(OrientationHorizontale),
]);
export type OrientationParoiEnum = z.infer<typeof OrientationParoiEnum>;
