import * as rules from "./rules.js";

export const ID = "chauffage:generateur";

export const RULES = {
	cch: "cch",
	cch_elec: "cch_elec",
	caux: "caux",
	rdim: "rdim",
	pn: "pn",
	pdim: "pdim",
	pch: "pch",
	paux: "paux",
	rpint: "rpint",
	rpn: "rpn",
	qp0: "qp0",
	pveilleuse: "pveilleuse",
	scop: "scop",
	tfonc30: "tfonc30",
	tfonc100: "tfonc100",
	qgen_rec: "qgen_rec",
	qgen: "qgen",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.cch]: ReturnType<typeof rules.cch>;
			[RULES.cch_elec]: ReturnType<typeof rules.cch_elec>;
			[RULES.caux]: ReturnType<typeof rules.caux>;
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
			[RULES.pn]: ReturnType<typeof rules.pn>;
			[RULES.pdim]: ReturnType<typeof rules.pdim>;
			[RULES.pch]: ReturnType<typeof rules.pch>;
			[RULES.paux]: ReturnType<typeof rules.paux>;
			[RULES.rpint]: ReturnType<typeof rules.rpint>;
			[RULES.rpn]: ReturnType<typeof rules.rpn>;
			[RULES.qp0]: ReturnType<typeof rules.qp0>;
			[RULES.pveilleuse]: ReturnType<typeof rules.pveilleuse>;
			[RULES.scop]: ReturnType<typeof rules.scop>;
			[RULES.tfonc30]: ReturnType<typeof rules.tfonc30>;
			[RULES.tfonc100]: ReturnType<typeof rules.tfonc100>;
			[RULES.qgen_rec]: ReturnType<typeof rules.qgen_rec>;
			[RULES.qgen]: ReturnType<typeof rules.qgen>;
		}
	>;
};
