import * as z from "zod";
import { id, description, surface } from "../../common/types.js";
import { Inertie, InertieParoi } from "../common/enums.js";

export const NiveauData = z.object({
	inertie: Inertie,
});

export type NiveauData = z.infer<typeof NiveauData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/niveau
 */
export const Niveau = z.object({
	id,
	description,
	surface,
	inertie_paroi_verticale: InertieParoi.nullable().default(null),
	inertie_plancher_bas: InertieParoi.nullable().default(null),
	inertie_plancher_haut: InertieParoi.nullable().default(null),
});

export const NiveauWithData = z.intersection(
	Niveau,
	z.object({
		data: NiveauData,
	}),
);

export type Niveau = z.infer<typeof Niveau>;
export type NiveauWithData = z.infer<typeof NiveauWithData>;
