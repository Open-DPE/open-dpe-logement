import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.cch]: rules.cch,
		[RULES.cch1]: rules.cch1,
		[RULES.cch2]: rules.cch2,
		[RULES.ich]: rules.ich,
		[RULES.ich1]: rules.ich1,
		[RULES.ich2]: rules.ich2,
		[RULES.re]: rules.re,
		[RULES.rr]: rules.rr,
		[RULES.int]: rules.int,
		[RULES.i0]: rules.i0,
		[RULES.type]: rules.type,
	},
};
