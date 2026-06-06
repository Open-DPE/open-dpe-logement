import type { Results as PanneauPhotovoltaiqueResults } from "./panneau-photovoltaique/registry.js";
import * as rules from "./rules.js";

export const ID = "production";

export const RULES = {
	ppv: "ppv",
	celec_total: "celec_total",
	celec: "celec",
	celec_ac_total: "celec_ac_total",
	celec_ac: "celec_ac",
	tapl: "tapl",
} as const;

export type Results = {
	[ID]: {
		[RULES.ppv]: ReturnType<typeof rules.ppv>;
		[RULES.celec_total]: ReturnType<typeof rules.celec_total>;
		[RULES.celec]: ReturnType<typeof rules.celec>;
		[RULES.celec_ac_total]: ReturnType<typeof rules.celec_ac_total>;
		[RULES.celec_ac]: ReturnType<typeof rules.celec_ac>;
		[RULES.tapl]: ReturnType<typeof rules.tapl>;
	};
} & PanneauPhotovoltaiqueResults;
