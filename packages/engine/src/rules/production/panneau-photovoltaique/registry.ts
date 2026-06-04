import * as rules from "./rules.js";

export const ID = "production:panneau-photovoltaique";

export const RULES = {
	ppv: "ppv",
	kpv: "kpv",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.ppv]: ReturnType<typeof rules.ppv>;
			[RULES.kpv]: ReturnType<typeof rules.kpv>;
		}
	>;
};
