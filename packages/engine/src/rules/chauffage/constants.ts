export * as generateur from "./generateur/constants";
export * as installation from "./installation/constants";
export * as systeme from "./systeme/constants";

export const NAMESPACE = "chauffage";

export const RULES = {
	consommations: "consommations",
	cch: "cch",
	cch_elec: "cch_elec",
	caux_gen: "caux_gen",
	caux_dist: "caux_dist",
	bch: "bch",
	bch_hp: "bch_hp",
	bv: "bv",
	pch: "pch",
	f: "f",
	as: "as",
	ai: "ai",
	qgw_rec: "qgw_rec",
	qdw_rec: "qdw_rec",
	qgen_ecs_rec: "qgen_ecs_rec",
	effet_joule: "effet_joule",
	nref: "nref",
	dh: "dh",
} as const;
