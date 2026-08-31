import * as z from "zod";

export const UsageSolaire = z.enum({
	ecs: "ecs",
	chauffage_ecs: "chauffage_ecs",
});

export type UsageSolaire = z.infer<typeof UsageSolaire>;
