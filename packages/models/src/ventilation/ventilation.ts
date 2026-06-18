import { validate } from "@open-dpe-logement/schemas/ventilation";
import type { NonEmptyArray, UUID } from "../common/common.js";
import { EntityNotFoundError } from "../errors.js";
import * as installation from "./installation.js";

export { installation };

export function isVentilation(data: unknown): data is Ventilation {
	return validate(data).isValid;
}

/**
 * @see https://schemas.open-dpe.fr/ventilation
 */
export type Ventilation = {
	installations: NonEmptyArray<installation.Installation>;
};

export type VentilationWithData<T extends Ventilation = Ventilation> = T & {
	installations: NonEmptyArray<installation.InstallationWithData>;
	data: VentilationData;
};

export type VentilationData = {
	qvarep_conv: number;
	qvasouf_conv: number;
	smea_conv: number;
};

export function getInstallation(
	ventilation: Ventilation,
	id: UUID,
): installation.Installation {
	const e = ventilation.installations.find((i) => i.id === id);
	if (!e) throw new EntityNotFoundError("Installation", id);
	return e;
}
