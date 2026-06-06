import * as rules from "./rules.js";

export const ID = "refroidissement:generateur";

export const RULES = {
	consommations: "consommations",
	cfr: "cfr",
	cfr_enr: "cfr_enr",
	cfr_elec: "cfr_elec",
	caux: "caux",
	rdim: "rdim",
	eer: "eer",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.consommations]: ReturnType<typeof rules.consommations>;
			[RULES.cfr]: ReturnType<typeof rules.cfr>;
			[RULES.cfr_enr]: ReturnType<typeof rules.cfr_enr>;
			[RULES.cfr_elec]: ReturnType<typeof rules.cfr_elec>;
			[RULES.caux]: ReturnType<typeof rules.caux>;
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
			[RULES.eer]: ReturnType<typeof rules.eer>;
		}
	>;
};
