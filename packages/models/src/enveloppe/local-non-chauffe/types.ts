import * as z from "zod";
import { id, description } from "../../common/types.js";
import { OrientationCardinale } from "../../common/enums.js";
import { TypeLocalNonChauffe } from "./enums.js";
import { Paroi, ParoiWithData } from "./paroi/types.js";
import { Baie, BaieWithData } from "./baie/types.js";

export const LocalNonChauffeData = z.object({
	b: z.number(),
	aiu: z.number(),
	aue: z.number(),
	isolation_aiu: z.boolean(),
	isolation_aue: z.boolean(),
	sse: z.number(),
	orientations: z.array(OrientationCardinale),
	t: z.number(),
});

export type LocalNonChauffeData = z.infer<typeof LocalNonChauffeData>;

export const LocalNonChauffeBase = z.object({
	id,
	description,
	type: TypeLocalNonChauffe,
	parois: z.array(Paroi),
	baies: z.array(Baie),
});

export const EspaceTamponSolarise = LocalNonChauffeBase.extend({
	type: TypeLocalNonChauffe.extract(["espace_tampon_solarise"]),
	baies: z.array(Baie).min(1),
});

export const LocalNonChauffeAutre = LocalNonChauffeBase.extend({
	type: TypeLocalNonChauffe.exclude(["espace_tampon_solarise"]),
});

export const LocalNonChauffe = z
	.union([EspaceTamponSolarise, LocalNonChauffeAutre])
	.refine((value) => value.parois.length >= 1 || value.baies.length >= 1, {
		message: "Un local non chauffé doit avoir au moins une paroi ou une baie",
		path: ["parois"],
	});

export const LocalNonChauffeWithData = z.intersection(
	LocalNonChauffe,
	z.object({
		data: LocalNonChauffeData,
		parois: z.array(ParoiWithData),
		baies: z.array(BaieWithData),
	}),
);

export type LocalNonChauffe = z.infer<typeof LocalNonChauffe>;
export type LocalNonChauffeWithData = z.infer<typeof LocalNonChauffeWithData>;
export type LocalNonChauffeBase = z.infer<typeof LocalNonChauffeBase>;
export type EspaceTamponSolarise = z.infer<typeof EspaceTamponSolarise>;
export type LocalNonChauffeAutre = z.infer<typeof LocalNonChauffeAutre>;
