import * as rules from "./rules.js";

export const ID = "chauffage:emetteur";

export const RULES = {
	delta_pem: "delta_pem",
	fcot: "fcot",
	dtheta_dim: "dtheta_dim",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.delta_pem]: ReturnType<typeof rules.delta_pem>;
			[RULES.fcot]: ReturnType<typeof rules.fcot>;
			[RULES.dtheta_dim]: ReturnType<typeof rules.dtheta_dim>;
		}
	>;
};
