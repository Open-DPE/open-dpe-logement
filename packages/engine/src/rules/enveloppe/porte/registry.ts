import * as rules from "./rules.js";

export const ID = "enveloppe:porte";

export const RULES = {
	aiu: "aiu",
	isolation_aiu: "isolation_aiu",
	sdep: "sdep",
	b: "b",
	dp: "dp",
	u: "u",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.aiu]: ReturnType<typeof rules.aiu>;
			[RULES.isolation_aiu]: ReturnType<typeof rules.isolation_aiu>;
			[RULES.sdep]: ReturnType<typeof rules.sdep>;
			[RULES.b]: ReturnType<typeof rules.b>;
			[RULES.dp]: ReturnType<typeof rules.dp>;
			[RULES.u]: ReturnType<typeof rules.u>;
		}
	>;
};
