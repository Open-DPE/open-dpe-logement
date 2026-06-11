import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.zone_climatique]: rules.zone_climatique,
		[RULES.tbase]: rules.tbase,
		[RULES.sollicitations]: rules.sollicitations,
		[RULES.nj]: rules.nj,
		[RULES.epv]: rules.epv,
	},
};
