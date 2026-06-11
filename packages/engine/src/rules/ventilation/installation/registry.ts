import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.caux]: rules.caux,
		[RULES.caux_enr]: rules.caux_enr,
		[RULES.pvent_moy]: rules.pvent_moy,
		[RULES.rut]: rules.rut,
		[RULES.rdim]: rules.rdim,
		[RULES.debits]: rules.debits,
		[RULES.hvent]: rules.hvent,
	},
};
