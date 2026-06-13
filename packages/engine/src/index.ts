import * as models from "@open-dpe-logement/models";
import { createContext } from "./core/context.js";
import * as services from "./rules/services.js";
export * as rules from "./rules/rules.js";
export * as constants from "./rules/constants.js";
export * as formulas from "./rules/formulas.js";

export { createContext };

/**
 * Calcule l'ensemble des indicateurs 3CL-DPE pour un diagnostic.
 */
export function calcule(
	diagnostic: models.diagnostic.Diagnostic,
	scenario: models.common.Scenario = "conventionnel",
): models.diagnostic.DiagnosticWithData {
	const context = createContext(diagnostic, scenario);
	return services.diagnostic.calcule(context);
}
