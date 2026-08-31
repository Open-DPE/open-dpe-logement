import * as z from "zod";

export const UsageElectricite = z.enum({
	chauffage: "chauffage",
	refroidissement: "refroidissement",
	ecs: "ecs",
	eclairage: "eclairage",
	auxiliaires_ventilation: "auxiliaires_ventilation",
	auxiliaires_distribution: "auxiliaires_distribution",
	autres: "autres",
});

export type UsageElectricite = z.infer<typeof UsageElectricite>;
