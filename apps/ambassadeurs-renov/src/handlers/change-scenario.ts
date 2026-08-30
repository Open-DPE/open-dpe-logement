import { engine } from "@open-dpe-logement/engine";
import { departements } from "../models/departement";
import {
	scenarios,
	withAltitude,
	withAnneeConstruction,
	withDepartement,
} from "../models/scenario";
import { setDiagnostic, clearSimulation } from "../stores/user";

export async function changeScenario(command: {
	scenarioId: string;
	departementCode: string | null;
	altitude: string | null;
	anneeConstruction: string | null;
}): Promise<{
	success: boolean;
	message: string;
}> {
	const { scenarioId, departementCode, altitude, anneeConstruction } = command;

	try {
		const scenario = scenarios.find((s) => s.id === scenarioId);

		if (!scenario)
			return {
				success: false,
				message: "Scénario introuvable.",
			};

		let { data } = scenario;

		const departement = departements.find(
			(d) => d.code_departement === departementCode,
		);

		if (departement) data = withDepartement(data, departement);
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
