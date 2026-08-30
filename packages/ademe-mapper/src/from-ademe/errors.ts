export class SupportError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SupportError";
	}
}

export class MappingError extends Error {
	constructor(
		public readonly key: string,
		public readonly value: unknown,
	) {
		super(`Mapping error for key: ${key}, value: ${JSON.stringify(value)}`);
		this.name = "MappingError";
	}
}
