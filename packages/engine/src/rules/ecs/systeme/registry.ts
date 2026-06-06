import * as rules from "./rules.js";

export const ID = "ecs:systeme";

export const RULES = {
	consommations: "consommations",
	cecs: "cecs",
	cecs_enr: "cecs_enr",
	cecs_elec: "cecs_elec",
	caux_dist: "caux_dist",
	caux_dist_enr: "caux_dist_enr",
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
			[RULES.consommations]: ReturnType<typeof rules.consommations>;
			[RULES.cecs]: ReturnType<typeof rules.cecs>;
			[RULES.cecs_enr]: ReturnType<typeof rules.cecs_enr>;
			[RULES.cecs_elec]: ReturnType<typeof rules.cecs_elec>;
			[RULES.caux_dist]: ReturnType<typeof rules.caux_dist>;
			[RULES.caux_dist_enr]: ReturnType<typeof rules.caux_dist_enr>;
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
