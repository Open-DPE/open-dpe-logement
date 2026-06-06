import * as rules from "./rules.js";

export const ID = "diagnostic";

export const RULES = {
	consommations: "consommations",
	cef: "cef",
	cep: "cep",
	eges: "eges",
} as const;

export type Results = {
	[ID]: {
		[RULES.consommations]: ReturnType<typeof rules.consommations>;
		[RULES.cef]: ReturnType<typeof rules.cef>;
		[RULES.cep]: ReturnType<typeof rules.cep>;
		[RULES.eges]: ReturnType<typeof rules.eges>;
	};
};
