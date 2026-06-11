export * as generateur from "./generateur/constants";
export * as installation from "./installation/constants";

export const NAMESPACE = "refroidissement";

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
