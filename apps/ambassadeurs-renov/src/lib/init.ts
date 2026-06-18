import { createContext, services } from "@open-dpe-logement/engine";
import { scenarios } from "../models/scenario";
import { $user, setDiagnostic } from "../stores/user";

export function initDefaultScenario() {
	const { diagnostic } = $user.get();
	if (diagnostic) return;

	const defaultScenario = scenarios[0];
	if (!defaultScenario) return;

	const context = createContext(defaultScenario.data);
	const result = services.diagnostic.calcule(context);

	setDiagnostic(defaultScenario.id, result);
}
