import { describe, expect, it } from "vitest";
import {
	isSansIsolation,
	isIsolationInconnue,
	isTypeIsolationInconnue,
	isIsolationConnue,
	isPositionParoiLocalNonChauffe,
	isPositionParoiAutres,
	type Isolation,
	type Position,
} from "../../src/enveloppe/common.js";

describe("discriminateurs Isolation", () => {
	const sansIsolation: Isolation = {
		etat: false,
		type: null,
		annee_installation: null,
		epaisseur: null,
		resistance_thermique: null,
	};
	const isolationInconnue: Isolation = {
		etat: null,
		type: null,
		annee_installation: null,
		epaisseur: null,
		resistance_thermique: null,
	};
	const typeIsolationInconnue: Isolation = {
		etat: true,
		type: null,
		annee_installation: null,
		epaisseur: null,
		resistance_thermique: null,
	};
	const isolationConnue: Isolation = {
		etat: true,
		type: "ite",
		annee_installation: 2015,
		epaisseur: 100,
		resistance_thermique: 3.5,
	};

	it("isSansIsolation distingue uniquement le cas etat=false", () => {
		expect(isSansIsolation(sansIsolation)).toBe(true);
		expect(isSansIsolation(isolationInconnue)).toBe(false);
		expect(isSansIsolation(typeIsolationInconnue)).toBe(false);
		expect(isSansIsolation(isolationConnue)).toBe(false);
	});

	it("isIsolationInconnue distingue uniquement le cas etat=null", () => {
		expect(isIsolationInconnue(isolationInconnue)).toBe(true);
		expect(isIsolationInconnue(sansIsolation)).toBe(false);
		expect(isIsolationInconnue(typeIsolationInconnue)).toBe(false);
	});

	it("isTypeIsolationInconnue distingue etat=true avec type=null", () => {
		expect(isTypeIsolationInconnue(typeIsolationInconnue)).toBe(true);
		expect(isTypeIsolationInconnue(isolationConnue)).toBe(false);
		expect(isTypeIsolationInconnue(sansIsolation)).toBe(false);
	});

	it("isIsolationConnue distingue etat=true avec type renseigné", () => {
		expect(isIsolationConnue(isolationConnue)).toBe(true);
		expect(isIsolationConnue(typeIsolationInconnue)).toBe(false);
		expect(isIsolationConnue(isolationInconnue)).toBe(false);
	});
});

describe("discriminateurs Position (paroi)", () => {
	it("isPositionParoiLocalNonChauffe vrai uniquement pour mitoyennete=local_non_chauffe", () => {
		const position: Position = {
			surface: 10,
			mitoyennete: "local_non_chauffe",
			local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440000",
		};
		expect(isPositionParoiLocalNonChauffe(position)).toBe(true);
		expect(isPositionParoiAutres(position)).toBe(false);
	});

	it("isPositionParoiAutres vrai pour les autres mitoyennetés", () => {
		const position: Position = {
			surface: 10,
			mitoyennete: "exterieur",
			local_non_chauffe_id: null,
		};
		expect(isPositionParoiAutres(position)).toBe(true);
		expect(isPositionParoiLocalNonChauffe(position)).toBe(false);
	});
});
