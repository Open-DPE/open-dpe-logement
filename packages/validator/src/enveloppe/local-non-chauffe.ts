import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";
import {
	isBaie as isLocalNonChauffeBaie,
	validateBaie as validateLocalNonChauffeBaie,
} from "./local-non-chauffe/baie.js";
import {
	isParoi as isLocalNonChauffeParoi,
	validateParoi as validateLocalNonChauffeParoi,
} from "./local-non-chauffe/paroi.js";

export {
	isLocalNonChauffeBaie,
	validateLocalNonChauffeBaie,
	isLocalNonChauffeParoi,
	validateLocalNonChauffeParoi,
};

export function validateLocalNonChauffe(
	data: unknown,
): IsValid | IsInvalid {
	return validate(ID.enveloppeLocalNonChauffe, data);
}

export function isLocalNonChauffe(
	data: unknown,
): data is enveloppe.localNonChauffe.LocalNonChauffe {
	return validateLocalNonChauffe(data).isValid;
}
