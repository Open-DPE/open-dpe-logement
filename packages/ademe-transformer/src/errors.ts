export class SupportError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SupportError";
	}
}
