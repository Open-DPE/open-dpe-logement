import { createGuard } from "#/utils.js";
import * as generateur from "./generateur.js";
import * as installation from "./installation.js";

export { generateur, installation };

export const isRefroidissement =
	createGuard<Refroidissement>("/refroidissement");

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
};

export type RefroidissementData = {
	bfr: number;
	as: number;
	ai: number;
};
