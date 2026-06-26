import { describe, expect, it } from "vitest";
import type { production } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";

describe("isProduction — guard", () => {
	it("accepte une production sans panneaux", () => {
		const fixture: production.Production = {
			panneaux_photovoltaiques: [],
		};
		expect(validator.production.isProduction(fixture)).toBe(true);
	});
});
