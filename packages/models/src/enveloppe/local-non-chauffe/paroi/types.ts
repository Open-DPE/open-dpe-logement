import * as z from "zod";
import { id, description, surface } from "../../../common/types.js";
import { Mitoyennete } from "../../common/enums.js";

/**
 * @see https://schemas.open-dpe.fr/enveloppe/local-non-chauffe/paroi#/$defs/position
 */
export const Position = z.object({
	mitoyennete: Mitoyennete,
	surface,
});

export type Position = z.infer<typeof Position>;

export const ParoiData = z.object({
	aue: z.number(),
	aiu: z.number(),
});

export type ParoiData = z.infer<typeof ParoiData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/local-non-chauffe/paroi
 * Pas de polymorphisme — objet plat.
 */
export const Paroi = z.object({
	id,
	description,
	isolation: z.boolean().nullable().default(null),
	position: Position,
});

export const ParoiWithData = z.intersection(
	Paroi,
	z.object({
		data: ParoiData,
	}),
);

export type Paroi = z.infer<typeof Paroi>;
export type ParoiWithData = z.infer<typeof ParoiWithData>;
