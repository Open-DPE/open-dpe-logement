import * as z from "zod";
import { Generateur, GenerateurWithData } from "./generateur/types.js";
import { Installation, InstallationWithData } from "./installation/types.js";

/**
 * @see https://schemas.open-dpe.fr/ecs
 */
export const Ecs = z.object({
	generateurs: z.array(Generateur).min(1),
	installations: z.array(Installation).min(1),
});

export const EcsData = z.object({
	qgw: z.number(),
	qgen: z.number(),
	qdw_ind_vc: z.number(),
	qdw_col_vc: z.number(),
	qdw_col_hvc: z.number(),
	becs: z.number(),
	nadeq: z.number(),
	nmax: z.number(),
});

export const EcsWithData = z.intersection(
	Ecs,
	z.object({
		data: EcsData,
		generateurs: z.array(GenerateurWithData).min(1),
		installations: z.array(InstallationWithData).min(1),
	}),
);

export type Ecs = z.infer<typeof Ecs>;
export type EcsData = z.infer<typeof EcsData>;
export type EcsWithData = z.infer<typeof EcsWithData>;
