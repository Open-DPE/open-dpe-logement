import { describe, expect, it } from "vitest";
import * as validator from "../src/index.js";

describe("singleton Ajv — résolution des $ref croisés", () => {
	it("ne lève pas d'erreur quand une sous-entité est validée avant son domaine parent", () => {
		// Ordre volontairement défavorable : avec une architecture bundlée
		// (corps dupliqué + $id retenu), compiler chauffage après emetteur
		// lève "resolves to more than one schema". Avec le registre lean +
		// addSchema bootstrap, l'ordre d'appel est sans effet.
		expect(() => validator.chauffage.isEmetteur({})).not.toThrow();
		expect(() => validator.chauffage.isChauffage({})).not.toThrow();
	});

	it("valide deux domaines qui référencent la même entité commune sans collision", () => {
		expect(() => validator.batiment.isBatiment({})).not.toThrow();
		expect(() => validator.diagnostic.isDiagnostic({})).not.toThrow();
	});

	it("rejette un objet vide pour une entité requérant des propriétés", () => {
		expect(validator.batiment.isAppartement({})).toBe(false);
	});

	it("expose validateXXX avec le détail des erreurs Ajv", () => {
		const result = validator.batiment.validateAppartement({});
		expect(result.isValid).toBe(false);
		if (!result.isValid) {
			expect(result.errors.length).toBeGreaterThan(0);
		}
	});

	it("valide les guards imbriqués (enveloppe.local-non-chauffe.baie)", () => {
		expect(() => validator.enveloppe.isLocalNonChauffeBaie({})).not.toThrow();
	});
});
