import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.becs]: rules.becs,
		[RULES.caux_dist]: rules.caux_dist,
		[RULES.rdim]: rules.rdim,
		[RULES.fecs]: rules.fecs,
		[RULES.qdw]: rules.qdw,
		[RULES.qdw_ind_vc]: rules.qdw_ind_vc,
		[RULES.qdw_col_vc]: rules.qdw_col_vc,
		[RULES.qdw_col_hvc]: rules.qdw_col_hvc,
	},
};
