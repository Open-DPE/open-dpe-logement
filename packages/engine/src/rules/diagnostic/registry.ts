import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cef]: rules.cef,
		[RULES.cep]: rules.cep,
		[RULES.eges]: rules.eges,
		[RULES.etiquette_energie]: rules.etiquette_energie,
		[RULES.etiquette_climat]: rules.etiquette_climat,
		[RULES.confort_ete]: rules.confort_ete,
	},
};
