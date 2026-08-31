import * as z from "zod";
import { BouclageReseau } from "./enums.js";
import { id, description, Consommations } from "../../common/types.js";

export const Reseau = z.object({
	alimentation_contigue: z.boolean(),
	niveaux_desservis: z.number().int().min(1),
	isolation: z.boolean().nullable(),
	bouclage: BouclageReseau.nullable(),
});

export const Systeme = z.object({
	id,
	description,
	generateur_id: id,
	reseau: Reseau,
});

export const SystemeData = z.object({
	rdim: z.number(),
	iecs: z.number(),
	rd: z.number(),
	rs: z.number(),
	rg: z.number(),
	rgs: z.number(),
	qcirb: z.number(),
	qtrac: z.number(),
	consommations: Consommations,
});

export const SystemeWithData = Systeme.extend({
	data: SystemeData,
});

export type Systeme = z.infer<typeof Systeme>;
export type SystemeData = z.infer<typeof SystemeData>;
export type SystemeWithData = z.infer<typeof SystemeWithData>;
export type Reseau = z.infer<typeof Reseau>;
