import * as rules from "./rules.js";

export const ID = "eclairage";

export const RULES = {
	consommations: "consommations",
	cecl: "cecl",
	nhecl: "nhecl",
} as const;

export type Results = {
	[ID]: {
		[RULES.consommations]: ReturnType<typeof rules.consommations>;
		[RULES.cecl]: ReturnType<typeof rules.cecl>;
		[RULES.nhecl]: ReturnType<typeof rules.nhecl>;
	};
};
