import { common, diagnostic } from "@open-dpe-logement/models";
import { createContext } from "./core/context.js";
import { init as initAbaques } from "@open-dpe-logement/abaques";
import { calcule as calculeDiagnostic } from "./rules/diagnostic/service.js";
import * as formulas from "./rules/formulas.js";

type CalculeResponse = {
	data: diagnostic.DiagnosticWithData;
	log: Map<string, unknown>;
};

class Engine {
	private initialized: boolean = false;

	async init(): Promise<void> {
		if (!this.initialized) {
			await initAbaques();
			this.initialized = true;
		}
	}

	calcule(
		diagnostic: diagnostic.Diagnostic,
		scenario: common.Scenario = common.ScenarioEnum.conventionnel,
	): CalculeResponse {
		if (!this.initialized) throw new Error("Call init() first.");

		const context = createContext(diagnostic, scenario);
		const data = calculeDiagnostic(context);
		const log = context.log();
		return { data, log };
	}

	formules(): typeof formulas {
		if (!this.initialized) throw new Error("Call init() first.");
		return formulas;
	}
}

export const engine = new Engine();
