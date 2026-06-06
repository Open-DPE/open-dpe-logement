import * as models from "@open-dpe-logement/models";
import { Cache } from "./cache.js";
import type { Results } from "./results.js";
import * as diagnostic from "#rules/diagnostic/index.js";

export class Engine {
	private scenario: models.common.Scenario =
		models.common.ScenarioEnum.conventionnel;

	public setScenario(scenario: models.common.Scenario): Engine {
		if (scenario !== this.scenario) {
			this.scenario = scenario;
		}
		return this;
	}

	/**
	 * Calcule l'ensemble des règles 3CL-DPE pour un diagnostic donné.
	 * Chaque appel crée un nouveau Cache : le résultat est déterministe
	 * et isolé quelle que soit la fréquence des appels.
	 */
	public run(diag: models.diagnostic.Diagnostic): Results {
		const cache = new Cache(diag, this.scenario);
		diagnostic.rules.register(cache);
		return cache.getResults();
	}
}
