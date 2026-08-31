import { Usage, Energie, Mois } from "./enums.js";

import type {
	Consommation,
	Consommations,
	ConsommationParEnergie,
	ConsommationParUsage,
	ParMois,
} from "./types.js";

const zeroConsommation: Consommation = { cef: 0, cep: 0, eges: 0 };

function addConsommation(a: Consommation, b: Consommation): Consommation {
	return {
		cef: a.cef + b.cef,
		cep: a.cep + b.cep,
		eges: a.eges + b.eges,
	};
}

/**
 * Fonction pour créer une collection de valeurs pour chaque mois de l'année.
 */
export function createParMois<T>(fn: (mois: Mois) => T): Record<Mois, T> {
	const result = {} as Record<Mois, T>;
	for (const mois of Mois.options) {
		result[mois] = fn(mois);
	}
	return result;
}

/**
 * Fonction de création d'un collection de valeurs pour chaque mois de l'année à partir d'un tableau d'objets contenant les valeurs et le mois correspondant.
 */
export function createParMoisFrom<T extends object>(
	values: Array<T & { mois: string | Mois }>,
): ParMois<T> {
	const map = new Map(values.map((item) => [item.mois as Mois, item]));
	const result: Partial<ParMois<T>> = {};

	for (const mois of Mois.options) {
		const match = map.get(mois);

		if (!match) {
			const message = `Valeur mensuelle manquante pour le mois ${mois} : ${JSON.stringify(values)}`;
			throw new Error(message);
		}
		result[mois] = match;
	}
	return result as ParMois<T>;
}

/**
 * Données mensuelles aggrégées sur l'année
 */
export function reduceParMois(values: ParMois<number>): number {
	return Object.values(values).reduce((acc: number, v: number) => acc + v, 0);
}

/**
 * Fusionne plusieurs valeurs mensuelles
 */
export function mergeParMois(values: ParMois<number>[]): ParMois<number> {
	const result: ParMois<number> = {} as ParMois<number>;
	for (const mois of Mois.options) {
		result[mois] = values.reduce((acc, v) => acc + v[mois], 0);
	}
	return result;
}

/**
 * Vérifie que toutes les valeurs mensuelles sont présentes pour chaque mois de l'année
 */
export function containsAllMois<T extends object>(
	values: Array<T & { mois: string | Mois }>,
): boolean {
	const moisSet = new Set(values.map((item) => item.mois));
	return Mois.options.every((mois) => moisSet.has(mois));
}

export function mapParMois<T, U>(
	parMois: ParMois<T>,
	fn: (value: T) => U,
): ParMois<U> {
	return Object.fromEntries(
		Mois.options.map((mois) => [mois, fn(parMois[mois])]),
	) as ParMois<U>;
}

/**
 * @return Consommations par usage et par énergie aggrégées
 */
export function reduceConsommations(values: Consommations): Consommation {
	let result = zeroConsommation;
	for (const parEnergie of Object.values(values)) {
		for (const valeurs of Object.values(parEnergie)) {
			result = addConsommation(result, valeurs);
		}
	}
	return result;
}

/**
 * @return Consommations par usage et par énergie aggrégées par énergie
 */
export function reduceConsommationsParEnergie(
	values: Consommations,
): ConsommationParEnergie {
	const result: ConsommationParEnergie = {};

	for (const parEnergie of Object.values(values)) {
		for (const [energie, valeurs] of Object.entries(parEnergie) as [
			Energie,
			Consommation,
		][]) {
			result[energie] = addConsommation(
				result[energie] ?? zeroConsommation,
				valeurs,
			);
		}
	}

	return result;
}

/**
 * @return Consommations par usage et par énergie aggrégées par usage
 */
export function reduceConsommationsParUsage(
	values: Consommations,
): ConsommationParUsage {
	const result: ConsommationParUsage = {};

	for (const [usage, parEnergie] of Object.entries(values) as [
		Usage,
		ConsommationParEnergie,
	][]) {
		for (const valeurs of Object.values(parEnergie) as Consommation[]) {
			result[usage] = addConsommation(
				result[usage] ?? zeroConsommation,
				valeurs,
			);
		}
	}

	return result;
}

/**
 * Fusionne plusieurs consommations par usage et par énergie
 */
export function mergeConsommations(...values: Consommations[]): Consommations {
	const result: Consommations = {};

	for (const consommations of values) {
		for (const [usage, parEnergie] of Object.entries(consommations) as [
			Usage,
			ConsommationParEnergie,
		][]) {
			result[usage] ??= {};
			for (const [energie, valeurs] of Object.entries(parEnergie) as [
				Energie,
				Consommation,
			][]) {
				result[usage]![energie] = addConsommation(
					result[usage]![energie] ?? zeroConsommation,
					valeurs,
				);
			}
		}
	}

	return result;
}
