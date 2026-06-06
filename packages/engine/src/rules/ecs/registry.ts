import type { Results as GenerateurResults } from "./generateur/registry.js";
import type { Results as InstallationResults } from "./installation/registry.js";
import type { Results as SystemeResults } from "./systeme/registry.js";
import * as rules from "./rules.js";

export const ID = "ecs";

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

export type Results = {
	[ID]: {
		[RULES.consommations]: ReturnType<typeof rules.consommations>;
		[RULES.cecs]: ReturnType<typeof rules.cecs>;
		[RULES.cecs_elec]: ReturnType<typeof rules.cecs_elec>;
		[RULES.caux]: ReturnType<typeof rules.caux>;
		[RULES.caux_gen]: ReturnType<typeof rules.caux_gen>;
		[RULES.caux_dist]: ReturnType<typeof rules.caux_dist>;
		[RULES.qgw]: ReturnType<typeof rules.qgw>;
		[RULES.qgen]: ReturnType<typeof rules.qgen>;
		[RULES.qdw_ind_vc]: ReturnType<typeof rules.qdw_ind_vc>;
		[RULES.qdw_col_vc]: ReturnType<typeof rules.qdw_col_vc>;
		[RULES.qdw_col_hvc]: ReturnType<typeof rules.qdw_col_hvc>;
		[RULES.becs]: ReturnType<typeof rules.becs>;
		[RULES.nadeq]: ReturnType<typeof rules.nadeq>;
		[RULES.nmax]: ReturnType<typeof rules.nmax>;
	};
} & GenerateurResults &
	InstallationResults &
	SystemeResults;
