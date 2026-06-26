import { describe, expect, it } from "vitest";
import { EntityNotFoundError } from "../src/errors.js";

describe("EntityNotFoundError", () => {
	it("formate le message avec le nom de l'entité et l'id", () => {
		const error = new EntityNotFoundError("Mur", "abc-123");
		expect(error.message).toBe("Mur with id abc-123 not found");
		expect(error.name).toBe("EntityNotFoundError");
		expect(error).toBeInstanceOf(Error);
	});
});
