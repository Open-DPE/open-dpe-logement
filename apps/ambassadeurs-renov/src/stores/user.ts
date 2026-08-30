import { persistentAtom } from "@nanostores/persistent";
import type * as models from "@open-dpe-logement/models";

type Store = {
	scenario: string | null;
	diagnostic: models.diagnostic.DiagnosticWithData | null;
	simulation: models.diagnostic.DiagnosticWithData | null;
	gestes: string[];
};

const DEFAULT: Store = {
	scenario: null,
	diagnostic: null,
	simulation: null,
	gestes: [],
};

export const $user = persistentAtom<Store>("user", DEFAULT, {
	encode: JSON.stringify,
	decode: JSON.parse,
});

// --- Getters ---

export function getScenario() {
	return $user.get().scenario;
}

export function getDiagnostic() {
	return $user.get().diagnostic;
}

export function getSimulation() {
	return $user.get().simulation;
}

export function getGestes() {
	return $user.get().gestes;
}

// --- Setters ---

export function setDiagnostic(props: {
	diagnostic: models.diagnostic.DiagnosticWithData;
	scenario?: string;
}) {
	const { diagnostic } = props;
	const scenario = props.scenario ?? null;
	$user.set({ ...$user.get(), scenario, diagnostic });
}

export function setSimulation(
	simulation: models.diagnostic.DiagnosticWithData,
	gestes: string[],
) {
	$user.set({ ...$user.get(), simulation, gestes });
}

// --- Reset ---

export function clearDiagnostic() {
	const { scenario, diagnostic } = DEFAULT;
	$user.set({ ...$user.get(), scenario, diagnostic });
}

export function clearSimulation() {
	const { simulation, gestes } = DEFAULT;
	$user.set({ ...$user.get(), simulation, gestes });
}

export function clearUser() {
	clearDiagnostic();
	clearSimulation();
}

export function useUserStore() {
	return {
		scenario: getScenario(),
		diagnostic: getDiagnostic(),
		simulation: getSimulation(),
		gestes: getGestes(),
	};
}
