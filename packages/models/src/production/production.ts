import { buildEnum } from "#/utils.js";
import * as panneauPhotovoltaique from "./panneau-photovoltaique.js";

export { panneauPhotovoltaique };

/**
 * @see https://schemas.open-dpe.fr/production
 */
export type Production = {
	panneaux_photovoltaiques: panneauPhotovoltaique.PanneauPhotovoltaique[];
};

export type ProductionWithData<T extends Production = Production> = T & {
	data: ProductionData;
};

export type ProductionData = {
	ppv: number;
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
