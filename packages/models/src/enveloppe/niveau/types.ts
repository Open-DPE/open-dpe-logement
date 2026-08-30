import * as z from "zod";
import { id, description, surface } from "../../common/types.js";
import { InertieEnum, InertieParoiEnum } from "../common/enums.js";

export const NiveauData = z.object({
	inertie: InertieEnum,
});

export type NiveauData = z.infer<typeof NiveauData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/niveau
 */
export const Niveau = z.object({
	id,
	description,
	surface,
	inertie_paroi_verticale: InertieParoiEnum.nullable().default(null),
	inertie_plancher_bas: InertieParoiEnum.nullable().default(null),
	inertie_plancher_haut: InertieParoiEnum.nullable().default(null),
});

export const NiveauWithData = z.intersection(
	Niveau,
	z.object({
		data: NiveauData,
	}),
);

export type Niveau = z.infer<typeof Niveau>;
export type NiveauWithData = z.infer<typeof NiveauWithData>;
