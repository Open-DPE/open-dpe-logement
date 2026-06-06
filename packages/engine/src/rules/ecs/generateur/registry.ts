import * as rules from "./rules.js";

export const ID = "ecs:generateur";

export const RULES = {
	consommations: "consommations",
	cecs: "cecs",
	cecs_elec: "cecs_elec",
	caux_gen: "caux_gen",
	caux_gen_enr: "caux_gen_enr",
	rdim: "rdim",
	pn: "pn",
	pdim: "pdim",
	pecs: "pecs",
	paux: "paux",
	cop: "cop",
	qp0: "qp0",
	rpn: "rpn",
	pveilleuse: "pveilleuse",
	cr: "cr",
	qgw: "qgw",
	qgen: "qgen",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.consommations]: ReturnType<typeof rules.consommations>;
			[RULES.cecs]: ReturnType<typeof rules.cecs>;
			[RULES.cecs_elec]: ReturnType<typeof rules.cecs_elec>;
			[RULES.caux_gen]: ReturnType<typeof rules.caux_gen>;
			[RULES.caux_gen_enr]: ReturnType<typeof rules.caux_gen_enr>;
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
			[RULES.pn]: ReturnType<typeof rules.pn>;
			[RULES.pdim]: ReturnType<typeof rules.pdim>;
			[RULES.pecs]: ReturnType<typeof rules.pecs>;
			[RULES.paux]: ReturnType<typeof rules.paux>;
			[RULES.cop]: ReturnType<typeof rules.cop>;
			[RULES.qp0]: ReturnType<typeof rules.qp0>;
			[RULES.rpn]: ReturnType<typeof rules.rpn>;
			[RULES.pveilleuse]: ReturnType<typeof rules.pveilleuse>;
			[RULES.cr]: ReturnType<typeof rules.cr>;
			[RULES.qgw]: ReturnType<typeof rules.qgw>;
			[RULES.qgen]: ReturnType<typeof rules.qgen>;
		}
	>;
};
