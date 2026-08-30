import * as z from "zod";
import { Emetteur, EmetteurWithData } from "./emetteur/types.js";
import { Generateur, GenerateurWithData } from "./generateur/types.js";
import { Installation, InstallationWithData } from "./installation/types.js";

/**
 * @see https://schemas.open-dpe.fr/chauffage
 */
export const Chauffage = z.object({
	emetteurs: z.array(Emetteur),
	generateurs: z.array(Generateur).min(1),
	installations: z.array(Installation).min(1),
});

export const ChauffageData = z.object({
	bch: z.number(),
	pch: z.number(),
	as: z.number(),
	ai: z.number(),
	qgw_rec: z.number(),
	qdw_rec: z.number(),
	qgen_ecs_rec: z.number(),
	effet_joule: z.boolean(),
});

export const ChauffageWithData = z.intersection(
	Chauffage,
	z.object({
		data: ChauffageData,
		emetteurs: z.array(EmetteurWithData),
		generateurs: z.array(GenerateurWithData).min(1),
		installations: z.array(InstallationWithData).min(1),
	}),
);

export type Chauffage = z.infer<typeof Chauffage>;
export type ChauffageData = z.infer<typeof ChauffageData>;
export type ChauffageWithData = z.infer<typeof ChauffageWithData>;
