import * as z from "zod";
import {
	id,
	description,
	nombre_positif,
	non_applicable,
	annee_installation,
} from "../../common/types.js";
import { MITOYENNETES, MitoyenneteEnum, TypePoseEnum } from "../common/enums.js";
import { MateriauEnum, TypeVitrageEnum } from "./enums.js";

/**
 * @see https://schemas.open-dpe.fr/enveloppe/porte#/$defs/position
 * (allOf `/enveloppe/paroi#/$defs/position`)
 */
export const PositionBase = z.object({
	surface: nombre_positif,
	mitoyennete: MitoyenneteEnum,
	local_non_chauffe_id: id.nullable().default(null),
	paroi_id: id.nullable().default(null),
	presence_sas: z.boolean(),
	type_pose: TypePoseEnum,
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
 * @see https://schemas.open-dpe.fr/enveloppe/porte#/$defs/menuiserie
 */
export const Menuiserie = z.object({
	largeur_dormant: nombre_positif.nullable().default(null),
	presence_joint: z.boolean().nullable().default(null),
	presence_retour_isolation: z.boolean().nullable().default(null),
});

export type Menuiserie = z.infer<typeof Menuiserie>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/porte#/$defs/vitrage
 * Point de vigilance schéma : la branche « Porte avec vitrage » utilise le mot-clé
 * `minimumExclusive` (inexistant en JSON Schema — le bon mot-clé est
 * `exclusiveMinimum`), donc sans effet réel dans le schéma actuel : `surface` n'y
 * est contrainte qu'à `>= 0`, ce qui la fait chevaucher la branche « sans vitrage »
 * (`surface: 0`) et rend le `oneOf` ambigu pour `{surface: 0, type: null}`. Modélisé
 * ici avec l'intention corrigée (`surface > 0`, via `nombre_positif`) plutôt que le
 * mot-clé sans effet — à corriger côté schéma (`minimumExclusive` → `exclusiveMinimum`).
 */
export const VitrageBase = z.object({
	surface: z.number().min(0),
	type: TypeVitrageEnum.nullable().default(null),
});

export const VitrageSansVitrage = VitrageBase.extend({
	surface: z.literal(0),
	type: non_applicable,
});

export const VitrageAvecVitrage = VitrageBase.extend({
	surface: nombre_positif,
});

export const Vitrage = z.union([VitrageSansVitrage, VitrageAvecVitrage]);

export type Vitrage = z.infer<typeof Vitrage>;
export type VitrageBase = z.infer<typeof VitrageBase>;
export type VitrageSansVitrage = z.infer<typeof VitrageSansVitrage>;
export type VitrageAvecVitrage = z.infer<typeof VitrageAvecVitrage>;

export const PorteData = z.object({
	sdep: z.number(),
	b: z.number(),
	dp: z.number(),
	u: z.number(),
});

export type PorteData = z.infer<typeof PorteData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/porte
 * Pas de polymorphisme propre à la Porte — `position`/`vitrage` portent le
 * polymorphisme.
 */
export const Porte = z.object({
	id,
	description,
	isolation: z.boolean().nullable().default(null),
	materiau: MateriauEnum.nullable().default(null),
	annee_installation,
	u: nombre_positif.nullable().default(null),
	position: Position,
	menuiserie: Menuiserie,
	vitrage: Vitrage,
});

export const PorteWithData = z.intersection(
	Porte,
	z.object({
		data: PorteData,
	}),
);

export type Porte = z.infer<typeof Porte>;
export type PorteWithData = z.infer<typeof PorteWithData>;
