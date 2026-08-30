import * as z from "zod";
import { id, description, nombre_positif, non_applicable } from "../../common/types.js";
import { TYPES_LIAISON, TypeLiaisonEnum } from "./enums.js";

/**
 * @see https://schemas.open-dpe.fr/enveloppe/pont-thermique#/$defs/liaison
 */
export const LiaisonBase = z.object({
	type: TypeLiaisonEnum,
	mur_id: id,
	plancher_id: id.nullable().default(null),
	ouverture_id: id.nullable().default(null),
	pont_thermique_partiel: z.boolean(),
});

export const LiaisonPlancher = LiaisonBase.extend({
	type: TypeLiaisonEnum.extract([
		TYPES_LIAISON.plancher_bas_mur,
		TYPES_LIAISON.plancher_haut_mur,
	]),
	pont_thermique_partiel: z.literal(false),
	plancher_id: id,
	ouverture_id: non_applicable,
});

export const LiaisonMenuiserie = LiaisonBase.extend({
	type: TypeLiaisonEnum.extract([
		TYPES_LIAISON.porte_mur,
		TYPES_LIAISON.baie_mur,
	]),
	pont_thermique_partiel: z.literal(false),
	ouverture_id: id,
	plancher_id: non_applicable,
});

export const LiaisonRefendOuIntermediaire = LiaisonBase.extend({
	type: TypeLiaisonEnum.extract([
		TYPES_LIAISON.plancher_intermediaire_mur,
		TYPES_LIAISON.refend_mur,
	]),
	ouverture_id: non_applicable,
	plancher_id: non_applicable,
});

export const Liaison = z.union([
	LiaisonPlancher,
	LiaisonMenuiserie,
	LiaisonRefendOuIntermediaire,
]);

export type Liaison = z.infer<typeof Liaison>;
export type LiaisonBase = z.infer<typeof LiaisonBase>;
export type LiaisonPlancher = z.infer<typeof LiaisonPlancher>;
export type LiaisonMenuiserie = z.infer<typeof LiaisonMenuiserie>;
export type LiaisonRefendOuIntermediaire = z.infer<
	typeof LiaisonRefendOuIntermediaire
>;

export const PontThermiqueData = z.object({
	pt: z.number(),
	kpt: z.number(),
});

export type PontThermiqueData = z.infer<typeof PontThermiqueData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/pont-thermique
 */
export const PontThermique = z.object({
	id,
	description,
	longueur: nombre_positif,
	kpt: nombre_positif.nullable().default(null),
	liaison: Liaison,
});

export const PontThermiqueWithData = z.intersection(
	PontThermique,
	z.object({
		data: PontThermiqueData,
	}),
);

export type PontThermique = z.infer<typeof PontThermique>;
export type PontThermiqueWithData = z.infer<typeof PontThermiqueWithData>;
