import { describe, expect, it } from "vitest";
import {
	isMasque,
	type MasqueLointainHomogene,
	type MasqueLointainNonHomogene,
	type MasqueProcheParoiLaterale,
	type MasqueProcheFondBalconOuLoggias,
	type MasqueProcheBalconOuAuvent,
} from "../../src/enveloppe/masque.js";
import { UUID } from "../helpers.js";

describe("isMasque — guard", () => {
	it("accepte un masque lointain homogène", () => {
		const masque: MasqueLointainHomogene = {
			id: UUID,
			description: "Bâtiment voisin",
			type: "homogene",
			hauteur: 10,
			profondeur: null,
			secteur: null,
		};
		expect(isMasque(masque)).toBe(true);
	});

	it("accepte un masque lointain non homogène", () => {
		const masque: MasqueLointainNonHomogene = {
			id: UUID,
			description: "Masque non homogène",
			type: "non_homogene",
			hauteur: 8,
			profondeur: null,
			secteur: "central",
		};
		expect(isMasque(masque)).toBe(true);
	});

	it("accepte un masque proche paroi latérale", () => {
		const masque: MasqueProcheParoiLaterale = {
			id: UUID,
			description: "Paroi latérale sans obstacle",
			type: "paroi_laterale_sans_obstacle_au_sud",
			hauteur: null,
			profondeur: null,
			secteur: null,
		};
		expect(isMasque(masque)).toBe(true);
	});

	it("accepte un masque proche fond balcon / loggia", () => {
		const masque: MasqueProcheFondBalconOuLoggias = {
			id: UUID,
			description: "Fond loggias",
			type: "fond_et_flanc_loggias",
			hauteur: null,
			profondeur: 1.5,
			secteur: null,
		};
		expect(isMasque(masque)).toBe(true);
	});

	it("accepte un masque proche balcon ou auvent", () => {
		const masque: MasqueProcheBalconOuAuvent = {
			id: UUID,
			description: "Auvent",
			type: "balcon_ou_auvent",
			hauteur: null,
			profondeur: 0.8,
			secteur: null,
		};
		expect(isMasque(masque)).toBe(true);
	});
});
