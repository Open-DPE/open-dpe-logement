import * as z from "zod";

export const USAGES_ELECTRICITE = {
	chauffage: "chauffage",
	refroidissement: "refroidissement",
	ecs: "ecs",
	eclairage: "eclairage",
	auxiliaires_ventilation: "auxiliaires_ventilation",
	auxiliaires_distribution: "auxiliaires_distribution",
	autres: "autres",
} as const;
export const UsageElectriciteEnum = z.enum(USAGES_ELECTRICITE);
export type UsageElectricite = z.infer<typeof UsageElectriciteEnum>;
