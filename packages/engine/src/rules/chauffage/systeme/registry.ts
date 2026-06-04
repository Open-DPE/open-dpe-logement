import * as rules from "./rules.js";

export const ID = "chauffage:systeme";

export const RULES = {
	cch: "cch",
	caux_dist: "caux_dist",
	rdim: "rdim",
	pch: "pch",
	int: "int",
	ich: "ich",
	rd: "rd",
	re: "re",
	rg: "rg",
	rr: "rr",
	pcircem: "pcircem",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.cch]: ReturnType<typeof rules.cch>;
			[RULES.caux_dist]: ReturnType<typeof rules.caux_dist>;
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
			[RULES.pch]: ReturnType<typeof rules.pch>;
			[RULES.int]: ReturnType<typeof rules.int>;
			[RULES.ich]: ReturnType<typeof rules.ich>;
			[RULES.rd]: ReturnType<typeof rules.rd>;
			[RULES.re]: ReturnType<typeof rules.re>;
			[RULES.rg]: ReturnType<typeof rules.rg>;
			[RULES.rr]: ReturnType<typeof rules.rr>;
			[RULES.pcircem]: ReturnType<typeof rules.pcircem>;
		}
	>;
};
