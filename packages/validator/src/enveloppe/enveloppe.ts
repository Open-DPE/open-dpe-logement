import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export { isBaie, validateBaie } from "./baie.js";
export { isMasque, validateMasque } from "./masque.js";
export { isMur, validateMur } from "./mur.js";
export { isNiveau, validateNiveau } from "./niveau.js";
export { isPlancherHaut, validatePlancherHaut } from "./plancher-haut.js";
export { isPlancherBas, validatePlancherBas } from "./plancher-bas.js";
export { isPontThermique, validatePontThermique } from "./pont-thermique.js";
export { isPorte, validatePorte } from "./porte.js";
export {
	isLocalNonChauffe,
	validateLocalNonChauffe,
	isLocalNonChauffeBaie,
	validateLocalNonChauffeBaie,
	isLocalNonChauffeParoi,
	validateLocalNonChauffeParoi,
} from "./local-non-chauffe.js";

export function validateEnveloppe(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppe, data);
}

export function isEnveloppe(data: unknown): data is enveloppe.Enveloppe {
	return validateEnveloppe(data).isValid;
}
