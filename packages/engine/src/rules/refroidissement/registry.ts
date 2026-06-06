import type { Results as GenerateurResults } from "./generateur/registry.js";
import type { Results as InstallationResults } from "./installation/registry.js";
import * as rules from "./rules.js";

export const ID = "refroidissement";

export const RULES = {
	consommations: "consommations",
	cfr: "cfr",
	cfr_elec: "cfr_elec",
	caux: "caux",
	bfr: "bfr",
	fut: "fut",
	rbth: "rbth",
	as: "as",
	ai: "ai",
	e: "e",
	textmoy: "textmoy",
	nref: "nref",
	tint: "tint",
	t: "t",
	cin: "cin",
} as const;

export type Results = {
	[ID]: {
		[RULES.consommations]: ReturnType<typeof rules.consommations>;
		[RULES.cfr]: ReturnType<typeof rules.cfr>;
		[RULES.cfr_elec]: ReturnType<typeof rules.cfr_elec>;
		[RULES.caux]: ReturnType<typeof rules.caux>;
		[RULES.bfr]: ReturnType<typeof rules.bfr>;
		[RULES.fut]: ReturnType<typeof rules.fut>;
		[RULES.rbth]: ReturnType<typeof rules.rbth>;
		[RULES.as]: ReturnType<typeof rules.as>;
		[RULES.ai]: ReturnType<typeof rules.ai>;
		[RULES.e]: ReturnType<typeof rules.e>;
		[RULES.textmoy]: ReturnType<typeof rules.textmoy>;
		[RULES.nref]: ReturnType<typeof rules.nref>;
		[RULES.tint]: ReturnType<typeof rules.tint>;
		[RULES.t]: ReturnType<typeof rules.t>;
		[RULES.cin]: ReturnType<typeof rules.cin>;
	};
} & GenerateurResults &
	InstallationResults;
