import * as z from "zod";
import { id, description, annee_installation } from "../../common/types.js";
import { TypeEmetteur, TemperatureDistribution } from "./enums.js";

export const EmetteurData = z.object({
	delta_pem: z.number(),
	fcot: z.number(),
	dtheta_dim: z.number(),
});

export type EmetteurData = z.infer<typeof EmetteurData>;

/**
 * @see https://schemas.open-dpe.fr/chauffage/emetteur
 * Pas de polymorphisme — objet plat.
 */
export const Emetteur = z.object({
	id,
	description,
	type: TypeEmetteur,
	temperature_distribution: TemperatureDistribution.nullable(),
	presence_robinet_thermostatique: z.boolean(),
	annee_installation,
});

export const EmetteurWithData = z.intersection(
	Emetteur,
	z.object({
		data: EmetteurData,
	}),
);

export type Emetteur = z.infer<typeof Emetteur>;
export type EmetteurWithData = z.infer<typeof EmetteurWithData>;
