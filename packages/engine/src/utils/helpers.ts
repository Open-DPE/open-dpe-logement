import { chauffage, common } from "@open-dpe-logement/models";

export type NonEmptyArray<T> = [T, ...T[]];

export function toNonEmptyArray<T>(arr: T[]): common.NonEmptyArray<T> {
	if (arr.length === 0) throw new Error("Expected a non-empty array");
	return arr as common.NonEmptyArray<T>;
}

/**
 * Données par taux de charge
 */
export function createParTauxCharge<T>(
	fn: (x: chauffage.TauxCharge) => T,
): chauffage.ParTauxCharge<T> {
	const result: Partial<chauffage.ParTauxCharge<T>> = {};
	for (const x of chauffage.TAUX_CHARGE) result[x] = fn(x);
	return result as chauffage.ParTauxCharge<T>;
}

/**
 * Fonction pour créer une collection de valeurs pour chaque mois de l'année.
 */
export function createParMois<T>(
	fn: (mois: common.Mois) => T,
): Record<common.Mois, T> {
	const result = {} as Record<common.Mois, T>;
	for (const mois of common.MOIS) {
		result[mois] = fn(mois);
	}
	return result;
}

/**
 * Fusionne plusieurs collections de valeurs par mois en une seule collection, en sommant les valeurs pour chaque mois.
 */
export function mergeParMois(
	values: common.ParMois<number>[],
): common.ParMois<number> {
	const result = createParMois<number>(() => 0);
	for (const item of values) {
		for (const mois of common.MOIS) result[mois] += item[mois];
	}
	return result;
}

/**
 * Fonction pour réduire une collection de valeurs par mois en une seule valeur
 */
export function reduceParMois(
	values: common.ParMois<number>,
	reducer: (acc: number, value: number) => number = (acc, val) => acc + val,
	initial: number = 0,
): number {
	return Object.values(values).reduce(reducer, initial);
}

export function createParMoisFrom<T extends object>(
	values: Array<T & { mois: string | common.Mois }>,
): common.ParMois<T> {
	const map = new Map(values.map((item) => [item.mois as common.Mois, item]));
	const result: Partial<common.ParMois<T>> = {};

	for (const mois of common.MOIS) {
		const match = map.get(mois);

		if (!match) {
			const message = `Valeur mensuelle manquante pour le mois ${mois} : ${JSON.stringify(values)}`;
			throw new Error(message);
		}
		result[mois] = match;
	}
	return result as common.ParMois<T>;
}

export function containsAllMois<T extends object>(
	values: Array<T & { mois: string | common.Mois }>,
): boolean {
	const moisSet = new Set(values.map((item) => item.mois));
	return common.MOIS.every((mois) => moisSet.has(mois));
}

export function mapParMois<T, U>(
	parMois: common.ParMois<T>,
	fn: (value: T) => U,
): common.ParMois<U> {
	return Object.fromEntries(
		common.MOIS.map((mois) => [mois, fn(parMois[mois])]),
	) as common.ParMois<U>;
}
