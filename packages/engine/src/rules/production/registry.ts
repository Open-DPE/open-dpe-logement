import type { Results as PanneauPhotovoltaiqueResults } from "./panneau-photovoltaique/registry.js";
import * as rules from "./rules.js";

export const ID = "production";

export const RULES = {
	ppv: "ppv",
	celec: "celec",
	celec_ch: "celec_ch",
	celec_ecs: "celec_ecs",
	celec_fr: "celec_fr",
	celec_ecl: "celec_ecl",
	celec_aux_vent: "celec_aux_vent",
	celec_aux_dist: "celec_aux_dist",
	celec_autres: "celec_autres",
	celec_ac: "celec_ac",
	celec_ac_ch: "celec_ac_ch",
	celec_ac_ecs: "celec_ac_ecs",
	celec_ac_fr: "celec_ac_fr",
	celec_ac_ecl: "celec_ac_ecl",
	celec_ac_aux_vent: "celec_ac_aux_vent",
	celec_ac_aux_dist: "celec_ac_aux_dist",
	celec_ac_autres: "celec_ac_autres",
	tapl: "tapl",
} as const;

export type Results = {
	[ID]: {
		[RULES.ppv]: ReturnType<typeof rules.ppv>;
		[RULES.celec]: ReturnType<typeof rules.celec>;
		[RULES.celec_ch]: ReturnType<typeof rules.celec_ch>;
		[RULES.celec_ecs]: ReturnType<typeof rules.celec_ecs>;
		[RULES.celec_fr]: ReturnType<typeof rules.celec_fr>;
		[RULES.celec_ecl]: ReturnType<typeof rules.celec_ecl>;
		[RULES.celec_aux_vent]: ReturnType<typeof rules.celec_aux_vent>;
		[RULES.celec_aux_dist]: ReturnType<typeof rules.celec_aux_dist>;
		[RULES.celec_autres]: ReturnType<typeof rules.celec_autres>;
		[RULES.celec_ac]: ReturnType<typeof rules.celec_ac>;
		[RULES.celec_ac_ch]: ReturnType<typeof rules.celec_ac_ch>;
		[RULES.celec_ac_ecs]: ReturnType<typeof rules.celec_ac_ecs>;
		[RULES.celec_ac_fr]: ReturnType<typeof rules.celec_ac_fr>;
		[RULES.celec_ac_ecl]: ReturnType<typeof rules.celec_ac_ecl>;
		[RULES.celec_ac_aux_vent]: ReturnType<typeof rules.celec_ac_aux_vent>;
		[RULES.celec_ac_aux_dist]: ReturnType<typeof rules.celec_ac_aux_dist>;
		[RULES.celec_ac_autres]: ReturnType<typeof rules.celec_ac_autres>;
		[RULES.tapl]: ReturnType<typeof rules.tapl>;
	};
} & PanneauPhotovoltaiqueResults;
