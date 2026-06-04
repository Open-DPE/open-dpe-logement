import * as rules from "./rules.js";

export const ID = "batiment";

export const RULES = {
	sh: "sh",
	hsp: "hsp",
	ratio_proratisation: "ratio_proratisation",
} as const;

export type Results = {
	[ID]: {
		[RULES.sh]: ReturnType<typeof rules.sh>;
		[RULES.hsp]: ReturnType<typeof rules.hsp>;
		[RULES.ratio_proratisation]: ReturnType<typeof rules.ratio_proratisation>;
	};
};
