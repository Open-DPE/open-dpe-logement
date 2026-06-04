import * as rules from "./rules.js";

export const ID = "chauffage:installation";

export const RULES = {
	caux_dist: "caux_dist",
	bch: "bch",
	rdim: "rdim",
	pch: "pch",
	fch: "fch",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.caux_dist]: ReturnType<typeof rules.caux_dist>;
			[RULES.bch]: ReturnType<typeof rules.bch>;
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
			[RULES.pch]: ReturnType<typeof rules.pch>;
			[RULES.fch]: ReturnType<typeof rules.fch>;
		}
	>;
};
