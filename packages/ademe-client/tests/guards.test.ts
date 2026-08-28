import { describe, expect, it } from "vitest";
import {
	NotSupportedError,
	extractEnumVersionId,
	supportsAuditVersion,
	supportsDPEVersion,
} from "../src/guards.js";

describe("supportsDPEVersion", () => {
	it.each(["1", "1.1"])(
		"rejette la version DPE obsolète %s",
		(version) => {
			expect(supportsDPEVersion(version)).toBe(false);
		},
	);

	it.each(["2", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6"])(
		"accepte la version DPE supportée %s",
		(version) => {
			expect(supportsDPEVersion(version)).toBe(true);
		},
	);

	it("accepte une version inconnue (le garde ne cible que les obsolètes connues)", () => {
		expect(supportsDPEVersion("9.9")).toBe(true);
	});
});

describe("supportsAuditVersion", () => {
	// Régression : `enums.audit.json` (groupe `version_audit`) code la version
	// initiale "1.0", pas "1" — contrairement au DPE où c'est "1".
	it.each(["0.1", "1.0", "1.1"])(
		"rejette la version Audit obsolète %s",
		(version) => {
			expect(supportsAuditVersion(version)).toBe(false);
		},
	);

	it('n\'est pas trompé par "1" (valeur DPE, absente de l\'enum Audit réel)', () => {
		expect(supportsAuditVersion("1")).toBe(true);
	});

	it.each(["2.0", "2.1", "2.2", "2.3", "2.4", "2.5"])(
		"accepte la version Audit supportée %s",
		(version) => {
			expect(supportsAuditVersion(version)).toBe(true);
		},
	);

	it("accepte une version inconnue (le garde ne cible que les obsolètes connues)", () => {
		expect(supportsAuditVersion("9.9")).toBe(true);
	});
});

describe("NotSupportedError", () => {
	it("expose type/numero/version et un message explicite", () => {
		const error = new NotSupportedError("DPE", "2100E0876123B", "1.1");

		expect(error).toBeInstanceOf(Error);
		expect(error.type).toBe("DPE");
		expect(error.numero).toBe("2100E0876123B");
		expect(error.version).toBe("1.1");
		expect(error.message).toBe(
			"DPE 2100E0876123B version 1.1 non supporté (versions 1.x obsolètes)",
		);
	});

	it("distingue DPE et Audit dans le message", () => {
		const error = new NotSupportedError("Audit", "AUD123", "1.0");

		expect(error.type).toBe("Audit");
		expect(error.message).toBe(
			"Audit AUD123 version 1.0 non supporté (versions 1.x obsolètes)",
		);
	});
});

describe("extractEnumVersionId", () => {
	// Objets construits directement (pas via `ademe-parser`) : ce module ne
	// dépend pas du parseur XML, seulement de la forme déjà normalisée. La
	// couverture bout-en-bout (XML réel → parse() → extractEnumVersionId())
	// existe déjà dans `fetch-dpe.test.ts`, via `fetchDPE`/`fetchAudit`.
	it("lit enum_version_id (DPE)", () => {
		expect(
			extractEnumVersionId({ administratif: { enum_version_id: "2.6" } }),
		).toBe("2.6");
	});

	it("lit enum_version_audit_id (Audit) quand enum_version_id est absent", () => {
		expect(
			extractEnumVersionId({
				administratif: { enum_version_audit_id: "2.3" },
			}),
		).toBe("2.3");
	});

	it("priorise enum_version_id si les deux champs sont présents (ne devrait pas arriver en pratique)", () => {
		expect(
			extractEnumVersionId({
				administratif: {
					enum_version_id: "2.6",
					enum_version_audit_id: "2.3",
				},
			}),
		).toBe("2.6");
	});

	it("retourne null si administratif.enum_version_id/enum_version_audit_id sont absents", () => {
		expect(
			extractEnumVersionId({ administratif: { foo: "bar" } }),
		).toBeNull();
	});

	it("retourne null si administratif est absent", () => {
		expect(extractEnumVersionId({ foo: "bar" })).toBeNull();
	});

	it("retourne null pour une entrée non-objet (string, number, null, undefined)", () => {
		expect(extractEnumVersionId("2.6")).toBeNull();
		expect(extractEnumVersionId(42)).toBeNull();
		expect(extractEnumVersionId(null)).toBeNull();
		expect(extractEnumVersionId(undefined)).toBeNull();
	});

	it("retourne null si administratif n'est pas un objet", () => {
		expect(extractEnumVersionId({ administratif: "2.6" })).toBeNull();
		expect(extractEnumVersionId({ administratif: null })).toBeNull();
	});

	it("retourne null si la valeur trouvée n'est pas une string (cas normalement impossible via parse())", () => {
		expect(
			extractEnumVersionId({ administratif: { enum_version_id: 26 } }),
		).toBeNull();
	});
});
