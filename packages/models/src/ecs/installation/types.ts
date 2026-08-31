import * as z from "zod";

import { UsageSolaire } from "./enums.js";

import { Systeme, SystemeWithData } from "../systeme/types.js";

import {
	id,
	description,
	surface,
	annee_installation,
} from "../../common/types.js";

/**
 * @see https://schemas.open-dpe.fr/ecs/installation#/$defs/solaire_thermique
 * `fecs` porte un `maximum: 1` en plus de son `oneOf[nombre, const null]`.
 */
export const SolaireThermique = z.object({
	usage: UsageSolaire,
	annee_installation: annee_installation,
	fecs: z.number().max(1).nullable(),
});

export const Installation = z.object({
	id,
	description,
	surface,
	installation_collective: z.boolean(),
	systemes: z.array(Systeme).min(1).max(2),
	solaire_thermique: SolaireThermique.nullable(),
});

export const InstallationData = z.object({
	becs: z.number(),
	rdim: z.number(),
	fecs: z.number(),
	qdw: z.number(),
	qdw_ind_vc: z.number(),
	qdw_col_vc: z.number(),
	qdw_col_hvc: z.number(),
});

export const InstallationWithData = Installation.extend({
	data: InstallationData,
	systemes: z.array(SystemeWithData).min(1).max(2),
});

export type Installation = z.infer<typeof Installation>;
export type InstallationData = z.infer<typeof InstallationData>;
export type InstallationWithData = z.infer<typeof InstallationWithData>;
export type SolaireThermique = z.infer<typeof SolaireThermique>;
