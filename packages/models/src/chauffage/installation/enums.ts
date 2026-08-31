import * as z from "zod";

export const TypeProgrammation = z.enum({
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
});

export type TypeProgrammation = z.infer<typeof TypeProgrammation>;

/**
 * Usages couverts par le solaire thermique de chauffage — distinct de
 * `ecs/installation`'s `UsageSolaire` (valeurs différentes : ici
 * `chauffage`/`chauffage_ecs`, là-bas `ecs`/`chauffage_ecs`).
 */
export const UsageSolaire = z.enum({
	chauffage: "chauffage",
	chauffage_ecs: "chauffage_ecs",
});

export type UsageSolaire = z.infer<typeof UsageSolaire>;
