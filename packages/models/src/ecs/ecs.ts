import type { NonEmptyArray, UUID } from "#/common/common";
import { EntityNotFoundError } from "#/errors.js";
import { createGuard } from "#/utils.js";
import * as generateur from "./generateur.js";
import * as installation from "./installation.js";
import * as systeme from "./systeme.js";

export { generateur, installation, systeme };

export const isEcs = createGuard<Ecs>("/ecs");

/**
 * @see https://schemas.open-dpe.fr/ecs
 */
export type Ecs = {
	generateurs: NonEmptyArray<generateur.Generateur>;
	installations: NonEmptyArray<installation.Installation>;
};

export type EcsWithData<T extends Ecs = Ecs> = T & {
	data: EcsData;
	generateurs: NonEmptyArray<generateur.GenerateurWithData>;
	installations: NonEmptyArray<installation.InstallationWithData>;
};

export type EcsData = {
	qgw: number;
	qgen: number;
	qdw_ind_vc: number;
	qdw_col_vc: number;
	qdw_col_hvc: number;
	becs: number;
	nadeq: number;
	nmax: number;
};

export function get_systemes(ecs: Ecs): systeme.Systeme[] {
	return ecs.installations.flatMap((i) => i.systemes);
}

export function get_generateur(ecs: Ecs, id: UUID): generateur.Generateur {
	const e = ecs.generateurs.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Générateur", id);
	return e;
}

export function get_installation(
	ecs: Ecs,
	id: UUID,
): installation.Installation {
	const e = ecs.installations.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Installation", id);
	return e;
}
