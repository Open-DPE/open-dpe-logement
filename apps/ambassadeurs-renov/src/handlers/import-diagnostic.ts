import { NotSupportedError, APIError } from "@open-dpe-logement/ademe-client";
import {
	mapFromDPE,
	SupportError,
	MappingError,
} from "@open-dpe-logement/ademe-mapper";
import { engine } from "@open-dpe-logement/engine";
import { fetchDpe } from "../services/fetch-dpe";
import { setDiagnostic, clearSimulation } from "../stores/user";

export async function importDiagnostic(command: { numero: string }): Promise<{
	success: boolean;
	message: string;
}> {
	const { numero } = command;

	try {
		const dpe = await fetchDpe(numero);

		if (!dpe) {
			return {
				success: false,
				message:
					"Le DPE n'a pas été trouvé dans la base de données de l'ADEME.",
			};
		}

		const data = mapFromDPE(dpe);
		const simulation = engine.calcule(data);
		setDiagnostic({ diagnostic: simulation.data });
		clearSimulation();

		return {
			success: true,
			message: "Diagnostic importé.",
		};
	} catch (error) {
		if (error instanceof NotSupportedError) {
			return {
				success: false,
				message: `Ce DPE utilise une version non prise en charge (${error.version}).`,
			};
		}

		if (error instanceof APIError) {
			console.error(
				"Erreur API ADEME",
				error.code,
				error.reason,
				error.message,
			);
			return {
				success: false,
				message:
					"Impossible de contacter le service de l'ADEME. Réessayez dans quelques instants.",
			};
		}

		if (error instanceof SupportError) {
			return {
				success: false,
				message: `Ce DPE n'est pas encore pris en charge : ${error.message}`,
			};
		}

		if (error instanceof MappingError) {
			return {
				success: false,
				message: `Données du DPE incomplètes ou incohérentes (${error.key}).`,
			};
		}

		console.error(error, command);
		return {
			success: false,
			message: "Une erreur est survenue lors de l'import du diagnostic.",
		};
	}
}
