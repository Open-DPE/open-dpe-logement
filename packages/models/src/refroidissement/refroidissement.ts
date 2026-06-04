import type { Consommations } from "../common/common.js";
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
};

export type RefroidissementData = {
	ai: number;
	as: number;
	bef: number;
	consommations: Consommations;
};
