import * as z from "zod";

export const USAGES_SOLAIRE = {
	ecs: "ecs",
	chauffage_ecs: "chauffage_ecs",
} as const;

export const UsageSolaireEnum = z.enum(USAGES_SOLAIRE);

export type UsageSolaireEnum = z.infer<typeof UsageSolaireEnum>;
