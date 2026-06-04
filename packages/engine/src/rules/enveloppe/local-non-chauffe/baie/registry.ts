import * as rules from "./rules.js";

export const ID = "enveloppe:local-non-chauffe:baie";

export const RULES = {
	aue: "aue",
	aiu: "aiu",
	sst: "sst",
	t: "t",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.aue]: ReturnType<typeof rules.aue>;
			[RULES.aiu]: ReturnType<typeof rules.aiu>;
			[RULES.sst]: ReturnType<typeof rules.sst>;
			[RULES.t]: ReturnType<typeof rules.t>;
		}
	>;
};
