export * as generateur from "./generateur/constants.js";
export * as installation from "./installation/constants.js";
export * as systeme from "./systeme/constants.js";

export const NAMESPACE = "ecs";

export const RULES = {
	consommations: "consommations",
	cecs: "cecs",
	cecs_elec: "cecs_elec",
	caux: "caux",
	caux_gen: "caux_gen",
	caux_dist: "caux_dist",
	qgw: "qgw",
	qgen: "qgen",
	qdw_ind_vc: "qdw_ind_vc",
	qdw_col_vc: "qdw_col_vc",
	qdw_col_hvc: "qdw_col_hvc",
	becs: "becs",
	nadeq: "nadeq",
	nmax: "nmax",
} as const;
