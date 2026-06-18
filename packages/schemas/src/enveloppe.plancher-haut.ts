import data from "../data/enveloppe.plancher-haut.json";
import { validate as defaultValidate, type Schema } from "./index";

export const schema: Schema = data;

export function validate(input: unknown) {
	return defaultValidate(schema, input);
}
