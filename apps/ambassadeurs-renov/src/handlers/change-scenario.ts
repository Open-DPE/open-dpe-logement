import * as models from "@open-dpe-logement/models";
import { engine } from "@open-dpe-logement/engine";
import { scenarios } from "../models/scenario";
import type { Adresse } from "../models/adresse";
import { setDiagnostic, clearSimulation } from "../stores/user";

export async function changeScenario(command: {
	scenarioId: string;
	adresse: Adresse | null;
	altitude: string | null;
	anneeConstruction: string | null;
}): Promise<{
	success: boolean;
	message: string;
}> {
	const { scenarioId, adresse, altitude, anneeConstruction } = command;

	try {
		const scenario = scenarios.find((s) => s.id === scenarioId);

		if (!scenario)
			return {
				success: false,
				message: "Scénario introuvable.",
			};

		let { data } = scenario;

		if (adresse) data = withAdresse(data, adresse);
		if (altitude) data = withAltitude(data, Number(altitude));
		if (anneeConstruction)
			data = withAnneeConstruction(data, Number(anneeConstruction));

		const simulation = engine.calcule(data);
		setDiagnostic({ diagnostic: simulation.data, scenario: scenario.id });
		clearSimulation();

		return {
			success: true,
			message: "Scénario mis à jour.",
		};
	} catch (error) {
		console.error(error, command);
		return {
			success: false,
			message: "Une erreur est survenue lors de la mise à jour du scénario.",
		};
	}
}

export function withAdresse(
	diagnostic: models.diagnostic.Diagnostic,
	adresse: Adresse,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	data.batiment.adresse = { ...adresse };
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
