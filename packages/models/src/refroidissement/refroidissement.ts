import type { UUID } from "../common/common.js";
import { EntityNotFoundError } from "../errors.js";
import * as generateur from "./generateur.js";
import * as installation from "./installation.js";

export { generateur, installation };

/**
 * @see https://schemas.open-dpe.fr/refroidissement
 */
export type Refroidissement = {
	generateurs: generateur.Generateur[];
	installations: installation.Installation[];
};

export type RefroidissementWithData<
	T extends Refroidissement = Refroidissement,
> = T & {
	data: RefroidissementData;
	generateurs: generateur.GenerateurWithData[];
	installations: installation.InstallationWithData[];
};

export type RefroidissementData = {
	bfr: number;
	as: number;
	ai: number;
};

export function getGenerateur(
	refroidissement: Refroidissement,
	id: UUID,
): generateur.Generateur {
	const e = refroidissement.generateurs.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Générateur", id);
	return e;
}

export function getInstallation(
	refroidissement: Refroidissement,
	id: UUID,
): installation.Installation {
	const e = refroidissement.installations.find((i) => i.id === id);
	if (!e) throw new EntityNotFoundError("Installation", id);
	return e;
}
