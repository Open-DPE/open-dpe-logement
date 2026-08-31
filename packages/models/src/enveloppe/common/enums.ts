import * as z from "zod";
import { OrientationCardinale } from "../../common/enums.js";

export const Mitoyennete = z.enum({
	exterieur: "exterieur",
	enterre: "enterre",
	vide_sanitaire: "vide_sanitaire",
	terre_plein: "terre_plein",
	sous_sol_non_chauffe: "sous_sol_non_chauffe",
	local_non_chauffe: "local_non_chauffe",
	local_non_residentiel: "local_non_residentiel",
	local_residentiel: "local_residentiel",
	local_non_accessible: "local_non_accessible",
});

export type Mitoyennete = z.infer<typeof Mitoyennete>;

export const TypePose = z.enum({
	nu_exterieur: "nu_exterieur",
	nu_interieur: "nu_interieur",
	tunnel: "tunnel",
});

export type TypePose = z.infer<typeof TypePose>;

export const TypeIsolation = z.enum({
	iti: "iti",
	ite: "ite",
	itr: "itr",
	iti_ite: "iti_ite",
	itr_iti: "itr_iti",
	itr_ite: "itr_ite",
	itr_iti_ite: "itr_iti_ite",
});

export type TypeIsolation = z.infer<typeof TypeIsolation>;

export const InertieParoi = z.enum({
	lourde: "lourde",
	legere: "legere",
});

export type InertieParoi = z.infer<typeof InertieParoi>;

/**
 * Classe d'inertie thermique du bâtiment/niveau (4 classes 3CL-DPE) — champ calculé,
 * pas de liste fermée explicite dans le schéma (x-enum: enveloppe:inertie sans `enum`),
 * valeurs reprises de l'implémentation existante (méthode 3CL-DPE).
 */
export const Inertie = z.enum({
	tres_lourde: "tres_lourde",
	lourde: "lourde",
	moyenne: "moyenne",
	legere: "legere",
});

export type Inertie = z.infer<typeof Inertie>;

export const OrientationHorizontale = "horizontale" as const;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/paroi#/$defs/orientation
 */
export const OrientationParoi = z.union([
	OrientationCardinale,
	z.literal(OrientationHorizontale),
]);

export type OrientationParoi = z.infer<typeof OrientationParoi>;
