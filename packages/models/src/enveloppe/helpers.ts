import type { Enveloppe } from "./types.js";
import type { Baie } from "./baie/types.js";
import type { LocalNonChauffe } from "./local-non-chauffe/types.js";
import type { Mur } from "./mur/types.js";
import type { PlancherBas } from "./plancher-bas/types.js";
import type { PlancherHaut } from "./plancher-haut/types.js";
import type { Porte } from "./porte/types.js";
import { EntityNotFoundError } from "../errors.js";

export type Paroi = Baie | Mur | PlancherHaut | PlancherBas | Porte;

export function findParoisLocalNonChauffe(
	id: string,
	enveloppe: Enveloppe,
): Paroi[] {
	const parois: Paroi[] = [
		...enveloppe.murs,
		...enveloppe.planchers_hauts,
		...enveloppe.planchers_bas,
		...enveloppe.baies,
		...enveloppe.portes,
	];
	return parois.filter((i) => i.position.local_non_chauffe_id === id);
}

export function findBaiesLocalNonChauffe(
	id: string,
	enveloppe: Enveloppe,
): Baie[] {
	return enveloppe.baies.filter((i) => i.position.local_non_chauffe_id === id);
}

export function findPortesLocalNonChauffe(
	id: string,
	enveloppe: Enveloppe,
): Porte[] {
	return enveloppe.portes.filter((i) => i.position.local_non_chauffe_id === id);
}

export function findMursLocalNonChauffe(
	id: string,
	enveloppe: Enveloppe,
): Mur[] {
	return enveloppe.murs.filter((i) => i.position.local_non_chauffe_id === id);
}

export function findPlanchersHautsLocalNonChauffe(
	id: string,
	enveloppe: Enveloppe,
): PlancherHaut[] {
	return enveloppe.planchers_hauts.filter(
		(i) => i.position.local_non_chauffe_id === id,
	);
}

export function findPlanchersBasLocalNonChauffe(
	id: string,
	enveloppe: Enveloppe,
): PlancherBas[] {
	return enveloppe.planchers_bas.filter(
		(i) => i.position.local_non_chauffe_id === id,
	);
}

export function findLocalNonChauffe(
	id: string,
	enveloppe: Enveloppe,
): LocalNonChauffe {
	const e = enveloppe.locaux_non_chauffes.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Local non chauffé", id);
	return e;
}

export function findBaie(id: string, enveloppe: Enveloppe): Baie {
	const e = enveloppe.baies.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Baie", id);
	return e;
}

export function findPorte(id: string, enveloppe: Enveloppe): Porte {
	const e = enveloppe.portes.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Porte", id);
	return e;
}

export function findMur(id: string, enveloppe: Enveloppe): Mur {
	const e = enveloppe.murs.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Mur", id);
	return e;
}

export function findPlancherHaut(
	id: string,
	enveloppe: Enveloppe,
): PlancherHaut {
	const e = enveloppe.planchers_hauts.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Plancher haut", id);
	return e;
}

export function findPlancherBas(id: string, enveloppe: Enveloppe): PlancherBas {
	const e = enveloppe.planchers_bas.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Plancher bas", id);
	return e;
}
