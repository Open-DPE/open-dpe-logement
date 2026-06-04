import * as rules from "./rules.js";

export const ID = "eclairage";

export const RULES = {
	cecl: "cecl",
	nhecl: "nhecl",
} as const;

export type Results = {
	[ID]: {
		[RULES.cecl]: ReturnType<typeof rules.cecl>;
		[RULES.nhecl]: ReturnType<typeof rules.nhecl>;
	};
};
