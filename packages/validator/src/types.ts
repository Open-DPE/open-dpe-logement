import { type ErrorObject } from "ajv";

export type ValidationResponse = Valid | Invalid;

export type Valid = {
	valid: true;
};

export type Invalid = {
	valid: false;
	errors: ValidationError[];
};

export type ValidationError = JSONSchemaError | CustomError;

/**
 * @see https://www.rfc-editor.org/info/rfc9457/
 */
export type JSONSchemaError = {
	field: string;
	message: string;
	type: "json-schema";
	details: ErrorObject;
};

export type CustomError = {
	field: string;
	message: string;
	type: "custom";
};
