import * as rules from "./rules.js";

export const ID = "ecs:installation";

export const RULES = {
	becs: "becs",
	caux_dist: "caux_dist",
	rdim: "rdim",
	fecs: "fecs",
	qdw: "qdw",
	qdw_ind_vc: "qdw_ind_vc",
	qdw_col_vc: "qdw_col_vc",
	qdw_col_hvc: "qdw_col_hvc",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.becs]: ReturnType<typeof rules.becs>;
			[RULES.caux_dist]: ReturnType<typeof rules.caux_dist>;
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
			[RULES.fecs]: ReturnType<typeof rules.fecs>;
			[RULES.qdw]: ReturnType<typeof rules.qdw>;
			[RULES.qdw_ind_vc]: ReturnType<typeof rules.qdw_ind_vc>;
			[RULES.qdw_col_vc]: ReturnType<typeof rules.qdw_col_vc>;
			[RULES.qdw_col_hvc]: ReturnType<typeof rules.qdw_col_hvc>;
		}
	>;
};
