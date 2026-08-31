import * as z from "zod";

export const TypeEmetteur = z.enum({
	plancher_chauffant: "plancher_chauffant",
	plafond_chauffant: "plafond_chauffant",
	radiateur_monotube: "radiateur_monotube",
	radiateur_bitube: "radiateur_bitube",
	radiateur: "radiateur",
	autres: "autres",
});

export type TypeEmetteur = z.infer<typeof TypeEmetteur>;

export const TemperatureDistribution = z.enum({
	basse: "basse",
	moyenne: "moyenne",
	haute: "haute",
});

export type TemperatureDistribution = z.infer<typeof TemperatureDistribution>;
