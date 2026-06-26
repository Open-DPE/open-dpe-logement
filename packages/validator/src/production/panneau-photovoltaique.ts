import type { production } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validatePanneauPhotovoltaique(
	data: unknown,
): IsValid | IsInvalid {
	return validate(ID.productionPanneauPhotovoltaique, data);
}

export function isPanneauPhotovoltaique(
	data: unknown,
): data is production.panneauPhotovoltaique.PanneauPhotovoltaique {
	return validatePanneauPhotovoltaique(data).isValid;
}
