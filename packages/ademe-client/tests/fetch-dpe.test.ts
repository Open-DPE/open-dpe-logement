import { readFileSync } from "node:fs";
import { listDpeFixtures } from "@open-dpe-logement/ademe-fixtures";
import { afterEach, describe, expect, it, vi } from "vitest";
import { APIError } from "../src/api.js";
import { NotSupportedError, fetchAudit, fetchDPE } from "../src/index.js";

afterEach(() => {
	vi.unstubAllGlobals();
});

/** Un vrai XML v2.6 du pool de fixtures — garantit un DPE structurellement valide sans en écrire un à la main. */
function realV26Xml(): string {
	const [fixture] = listDpeFixtures({ version: "2.6" });
	if (!fixture) throw new Error("Aucune fixture v2.6 disponible pour ce test.");
	return readFileSync(fixture.path, "utf-8");
}

describe("fetchDPE", () => {
	it("retourne l'objet DPE validé en cas de succès", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(realV26Xml(), { status: 200 })),
		);

		const result = await fetchDPE("2233E1234567A", {
			client_id: "id",
			client_secret: "secret",
		});

		expect(result).not.toBeNull();
		expect(result?.administratif.enum_version_id).toBe("2.6");
	});

	it("retourne null si la ressource n'existe pas (404)", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
		);

		const result = await fetchDPE("inconnu", {
			client_id: "id",
			client_secret: "secret",
		});

		expect(result).toBeNull();
	});

	it("encode l'id du DPE dans l'URL appelée", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response(null, { status: 404 }));
		vi.stubGlobal("fetch", fetchMock);

		await fetchDPE("AB/12 34", { client_id: "id", client_secret: "secret" });

		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe(
			"https://prd-x-ademe-externe-api.de-c1.eu1.cloudhub.io/api/v1/pub/dpe/AB%2F12%2034/xml",
		);
	});

	it("propage une APIError en cas d'erreur de l'API", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("boom", { status: 500 })),
		);

		const promise = fetchDPE("erreur", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toBeInstanceOf(APIError);
	});

	it.each(["1", "1.1"])(
		"lève une NotSupportedError pour un DPE version %s (obsolète, hors périmètre)",
		async (version) => {
			vi.stubGlobal(
				"fetch",
				vi.fn().mockResolvedValue(
					new Response(
						`<dpe><administratif><enum_version_id>${version}</enum_version_id></administratif></dpe>`,
						{ status: 200 },
					),
				),
			);

			const promise = fetchDPE("2100E0876123B", {
				client_id: "id",
				client_secret: "secret",
			});

			await expect(promise).rejects.toBeInstanceOf(NotSupportedError);
			await expect(promise).rejects.toMatchObject({
				type: "DPE",
				numero: "2100E0876123B",
				version,
			});
		},
	);

	it("le rejet d'une version 1.x se produit avant la validation du schéma (pas de ZodError même si le DPE est par ailleurs incomplet)", async () => {
		// Volontairement minimal / structurellement invalide pour dpe.DPELogementExistant :
		// si le garde version ne s'exécutait pas avant .parse(), on obtiendrait un ZodError.
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					"<dpe><administratif><enum_version_id>1</enum_version_id></administratif></dpe>",
					{ status: 200 },
				),
			),
		);

		const promise = fetchDPE("2100E0876123B", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toBeInstanceOf(NotSupportedError);
	});

	it("ne lève pas de NotSupportedError pour une version inconnue hors 1.x (le garde reste ciblé)", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					"<dpe><administratif><enum_version_id>9.9</enum_version_id></administratif></dpe>",
					{ status: 200 },
				),
			),
		);

		const promise = fetchDPE("2100E0876123B", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.not.toBeInstanceOf(NotSupportedError);
	});
});

describe("fetchAudit", () => {
	it("retourne null si la ressource n'existe pas (404)", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
		);

		const result = await fetchAudit("inconnu", {
			client_id: "id",
			client_secret: "secret",
		});

		expect(result).toBeNull();
	});

	it("encode l'id de l'audit dans l'URL appelée", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response(null, { status: 404 }));
		vi.stubGlobal("fetch", fetchMock);

		await fetchAudit("AB/12 34", { client_id: "id", client_secret: "secret" });

		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe(
			"https://prd-x-ademe-externe-api.de-c1.eu1.cloudhub.io/api/v1/pub/audit/AB%2F12%2034/xml",
		);
	});

	it("propage une APIError en cas d'erreur de l'API", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("boom", { status: 500 })),
		);

		const promise = fetchAudit("erreur", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toBeInstanceOf(APIError);
	});

	// Pas de fixtures Audit réelles disponibles (`ademe-fixtures` est DPE-only à
	// date) : XML minimal, suffisant pour le garde de version qui s'exécute
	// avant toute validation de schéma.
	it.each(["0.1", "1.0", "1.1"])(
		"lève une NotSupportedError pour un Audit version %s (obsolète, hors périmètre)",
		async (version) => {
			vi.stubGlobal(
				"fetch",
				vi.fn().mockResolvedValue(
					new Response(
						`<audit><administratif><enum_version_audit_id>${version}</enum_version_audit_id></administratif></audit>`,
						{ status: 200 },
					),
				),
			);

			const promise = fetchAudit("AUD123", {
				client_id: "id",
				client_secret: "secret",
			});

			await expect(promise).rejects.toBeInstanceOf(NotSupportedError);
			await expect(promise).rejects.toMatchObject({
				type: "Audit",
				numero: "AUD123",
				version,
			});
		},
	);

	it("le rejet d'une version obsolète se produit avant la validation du schéma (pas de ZodError même si l'audit est par ailleurs incomplet)", async () => {
		// Volontairement minimal / structurellement invalide pour audit.Audit :
		// si le garde version ne s'exécutait pas avant .parse(), on obtiendrait un ZodError.
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					"<audit><administratif><enum_version_audit_id>1.0</enum_version_audit_id></administratif></audit>",
					{ status: 200 },
				),
			),
		);

		const promise = fetchAudit("AUD123", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toBeInstanceOf(NotSupportedError);
	});

	it("ne lève pas de NotSupportedError pour une version Audit inconnue hors versions obsolètes (le garde reste ciblé)", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					"<audit><administratif><enum_version_audit_id>9.9</enum_version_audit_id></administratif></audit>",
					{ status: 200 },
				),
			),
		);

		const promise = fetchAudit("AUD123", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.not.toBeInstanceOf(NotSupportedError);
	});
});
