import type { diagnostic } from "@open-dpe-logement/models";
import { Engine } from "./core/engine.js";
import type { Results } from "./core/results.js";

export { Engine } from "./core/engine.js";
export type { Results } from "./core/results.js";

const engine = new Engine();

/**
 * Calcule l'ensemble des indicateurs 3CL-DPE pour un diagnostic.
 * @returns L'objet Results contenant toutes les valeurs calculées.
 */
export function calcule(diagnostic: diagnostic.Diagnostic): Results {
	return engine.run(diagnostic);
}

/**
 * Applique les résultats 3CL-DPE calculés directement sur le diagnostic.
 * @returns Le diagnostic enrichi avec les valeurs calculées.
 */
export function applique(
	diagnostic: diagnostic.Diagnostic,
): diagnostic.Diagnostic {
	// TODO: projeter les Results sur les champs readOnly du diagnostic
	engine.run(diagnostic);
	return diagnostic;
}
