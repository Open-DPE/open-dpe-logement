import type { production } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export {
	isPanneauPhotovoltaique,
	validatePanneauPhotovoltaique,
} from "./panneau-photovoltaique.js";

export function validateProduction(data: unknown): IsValid | IsInvalid {
	return validate(ID.production, data);
}

export function isProduction(data: unknown): data is production.Production {
	return validateProduction(data).isValid;
}
