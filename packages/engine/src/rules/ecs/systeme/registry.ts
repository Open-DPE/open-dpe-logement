import * as rules from "./rules.js";

export const ID = "ecs:systeme";

export const RULES = {
	cecs: "cecs",
	caux_dist: "caux_dist",
	qcirb: "qcirb",
	qtrac: "qtrac",
	rdim: "rdim",
	iecs: "iecs",
	rd: "rd",
	rg: "rg",
	rs: "rs",
	rgs: "rgs",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.cecs]: ReturnType<typeof rules.cecs>;
			[RULES.caux_dist]: ReturnType<typeof rules.caux_dist>;
			[RULES.qcirb]: ReturnType<typeof rules.qcirb>;
			[RULES.qtrac]: ReturnType<typeof rules.qtrac>;
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
			[RULES.iecs]: ReturnType<typeof rules.iecs>;
			[RULES.rd]: ReturnType<typeof rules.rd>;
			[RULES.rg]: ReturnType<typeof rules.rg>;
			[RULES.rs]: ReturnType<typeof rules.rs>;
			[RULES.rgs]: ReturnType<typeof rules.rgs>;
		}
	>;
};
