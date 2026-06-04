import * as rules from "./rules.js";

export const ID = "enveloppe:pont-thermique";

export const RULES = {
	pt: "pt",
	kpt: "kpt",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.pt]: ReturnType<typeof rules.pt>;
			[RULES.kpt]: ReturnType<typeof rules.kpt>;
		}
	>;
};
