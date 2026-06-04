import * as rules from "./rules.js";

export const ID = "climat";

export const RULES = {
	zone_climatique: "zone_climatique",
	tbase: "tbase",
	sollicitations: "sollicitations",
	nj: "nj",
	epv: "epv",
} as const;

export type Results = {
	[ID]: {
		[RULES.zone_climatique]: ReturnType<typeof rules.zone_climatique>;
		[RULES.tbase]: ReturnType<typeof rules.tbase>;
		[RULES.sollicitations]: ReturnType<typeof rules.sollicitations>;
		[RULES.nj]: ReturnType<typeof rules.nj>;
		[RULES.epv]: ReturnType<typeof rules.epv>;
	};
};
