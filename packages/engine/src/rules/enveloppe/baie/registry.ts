import * as rules from "./rules.js";

export const ID = "enveloppe:baie";

export const RULES = {
	aiu: "aiu",
	isolation_aiu: "isolation_aiu",
	sdep: "sdep",
	b: "b",
	dp: "dp",
	u: "u",
	deltar: "deltar",
	uw: "uw",
	uw1: "uw1",
	uw2: "uw2",
	ug: "ug",
	sse: "sse",
	sw: "sw",
	sw1: "sw1",
	sw2: "sw2",
	fe: "fe",
	fe1: "fe1",
	fe2: "fe2",
	omb: "omb",
	c1: "c1",
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
			[RULES.deltar]: ReturnType<typeof rules.deltar>;
			[RULES.uw]: ReturnType<typeof rules.uw>;
			[RULES.uw1]: ReturnType<typeof rules.uw1>;
			[RULES.uw2]: ReturnType<typeof rules.uw2>;
			[RULES.ug]: ReturnType<typeof rules.ug>;
			[RULES.sse]: ReturnType<typeof rules.sse>;
			[RULES.sw]: ReturnType<typeof rules.sw>;
			[RULES.sw1]: ReturnType<typeof rules.sw1>;
			[RULES.sw2]: ReturnType<typeof rules.sw2>;
			[RULES.fe]: ReturnType<typeof rules.fe>;
			[RULES.fe1]: ReturnType<typeof rules.fe1>;
			[RULES.fe2]: ReturnType<typeof rules.fe2>;
			[RULES.omb]: ReturnType<typeof rules.omb>;
			[RULES.c1]: ReturnType<typeof rules.c1>;
		}
	>;
};
