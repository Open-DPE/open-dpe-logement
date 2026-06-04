import type { Consommations, NonEmptyArray } from "../common/common.js";
import * as installation from "./installation.js";

export { installation };

/**
 * @see https://schemas.open-dpe.fr/ventilation
 */
export type Ventilation = {
	installations: NonEmptyArray<installation.Installation>;
};

export type VentilationWithData<T extends Ventilation = Ventilation> = T & {
	data: VentilationData;
};

export type VentilationData = {
	qvarep_conv: number;
	qvasouf_conv: number;
	smea_conv: number;
	consommations: Consommations;
};
