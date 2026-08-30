import * as z from "zod";
import { id, non_applicable, surface, nombre_positif, annee_installation } from "../../common/types.js";
import { MITOYENNETES, MitoyenneteEnum, TypeIsolationEnum } from "./enums.js";

/**
 * Position d'une paroi (mur, plancher bas/haut...) — patron B (discriminant interne `mitoyennete`).
 * @see https://schemas.open-dpe.fr/enveloppe/paroi#/$defs/position
 */
export const PositionBase = z.object({
	surface,
	mitoyennete: MitoyenneteEnum,
	local_non_chauffe_id: id.nullable().default(null),
});

export const PositionLocalNonChauffe = PositionBase.extend({
	mitoyennete: MitoyenneteEnum.extract([MITOYENNETES.local_non_chauffe]),
	local_non_chauffe_id: id,
});

export const PositionAutres = PositionBase.extend({
	mitoyennete: MitoyenneteEnum.exclude([MITOYENNETES.local_non_chauffe]),
	local_non_chauffe_id: non_applicable,
});

export const Position = z.union([PositionLocalNonChauffe, PositionAutres]);

export type Position = z.infer<typeof Position>;
export type PositionBase = z.infer<typeof PositionBase>;
export type PositionLocalNonChauffe = z.infer<typeof PositionLocalNonChauffe>;
export type PositionAutres = z.infer<typeof PositionAutres>;

/**
 * État d'isolation d'une paroi — patron B (discriminant interne `etat`/`type`).
 * @see https://schemas.open-dpe.fr/enveloppe/paroi#/$defs/isolation
 */
export const IsolationBase = z.object({
	etat: z.boolean().nullable().default(null),
	type: TypeIsolationEnum.nullable().default(null),
	annee_installation,
	epaisseur: nombre_positif.nullable().default(null),
	resistance_thermique: nombre_positif.nullable().default(null),
});

export const SansIsolation = IsolationBase.extend({
	etat: z.literal(false),
	type: non_applicable,
	annee_installation: non_applicable,
	epaisseur: non_applicable,
	resistance_thermique: non_applicable,
});

export const IsolationInconnue = IsolationBase.extend({
	etat: z.null().default(null),
	type: non_applicable,
	annee_installation: non_applicable,
	epaisseur: non_applicable,
	resistance_thermique: non_applicable,
});

export const TypeIsolationInconnue = IsolationBase.extend({
	etat: z.literal(true),
	type: non_applicable,
	annee_installation: non_applicable,
	epaisseur: non_applicable,
	resistance_thermique: non_applicable,
});

export const IsolationConnue = IsolationBase.extend({
	etat: z.literal(true),
	type: TypeIsolationEnum,
});

export const Isolation = z.union([
	SansIsolation,
	IsolationInconnue,
	TypeIsolationInconnue,
	IsolationConnue,
]);

export type Isolation = z.infer<typeof Isolation>;
export type IsolationBase = z.infer<typeof IsolationBase>;
export type SansIsolation = z.infer<typeof SansIsolation>;
export type IsolationInconnue = z.infer<typeof IsolationInconnue>;
export type TypeIsolationInconnue = z.infer<typeof TypeIsolationInconnue>;
export type IsolationConnue = z.infer<typeof IsolationConnue>;
