import * as rules from "./rules.js";

export const ID = "refroidissement:installation";

export const RULES = {
	rdim: "rdim",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
		}
	>;
};
