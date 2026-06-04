import type { Results as BaieResults } from "./baie/registry.js";
import type { Results as ParoiResults } from "./paroi/registry.js";
import * as rules from "./rules.js";

export const ID = "enveloppe:local-non-chauffe";

export const RULES = {
	b: "b",
	aiu: "aiu",
	aue: "aue",
	isolation_aiu: "isolation_aiu",
	isolation_aue: "isolation_aue",
	sse: "sse",
	orientations: "orientations",
	t: "t",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.b]: ReturnType<typeof rules.b>;
			[RULES.aiu]: ReturnType<typeof rules.aiu>;
			[RULES.aue]: ReturnType<typeof rules.aue>;
			[RULES.isolation_aiu]: ReturnType<typeof rules.isolation_aiu>;
			[RULES.isolation_aue]: ReturnType<typeof rules.isolation_aue>;
			[RULES.sse]: ReturnType<typeof rules.sse>;
			[RULES.orientations]: ReturnType<typeof rules.orientations>;
			[RULES.t]: ReturnType<typeof rules.t>;
		}
	>;
} & BaieResults &
	ParoiResults;
