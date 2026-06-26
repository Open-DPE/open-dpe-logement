import { describe, expect, it } from "vitest";
import type { ventilation } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID as FIXTURE_UUID } from "../helpers.js";

describe("isInstallation ventilation — guard", () => {
	it("accepte une installation naturelle valide", () => {
		const installation: ventilation.installation.Installation = {
			id: FIXTURE_UUID,
			description: "Ventilation naturelle par conduit",
			surface: 80,
			type: "ventilation_naturelle_conduit",
			annee_installation: null,
			installation_collective: null,
			presence_echangeur_thermique: null,
		};
		expect(validator.ventilation.isInstallation(installation)).toBe(true);
	});

	it("accepte une VMC simple flux valide", () => {
		const installation: ventilation.installation.Installation = {
			id: FIXTURE_UUID,
			description: "VMC simple flux autoréglable",
			surface: 80,
			type: "vmc_simple_flux_autoreglable",
			annee_installation: 2010,
			installation_collective: false,
			presence_echangeur_thermique: null,
		};
		expect(validator.ventilation.isInstallation(installation)).toBe(true);
	});

	it("accepte une VMC double flux valide", () => {
		const installation: ventilation.installation.Installation = {
			id: FIXTURE_UUID,
			description: "VMC double flux",
			surface: 80,
			type: "vmc_double_flux",
			annee_installation: 2015,
			installation_collective: false,
			presence_echangeur_thermique: true,
		};
		expect(validator.ventilation.isInstallation(installation)).toBe(true);
	});
});
