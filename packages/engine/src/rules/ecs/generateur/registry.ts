import * as rules from "./rules.js";

export const ID = "ecs:generateur";

export const RULES = {
	cecs: "cecs",
	caux: "caux",
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
			[RULES.cecs]: ReturnType<typeof rules.cecs>;
			[RULES.caux]: ReturnType<typeof rules.caux>;
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
