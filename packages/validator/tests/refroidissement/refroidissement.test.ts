import { describe, expect, it } from "vitest";
import type { refroidissement } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";

describe("isRefroidissement — guard", () => {
	it("accepte un refroidissement sans équipement", () => {
		const fixture: refroidissement.Refroidissement = {
			generateurs: [],
			installations: [],
		};
		expect(validator.refroidissement.isRefroidissement(fixture)).toBe(true);
	});
});
