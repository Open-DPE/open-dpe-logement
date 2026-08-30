import { describe, expect, it } from "vitest";
import { abaques, init } from "../src/index.js";

describe("abaques (intégration)", () => {
	it("load() échoue avant init()", () => {
		expect(() => abaques.chauffage.combustion.load()).toThrow();
	});

	it("init() permet ensuite à toutes les tables connues de se charger", async () => {
		await init();
		expect(abaques.chauffage.combustion.load().length).toBeGreaterThan(0);
		expect(abaques.climat.zoneClimatique.load().length).toBeGreaterThan(0);
		expect(abaques.ventilation.debits.load().length).toBeGreaterThan(0);
	});
});
