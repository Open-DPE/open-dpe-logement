import type { Chauffage } from "./types.js";
import type { Emetteur } from "./emetteur/types.js";
import type { Generateur } from "./generateur/types.js";
import type { Installation } from "./installation/types.js";
import type { Systeme } from "./systeme/types.js";
import { EntityNotFoundError } from "../errors.js";

export function getSystemes(chauffage: Chauffage): Systeme[] {
	return chauffage.installations.flatMap((i) => i.systemes);
}

export function findSysteme(id: string, chauffage: Chauffage): Systeme {
	const systeme = getSystemes(chauffage).find((s) => s.id === id);
	if (!systeme) throw new EntityNotFoundError("Systeme", id);
	return systeme;
}

export function findEmetteur(id: string, chauffage: Chauffage): Emetteur {
	const emetteur = chauffage.emetteurs.find((e) => e.id === id);
	if (!emetteur) throw new EntityNotFoundError("Emetteur", id);
	return emetteur;
}

export function findGenerateur(id: string, chauffage: Chauffage): Generateur {
	const generateur = chauffage.generateurs.find((g) => g.id === id);
	if (!generateur) throw new EntityNotFoundError("Generateur", id);
	return generateur;
}

export function findInstallationBySysteme(
	id: string,
	chauffage: Chauffage,
): Installation {
	const e = chauffage.installations.find((i) =>
		i.systemes.some((s) => s.id === id),
	);
	if (!e) throw new EntityNotFoundError("Installation", id);
	return e;
}
