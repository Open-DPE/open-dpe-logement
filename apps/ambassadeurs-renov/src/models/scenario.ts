import * as models from "@open-dpe-logement/models";
import _scenarios from "../../data/scenarios.json";

export type Scenario = {
	id: string;
	titre: string;
	description: string;
	data: models.diagnostic.Diagnostic;
};

export const scenarios: Scenario[] = _scenarios.map((scenario) => {
	const { data } = scenario;
	return { ...scenario, data: models.diagnostic.Diagnostic.parse(data) };
});
