import * as z from "zod";
import { UsageElectricite } from "./enums.js";
import {
	PanneauPhotovoltaique,
	PanneauPhotovoltaiqueWithData,
} from "./panneau-photovoltaique/types.js";

export const Production = z.object({
	panneaux_photovoltaiques: z.array(PanneauPhotovoltaique),
});

export const ProductionData = z.object({
	ppv: z.number(),
	celec_ac: z.number(),
	tapl: z.number(),
});

export const ProductionWithData = Production.extend({
	data: ProductionData,
	panneaux_photovoltaiques: z.array(PanneauPhotovoltaiqueWithData),
});

export type ParUsageElectricite<T> = {
	[usage in UsageElectricite]: T;
};

export type Production = z.infer<typeof Production>;
export type ProductionData = z.infer<typeof ProductionData>;
export type ProductionWithData = z.infer<typeof ProductionWithData>;
