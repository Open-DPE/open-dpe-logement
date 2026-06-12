import * as models from "@open-dpe-logement/models";
import { createContext } from "./core/context.js";
import * as rules from "./rules/rules.js";

export * as constants from "./rules/constants.js";
export * as formulas from "./rules/formulas.js";
export * as registry from "./rules/registry.js";

export { createContext, rules };

/**
 * Calcule l'ensemble des indicateurs 3CL-DPE pour un diagnostic.
 */
export function calcule(
	diagnostic: models.diagnostic.Diagnostic,
	scenario: models.batiment.Scenario = "conventionnel",
): models.diagnostic.DiagnosticWithData {
	const context = createContext(diagnostic, scenario);

	const ventilation: models.ventilation.VentilationWithData = {
		...diagnostic.ventilation,
		data: rules.ventilation.calcule(context),
		installations: diagnostic.ventilation.installations.map((installation) => ({
			...installation,
			data: rules.ventilation.installation.calcule(context, installation),
		})),
	}



	return {
		...diagnostic,

		data: rules.diagnostic.calcule(context),

		ventilation


	}
	return engine.run(diagnostic);
}
