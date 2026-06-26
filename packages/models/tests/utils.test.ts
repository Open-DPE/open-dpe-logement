import { describe, expect, it } from "vitest";
import { buildEnum } from "../src/utils.js";

describe("buildEnum", () => {
	it("construit un mapping identité valeur -> valeur", () => {
		const result = buildEnum(["a", "b", "c"] as const);
		expect(result).toEqual({ a: "a", b: "b", c: "c" });
	});

	it("fonctionne avec des valeurs numériques", () => {
		const result = buildEnum([1, 2, 3] as const);
		expect(result).toEqual({ 1: 1, 2: 2, 3: 3 });
	});
});
