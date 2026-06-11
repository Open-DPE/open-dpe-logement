export * as panneauPhotovoltaique from "./panneau-photovoltaique/constants.js";

export const NAMESPACE = "production";

export const RULES = {
	ppv: "ppv",
	celec_total: "celec_total",
	celec: "celec",
	celec_ac_total: "celec_ac_total",
	celec_ac: "celec_ac",
	tapl: "tapl",
} as const;
