import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchDPE } from "../src/index.js";
import { APIError } from "../src/api.js";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("fetchDPE", () => {
	it("retourne le XML du DPE en cas de succès", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response("<dpe/>", { status: 200 }));
		vi.stubGlobal("fetch", fetchMock);

		const result = await fetchDPE("2233E1234567A", {
			client_id: "id",
			client_secret: "secret",
		});

		expect(result).toBe("<dpe/>");
	});

	it("encode l'id du DPE dans l'URL appelée", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response("<dpe/>", { status: 200 }));
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
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						errorDetails: {
							code: 404,
							reason: "NOT_FOUND",
							message: "DPE introuvable",
						},
					}),
					{ status: 404 },
				),
			),
		);

		const promise = fetchDPE("inconnu", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toBeInstanceOf(APIError);
		await expect(promise).rejects.toMatchObject({
			type: "api_error",
			status: 404,
			title: "NOT_FOUND",
		});
	});
});
