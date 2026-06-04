import * as rules from "./rules.js";

export const ID = "enveloppe:local-non-chauffe:paroi";

export const RULES = {
	aue: "aue",
	aiu: "aiu",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.aue]: ReturnType<typeof rules.aue>;
			[RULES.aiu]: ReturnType<typeof rules.aiu>;
		}
	>;
};
