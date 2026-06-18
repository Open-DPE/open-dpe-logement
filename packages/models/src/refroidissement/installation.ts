import { validate } from "@open-dpe-logement/schemas/refroidissement/installation";
import { EntityNotFoundError } from "../errors.js";
import type { UUID, NonEmptyArray } from "../common/common.js";
import type { Generateur } from "./generateur.js";

export function isInstallation(data: unknown): data is Installation {
	return validate(data).isValid;
}

/**
 * @see https://schemas.open-dpe.fr/refroidissement/installation
 */
export type Installation = {
	id: UUID;
	description: string;
	surface: number;
	generateurs: NonEmptyArray<UUID>;
};

export type InstallationWithData<T extends Installation = Installation> = T & {
	data: InstallationData;
};

export type InstallationData = {
	rdim: number;
};

export function get_generateur(collection: Generateur[], id: UUID): Generateur {
	const e = collection.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Generateur", id);
	return e;
}
