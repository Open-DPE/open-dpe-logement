import { buildEnum, createGuard } from "#/utils.js";
import * as panneauPhotovoltaique from "./panneau-photovoltaique.js";

export { panneauPhotovoltaique };

export const isProduction = createGuard<Production>("/production");

/**
 * @see https://schemas.open-dpe.fr/production
 */
export type Production = {
	panneaux_photovoltaiques: panneauPhotovoltaique.PanneauPhotovoltaique[];
};

export type ProductionWithData<T extends Production = Production> = T & {
	data: ProductionData;
	panneaux_photovoltaiques: panneauPhotovoltaique.PanneauPhotovoltaiqueWithData[];
};

export type ProductionData = {
	ppv: number;
	celec_ac: number;
	tapl: number;
};

export const USAGES_ELECTRICITE = [
	"chauffage",
	"refroidissement",
	"ecs",
	"eclairage",
	"auxiliaires_ventilation",
	"auxiliaires_distribution",
	"autres",
] as const;
export type UsageElectricite = (typeof USAGES_ELECTRICITE)[number];
export const UsageElectriciteEnum = buildEnum(USAGES_ELECTRICITE);

export type ParUsageElectricite<T> = {
	[usage in UsageElectricite]: T;
};
