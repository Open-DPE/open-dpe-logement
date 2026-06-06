import { SCHEMA_KEYS } from "@open-dpe-logement/schemas";
import type { NonEmptyArray } from "#/common/common";
import { createGuard } from "#/utils";
import * as installation from "./installation.js";

export { installation };

export const isVentilation = createGuard<Ventilation>(
	SCHEMA_KEYS["ventilation"],
);

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
};
