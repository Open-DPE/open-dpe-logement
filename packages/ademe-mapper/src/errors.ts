export class SupportError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SupportError";
	}
}

export class MappingError extends Error {
	constructor(key: string, value: unknown) {
		super(`Mapping error for key: ${key}, value: ${JSON.stringify(value)}`);
		this.name = "MappingError";
	}
}
