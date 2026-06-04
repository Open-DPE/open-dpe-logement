import * as rules from "./rules.js";

export const ID = "refroidissement:generateur";

export const RULES = {
	cfr: "cfr",
	caux: "caux",
	rdim: "rdim",
	eer: "eer",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.cfr]: ReturnType<typeof rules.cfr>;
			[RULES.caux]: ReturnType<typeof rules.caux>;
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
			[RULES.eer]: ReturnType<typeof rules.eer>;
		}
	>;
};
