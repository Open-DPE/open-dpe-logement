import * as rules from "./rules.js";
import type { Results as EmetteurResults } from "./emetteur/registry.js";
import type { Results as GenerateurResults } from "./generateur/registry.js";
import type { Results as InstallationResults } from "./installation/registry.js";
import type { Results as SystemeResults } from "./systeme/registry.js";

export const ID = "chauffage";

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

export type Results = {
	[ID]: {
		[RULES.consommations]: ReturnType<typeof rules.consommations>;
		[RULES.cch]: ReturnType<typeof rules.cch>;
		[RULES.cch_elec]: ReturnType<typeof rules.cch_elec>;
		[RULES.caux_gen]: ReturnType<typeof rules.caux_gen>;
		[RULES.caux_dist]: ReturnType<typeof rules.caux_dist>;
		[RULES.bch]: ReturnType<typeof rules.bch>;
		[RULES.bch_hp]: ReturnType<typeof rules.bch_hp>;
		[RULES.bv]: ReturnType<typeof rules.bv>;
		[RULES.pch]: ReturnType<typeof rules.pch>;
		[RULES.f]: ReturnType<typeof rules.f>;
		[RULES.as]: ReturnType<typeof rules.as>;
		[RULES.ai]: ReturnType<typeof rules.ai>;
		[RULES.qgw_rec]: ReturnType<typeof rules.qgw_rec>;
		[RULES.qdw_rec]: ReturnType<typeof rules.qdw_rec>;
		[RULES.qgen_ecs_rec]: ReturnType<typeof rules.qgen_ecs_rec>;
		[RULES.effet_joule]: ReturnType<typeof rules.effet_joule>;
		[RULES.nref]: ReturnType<typeof rules.nref>;
		[RULES.dh]: ReturnType<typeof rules.dh>;
	};
} & EmetteurResults &
	GenerateurResults &
	InstallationResults &
	SystemeResults;
