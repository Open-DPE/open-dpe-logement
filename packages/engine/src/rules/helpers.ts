import { chauffage, common } from "@open-dpe-logement/models";

/**
 * Données par taux de charge
 */
export function createParTauxCharge<T>(
	fn: (x: chauffage.generateur.TauxChargeEnum) => T,
): chauffage.ParTauxCharge<T> {
	const result: Partial<chauffage.ParTauxCharge<T>> = {};
	for (const x of chauffage.TAUX_CHARGE) result[x] = fn(x);
	return result as chauffage.ParTauxCharge<T>;
}
