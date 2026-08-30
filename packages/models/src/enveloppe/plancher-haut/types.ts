import * as z from "zod";
import {
	id,
	description,
	nombre_positif,
	annee_construction,
	annee_renovation,
} from "../../common/types.js";
import { InertieParoiEnum, Isolation, Position } from "../common/index.js";
import { ConfigurationEnum, TypePlancherHautEnum } from "./enums.js";

export const PlancherHautData = z.object({
	sdep: z.number(),
	b: z.number(),
	dp: z.number(),
	u: z.number(),
	u0: z.number(),
});

export type PlancherHautData = z.infer<typeof PlancherHautData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/plancher-haut
 * Pas de polymorphisme propre au Plancher haut — `position`/`isolation`
 * mutualisés avec mur via `enveloppe/common`.
 */
export const PlancherHaut = z.object({
	id,
	description,
	configuration: ConfigurationEnum,
	type: TypePlancherHautEnum.nullable().default(null),
	inertie: InertieParoiEnum.nullable().default(null),
	annee_construction,
	annee_renovation,
	u0: nombre_positif.nullable().default(null),
	u: nombre_positif.nullable().default(null),
	position: Position,
	isolation: Isolation,
});

export const PlancherHautWithData = z.intersection(
	PlancherHaut,
	z.object({
		data: PlancherHautData,
	}),
);

export type PlancherHaut = z.infer<typeof PlancherHaut>;
export type PlancherHautWithData = z.infer<typeof PlancherHautWithData>;
