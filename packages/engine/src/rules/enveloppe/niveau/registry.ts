import * as rules from "./rules.js";

export const ID = "enveloppe:niveau";

export const RULES = {
	inertie: "inertie",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.inertie]: ReturnType<typeof rules.inertie>;
		}
	>;
};
