import * as z from "zod";
import {
	id,
	description,
	non_applicable,
	Consommations,
} from "../../common/types.js";
import { TypeChauffage } from "../enums.js";
import { TemperatureDistribution } from "../emetteur/enums.js";
import { TypeDistribution } from "./enums.js";

/**
 * @see https://schemas.open-dpe.fr/chauffage/systeme#/$defs/reseau
 */
export const ReseauBase = z.object({
	type_distribution: TypeDistribution,
	temperature_distribution: TemperatureDistribution.nullable(),
	presence_fluide_frigorigene: z.boolean(),
	presence_circulateur_externe: z.boolean(),
	niveaux_desservis: z.number().int().min(1),
	isolation: z.boolean().nullable(),
	emetteurs: z.array(id),
});

export const ReseauHydraulique = ReseauBase.extend({
	type_distribution: TypeDistribution.extract(["hydraulique"]),
	emetteurs: z.array(id).min(1),
});

export const ReseauAeraulique = ReseauBase.extend({
	type_distribution: TypeDistribution.extract(["aeraulique"]),
	temperature_distribution: non_applicable,
	emetteurs: z.array(id).max(0),
});

export const Reseau = z.union([ReseauHydraulique, ReseauAeraulique]);

export type Reseau = z.infer<typeof Reseau>;
export type ReseauBase = z.infer<typeof ReseauBase>;
export type ReseauHydraulique = z.infer<typeof ReseauHydraulique>;
export type ReseauAeraulique = z.infer<typeof ReseauAeraulique>;

export const SystemeData = z.object({
	consommations: Consommations,
	rdim: z.number(),
	pch: z.number(),
	int: z.number(),
	ich: z.number(),
	rd: z.number(),
	re: z.number(),
	rg: z.number(),
	rr: z.number(),
	pcircem: z.number(),
});

export type SystemeData = z.infer<typeof SystemeData>;

/**
 * @see https://schemas.open-dpe.fr/chauffage/systeme
 */
export const SystemeBase = z.object({
	id,
	description,
	type: TypeChauffage,
	generateur_id: id,
	reseau: z.union([Reseau, non_applicable]),
});

export const SystemeCentral = SystemeBase.extend({
	type: TypeChauffage.extract(["central"]),
	reseau: Reseau,
});

export const SystemeDivise = SystemeBase.extend({
	type: TypeChauffage.extract(["divise"]),
	reseau: non_applicable,
});

export const Systeme = z.union([SystemeCentral, SystemeDivise]);

export const SystemeWithData = z.intersection(
	Systeme,
	z.object({
		data: SystemeData,
	}),
);

export type Systeme = z.infer<typeof Systeme>;
export type SystemeBase = z.infer<typeof SystemeBase>;
export type SystemeCentral = z.infer<typeof SystemeCentral>;
export type SystemeDivise = z.infer<typeof SystemeDivise>;
export type SystemeWithData = z.infer<typeof SystemeWithData>;
