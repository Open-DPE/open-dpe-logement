import { describe, expect, it } from "vitest";
import { MAP, SCHEMAS } from "../src/index.js";

describe("MAP", () => {
	it.each(Object.entries(MAP))(
		"%s -> %s référence un schéma existant dans SCHEMAS",
		(_key, $id) => {
			expect(SCHEMAS.has($id)).toBe(true);
		},
	);
});
