import * as z from "zod";
import { id, description, non_applicable, surface, inclinaison } from "../../../common/types.js";
import { MitoyenneteEnum } from "../../common/enums.js";
import { TYPES_VITRAGE, TypeVitrageEnum, MateriauEnum } from "../../baie/enums.js";

/**
 * @see https://schemas.open-dpe.fr/enveloppe/local-non-chauffe/baie#/$defs/position
 */
export const PositionBase = z.object({
	surface,
	mitoyennete: MitoyenneteEnum,
	orientation: z.union([z.enum(["nord", "est", "sud", "ouest"]), z.literal("horizontale")]),
	inclinaison,
});

export const PositionVerticale = PositionBase.extend({
	inclinaison: inclinaison.min(1),
	orientation: z.enum(["nord", "est", "sud", "ouest"]),
});

export const PositionHorizontale = PositionBase.extend({
	inclinaison: z.literal(0),
	orientation: z.literal("horizontale"),
});

export const Position = z.union([PositionVerticale, PositionHorizontale]);

export type Position = z.infer<typeof Position>;
export type PositionBase = z.infer<typeof PositionBase>;
export type PositionVerticale = z.infer<typeof PositionVerticale>;
export type PositionHorizontale = z.infer<typeof PositionHorizontale>;

export const BaieData = z.object({
	aue: z.number(),
	aiu: z.number(),
	sst: z.number(),
	t: z.number(),
});

export type BaieData = z.infer<typeof BaieData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/local-non-chauffe/baie
 * Point de vigilance schéma : `presence_rupteur_pont_thermique` n'est pas dans le
 * `required` du schéma (contrairement à la doctrine « toute propriété toujours
 * présente ») — modélisé ici comme toujours présent et nullable, par cohérence
 * avec le reste du domaine.
 */
export const BaieBase = z.object({
	id,
	description,
	type_vitrage: TypeVitrageEnum.nullable().default(null),
	materiau_menuiserie: MateriauEnum.nullable().default(null),
	presence_rupteur_pont_thermique: z.boolean().nullable().default(null),
	position: Position,
});

export const BaieVitree = BaieBase.extend({
	type_vitrage: TypeVitrageEnum.extract([
		TYPES_VITRAGE.brique_verre,
		TYPES_VITRAGE.polycarbonate,
	]),
	materiau_menuiserie: non_applicable,
});

export const BaieAutre = BaieBase.extend({
	type_vitrage: TypeVitrageEnum.extract([
		TYPES_VITRAGE.simple_vitrage,
		TYPES_VITRAGE.double_vitrage,
		TYPES_VITRAGE.double_vitrage_fe,
		TYPES_VITRAGE.triple_vitrage,
		TYPES_VITRAGE.triple_vitrage_fe,
	]).nullable(),
});

export const Baie = z.union([BaieVitree, BaieAutre]);

export const BaieWithData = z.intersection(
	Baie,
	z.object({
		data: BaieData,
	}),
);

export type Baie = z.infer<typeof Baie>;
export type BaieBase = z.infer<typeof BaieBase>;
export type BaieVitree = z.infer<typeof BaieVitree>;
export type BaieAutre = z.infer<typeof BaieAutre>;
export type BaieWithData = z.infer<typeof BaieWithData>;
