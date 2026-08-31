import * as z from "zod";
import { Orientation } from "../../common/enums.js";
import { id, description, inclinaison, surface } from "../../common/types.js";

export const PanneauPhotovoltaique = z.object({
	id,
	description,
	orientation: Orientation,
	inclinaison,
	modules: z.number().int().min(1).max(1000),
	surface: surface.nullable().default(null),
	installation_collective: z.boolean(),
});

export const PanneauPhotovoltaiqueData = z.object({
	kpv: z.number(),
	ppv: z.number(),
});

export const PanneauPhotovoltaiqueWithData = z.intersection(
	PanneauPhotovoltaique,
	z.object({
		data: PanneauPhotovoltaiqueData,
	}),
);

export type PanneauPhotovoltaique = z.infer<typeof PanneauPhotovoltaique>;
export type PanneauPhotovoltaiqueWithData = z.infer<
	typeof PanneauPhotovoltaiqueWithData
>;
export type PanneauPhotovoltaiqueData = z.infer<
	typeof PanneauPhotovoltaiqueData
>;
