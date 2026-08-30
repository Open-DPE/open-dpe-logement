import type { Refroidissement } from "./types.js";
import type { Generateur } from "./generateur/types.js";
import type { Installation } from "./installation/types.js";
import { EntityNotFoundError } from "../errors.js";

export function findGenerateur(
	id: string,
	refroidissement: Refroidissement,
): Generateur {
	const e = refroidissement.generateurs.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Generateur", id);
	return e;
}

export function findInstallation(
	id: string,
	refroidissement: Refroidissement,
): Installation {
	const e = refroidissement.installations.find((i) => i.id === id);
	if (!e) throw new EntityNotFoundError("Installation", id);
	return e;
}
