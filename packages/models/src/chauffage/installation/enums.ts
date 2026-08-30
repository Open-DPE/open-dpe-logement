import * as z from "zod";

export const TYPES_PROGRAMMATION = {
	absent: "absent",
	central_sans_minimum_temperature: "central_sans_minimum_temperature",
	central_avec_minimum_temperature: "central_avec_minimum_temperature",
	central_collectif_sans_detection_presence:
		"central_collectif_sans_detection_presence",
	central_collectif_avec_detection_presence:
		"central_collectif_avec_detection_presence",
	terminal_avec_minimum_temperature: "terminal_avec_minimum_temperature",
	terminal_avec_minimum_temperature_detection_presence:
		"terminal_avec_minimum_temperature_detection_presence",
} as const;

export const TypeProgrammationEnum = z.enum(TYPES_PROGRAMMATION);
export type TypeProgrammationEnum = z.infer<typeof TypeProgrammationEnum>;

/**
 * Usages couverts par le solaire thermique de chauffage — distinct de
 * `ecs/installation`'s `UsageSolaireEnum` (valeurs différentes : ici
 * `chauffage`/`chauffage_ecs`, là-bas `ecs`/`chauffage_ecs`).
 */
export const USAGES_SOLAIRE = {
	chauffage: "chauffage",
	chauffage_ecs: "chauffage_ecs",
} as const;

export const UsageSolaireEnum = z.enum(USAGES_SOLAIRE);
export type UsageSolaireEnum = z.infer<typeof UsageSolaireEnum>;
