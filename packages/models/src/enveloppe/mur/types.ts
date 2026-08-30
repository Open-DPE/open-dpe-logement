import * as z from "zod";
import {
	id,
	description,
	nombre_positif,
	annee_construction,
	annee_renovation,
} from "../../common/types.js";
import { InertieParoiEnum, Isolation, Position } from "../common/index.js";
import { MateriauMurEnum, TypeDoublageEnum } from "./enums.js";

/**
 * @see https://schemas.open-dpe.fr/enveloppe/mur#/$defs/structure
 */
export const Structure = z.object({
	materiau: MateriauMurEnum.nullable().default(null),
	epaisseur: nombre_positif.nullable().default(null),
	materiau_ancien: z.boolean().nullable().default(null),
});

export type Structure = z.infer<typeof Structure>;

export const MurData = z.object({
	sdep: z.number(),
	b: z.number(),
	dp: z.number(),
	u: z.number(),
	u0: z.number(),
	paroi_ancienne: z.boolean(),
});

export type MurData = z.infer<typeof MurData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/mur
 * Pas de polymorphisme propre au Mur — `position`/`isolation` portent le
 * polymorphisme, mutualisé avec plancher-haut via `enveloppe/common`.
 */
export const Mur = z.object({
	id,
	description,
	structures: z.array(Structure),
	type_doublage: TypeDoublageEnum.nullable().default(null),
	presence_enduit_isolant: z.boolean().nullable().default(null),
	inertie: InertieParoiEnum.nullable().default(null),
	annee_construction,
	annee_renovation,
	u0: nombre_positif.nullable().default(null),
	u: nombre_positif.nullable().default(null),
	position: Position,
	isolation: Isolation,
});

export const MurWithData = z.intersection(
	Mur,
	z.object({
		data: MurData,
	}),
);

export type Mur = z.infer<typeof Mur>;
export type MurWithData = z.infer<typeof MurWithData>;
