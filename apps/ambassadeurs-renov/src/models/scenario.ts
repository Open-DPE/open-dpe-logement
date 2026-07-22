import * as models from "@open-dpe-logement/models";
import { validate } from "@open-dpe-logement/validator";
import { type Departement } from "./departement";
import _scenarios from "../../data/scenarios.json";

export type Scenario = {
	id: string;
	titre: string;
	description: string;
	data: models.diagnostic.Diagnostic;
};

export const scenarios: Scenario[] = _scenarios.map((scenario) => {
	const { data } = scenario;
	const result = validate<models.diagnostic.Diagnostic>("/diagnostic", data);

	if (false === result.valid) {
		throw new Error(
			`Invalid diagnostic data for scenario ${scenario.id} : ${JSON.stringify(result.errors)}`,
		);
	}
	return { ...scenario, data: result.data };
});

export function withDepartement(
	diagnostic: models.diagnostic.Diagnostic,
	departement: Departement,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	data.batiment.adresse.code_postal = departement.code_insee;
	data.batiment.adresse.code_insee = departement.code_insee;
	data.batiment.adresse.commune = departement.commune;
	return data;
}

export function withAltitude(
	diagnostic: models.diagnostic.Diagnostic,
	altitude: number,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	data.batiment.altitude = altitude;
	return data;
}

export function withAnneeConstruction(
	diagnostic: models.diagnostic.Diagnostic,
	anneeConstruction: number,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	data.batiment.annee_construction = anneeConstruction;
	return data;
}
