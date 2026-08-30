import * as z from "zod";

export const TYPES_EMETTEUR = {
	plancher_chauffant: "plancher_chauffant",
	plafond_chauffant: "plafond_chauffant",
	radiateur_monotube: "radiateur_monotube",
	radiateur_bitube: "radiateur_bitube",
	radiateur: "radiateur",
	autres: "autres",
} as const;

export const TypeEmetteurEnum = z.enum(TYPES_EMETTEUR);
export type TypeEmetteurEnum = z.infer<typeof TypeEmetteurEnum>;

export const TEMPERATURES_DISTRIBUTION = {
	basse: "basse",
	moyenne: "moyenne",
	haute: "haute",
} as const;

export const TemperatureDistributionEnum = z.enum(TEMPERATURES_DISTRIBUTION);
export type TemperatureDistributionEnum = z.infer<
	typeof TemperatureDistributionEnum
>;
