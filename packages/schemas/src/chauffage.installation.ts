import data from "../data/chauffage.installation.json";
import { validate as defaultValidate, type Schema } from "./index";

export const schema: Schema = data;

export function validate(input: unknown) {
	return defaultValidate(schema, input);
}
