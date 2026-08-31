import * as z from "zod";
import {
	id,
	description,
	nombre_positif,
	non_applicable,
	annee_construction,
	annee_renovation,
} from "../../common/types.js";
import { Mitoyennete, InertieParoi } from "../common/enums.js";
import { Isolation } from "../common/index.js";
import { TypePlancherBas } from "./enums.js";

/**
 * Position du plancher bas — croise le patron paroi (`mitoyennete`) et le
 * patron propre au plancher bas (`surface_ue`/`perimetre_ue`), cf.
 * `/enveloppe/plancher-bas#/$defs/position` (allOf `/enveloppe/paroi#/$defs/position`).
 */
export const PositionBase = z.object({
	surface: nombre_positif,
	mitoyennete: Mitoyennete,
	local_non_chauffe_id: id.nullable().default(null),
	surface_ue: nombre_positif.nullable().default(null),
	perimetre_ue: nombre_positif.nullable().default(null),
});

export const PositionMitoyenneteLocalNonChauffe = PositionBase.extend({
	mitoyennete: Mitoyennete.extract(["local_non_chauffe"]),
	local_non_chauffe_id: id,
});

export const PositionMitoyenneteAutres = PositionBase.extend({
	mitoyennete: Mitoyennete.exclude(["local_non_chauffe"]),
	local_non_chauffe_id: non_applicable,
});

export const PositionTerrePlein = PositionBase.extend({
	mitoyennete: Mitoyennete.extract([
		"enterre",
		"vide_sanitaire",
		"terre_plein",
		"sous_sol_non_chauffe",
	]),
	surface_ue: nombre_positif,
	perimetre_ue: nombre_positif,
});

export const PositionAutres = PositionBase.extend({
	mitoyennete: Mitoyennete.extract([
		"exterieur",
		"local_non_chauffe",
		"local_non_residentiel",
		"local_residentiel",
		"local_non_accessible",
	]),
	surface_ue: non_applicable,
	perimetre_ue: non_applicable,
});

export const PositionMitoyennete = z.union([
	PositionMitoyenneteLocalNonChauffe,
	PositionMitoyenneteAutres,
]);

export const PositionUe = z.union([PositionTerrePlein, PositionAutres]);

export const Position = z.intersection(PositionMitoyennete, PositionUe);

export type Position = z.infer<typeof Position>;
export type PositionBase = z.infer<typeof PositionBase>;
export type PositionMitoyenneteLocalNonChauffe = z.infer<
	typeof PositionMitoyenneteLocalNonChauffe
>;
export type PositionMitoyenneteAutres = z.infer<
	typeof PositionMitoyenneteAutres
>;
export type PositionTerrePlein = z.infer<typeof PositionTerrePlein>;
export type PositionAutres = z.infer<typeof PositionAutres>;

export const PlancherBasData = z.object({
	sdep: z.number(),
	b: z.number(),
	dp: z.number(),
	u: z.number(),
	u0: z.number(),
});

export type PlancherBasData = z.infer<typeof PlancherBasData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/plancher-bas
 */
export const PlancherBas = z.object({
	id,
	description,
	type: TypePlancherBas.nullable().default(null),
	inertie: InertieParoi.nullable().default(null),
	annee_construction,
	annee_renovation,
	u0: nombre_positif.nullable().default(null),
	u: nombre_positif.nullable().default(null),
	position: Position,
	isolation: Isolation,
});

export const PlancherBasWithData = z.intersection(
	PlancherBas,
	z.object({
		data: PlancherBasData,
	}),
);

export type PlancherBas = z.infer<typeof PlancherBas>;
export type PlancherBasWithData = z.infer<typeof PlancherBasWithData>;
