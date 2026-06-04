import * as rules from "./rules.js";

export const ID = "enveloppe:plancher-haut";

export const RULES = {
	aiu: "aiu",
	isolation_aiu: "isolation_aiu",
	sdep: "sdep",
	b: "b",
	dp: "dp",
	u: "u",
	u0: "u0",
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
			[RULES.u0]: ReturnType<typeof rules.u0>;
		}
	>;
};
