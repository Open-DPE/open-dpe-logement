import * as models from "@open-dpe-logement/models";
import { engine } from "@open-dpe-logement/engine";
import { gestes, withGeste } from "../models/geste";
import { setSimulation } from "../stores/user";

export async function changeGestes(command: {
	diagnostic: models.diagnostic.Diagnostic;
	gestesIDs: string[];
}): Promise<{
	success: boolean;
	message: string;
}> {
	const { diagnostic, gestesIDs } = command;
	let data = structuredClone(diagnostic);

	try {
		for (const gesteID of gestesIDs) {
			const geste = gestes.find((g) => g.id === gesteID);
			if (geste) data = withGeste(data, geste);
		}

		const simulation = engine.calcule(data);
		setSimulation(simulation.data, gestesIDs);
		return {
			success: true,
			message: "Gestes mis à jour.",
		};
	} catch (error) {
		console.error(error, data);
		return {
			success: false,
			message: "Une erreur est survenue lors de la simulation.",
		};
	}
}
