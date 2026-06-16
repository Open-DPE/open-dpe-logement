import { persistentAtom } from "@nanostores/persistent";
import type * as models from "@open-dpe-logement/models";

type Store = {
	diagnostic: models.diagnostic.DiagnosticWithData | null;
	simulation: models.diagnostic.DiagnosticWithData | null;
	gestes: string[];
};

const DEFAULT: Store = {
	diagnostic: null,
	simulation: null,
	gestes: [],
};

export const $user = persistentAtom<Store>("user", DEFAULT, {
	encode: JSON.stringify,
	decode: JSON.parse,
});

// --- Getters ---

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

export function setDiagnostic(
	diagnostic: models.diagnostic.DiagnosticWithData,
) {
	$user.set({ ...$user.get(), diagnostic });
}

export function setSimulation(
	simulation: models.diagnostic.DiagnosticWithData,
	gestes: string[],
) {
	$user.set({ ...$user.get(), simulation, gestes });
}

// --- Reset ---

export function clearDiagnostic() {
	$user.set({ ...$user.get(), diagnostic: null });
}

export function clearSimulation() {
	$user.set({ ...$user.get(), simulation: null, gestes: [] });
}

export function clearUser() {
	$user.set(DEFAULT);
}

export function useUserStore() {
	return $user;
}
