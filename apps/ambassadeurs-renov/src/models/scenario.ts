import * as models from "@open-dpe-logement/models";
import { validate } from "@open-dpe-logement/schemas";
import _scenarios from "../data/scenario/scenarios.json";
import _zones from "../data/scenario/zones.json";

export type Scenario = {
	id: string;
	titre: string;
	description: string;
	data: models.diagnostic.Diagnostic;
};

export type Zone = {
	code_postal: string;
	code_insee: string;
	commune: string;
	zone_climatique: string;
};

export const scenarios: Scenario[] = _scenarios.map((scenario) => {
	const data = scenario.data;
	if (false === models.diagnostic.isDiagnostic(data)) {
		const isValid = validate("/diagnostic", data);
		throw new Error(
			isValid.isValid
				? `Invalid diagnostic data for scenario ${scenario.id}`
				: `: ${JSON.stringify(isValid.errors)}`,
		);
	}
	return { ...scenario, data };
});

export const zones: Zone[] = _zones;

export function withZone(
	diagnostic: models.diagnostic.Diagnostic,
	zoneClimatique: string,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	const zone = zones.find((z) => z.zone_climatique === zoneClimatique);
	if (zone) {
		data.batiment.adresse.code_postal = zone.code_postal;
		data.batiment.adresse.code_insee = zone.code_insee;
		data.batiment.adresse.commune = zone.commune;
	}
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
