import { describe, it, expect, vi, afterEach } from "vitest";
import { call, APIError } from "../src/api.js";

function jsonResponse(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), { status });
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("call", () => {
	it("retourne le résultat du handler en cas de succès", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("<xml/>", { status: 200 })),
		);

		const result = await call(
			"https://example.test/resource",
			{ client_id: "id", client_secret: "secret" },
			async (response) => response.text(),
		);

		expect(result).toBe("<xml/>");
	});

	it("transmet client_id et client_secret en headers", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response("ok", { status: 200 }));
		vi.stubGlobal("fetch", fetchMock);

		await call(
			"https://example.test/resource",
			{ client_id: "my-id", client_secret: "my-secret" },
			async (response) => response.text(),
		);

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = init.headers as Record<string, string>;
		expect(headers.client_id).toBe("my-id");
		expect(headers.client_secret).toBe("my-secret");
	});

	it("lève une APIError api_error avec le détail de errorDetails sur une erreur documentée", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				jsonResponse(401, {
					errorDetails: {
						code: 401,
						reason: "UNAUTHORIZED",
						message: "client_id ou client_secret invalide",
					},
				}),
			),
		);

		const promise = call(
			"https://example.test/resource",
			{ client_id: "id", client_secret: "secret" },
			async (response) => response.text(),
		);

		await expect(promise).rejects.toThrow(APIError);
		await expect(promise).rejects.toMatchObject({
			type: "api_error",
			status: 401,
			title: "UNAUTHORIZED",
			detail: "client_id ou client_secret invalide",
		});
	});

	it("lève une APIError api_error avec des valeurs par défaut si errorDetails est absent", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(500, {})));

		const promise = call(
			"https://example.test/resource",
			{ client_id: "id", client_secret: "secret" },
			async (response) => response.text(),
		);

		await expect(promise).rejects.toMatchObject({
			type: "api_error",
			status: 500,
			title: "Unknown error",
			detail: null,
		});
	});

	it("lève une APIError malformed_error_response si le corps d'erreur n'est pas du JSON valide", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue(
					new Response("<html>Bad Gateway</html>", { status: 502 }),
				),
		);

		const promise = call(
			"https://example.test/resource",
			{ client_id: "id", client_secret: "secret" },
			async (response) => response.text(),
		);

		await expect(promise).rejects.toMatchObject({
			type: "malformed_error_response",
			status: 502,
			detail: "<html>Bad Gateway</html>",
		});
	});

	it("lève une APIError network_error si fetch rejette", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValue(new Error("connection refused")),
		);

		const promise = call(
			"https://example.test/resource",
			{ client_id: "id", client_secret: "secret" },
			async (response) => response.text(),
		);

		await expect(promise).rejects.toMatchObject({
			type: "network_error",
			status: 500,
			detail: "connection refused",
		});
	});

	it("lève une APIError timeout si la requête est abandonnée", async () => {
		const abortError = new DOMException(
			"The user aborted a request.",
			"AbortError",
		);
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));

		const promise = call(
			"https://example.test/resource",
			{ client_id: "id", client_secret: "secret", timeoutMs: 10 },
			async (response) => response.text(),
		);

		await expect(promise).rejects.toMatchObject({
			type: "timeout",
			status: 408,
			title: "Request timed out after 10ms",
		});
	});

	it("enveloppe une erreur inattendue du handler dans une APIError handler_error", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("ok", { status: 200 })),
		);

		const promise = call(
			"https://example.test/resource",
			{ client_id: "id", client_secret: "secret" },
			async () => {
				throw new Error("parsing cassé");
			},
		);

		await expect(promise).rejects.toMatchObject({
			type: "handler_error",
			status: 500,
			detail: "parsing cassé",
		});
	});

	it("relance telle quelle une APIError levée par le handler", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("ok", { status: 200 })),
		);
		const original = new APIError({
			type: "custom_error",
			title: "Erreur métier",
			status: 422,
		});

		const promise = call(
			"https://example.test/resource",
			{ client_id: "id", client_secret: "secret" },
			async () => {
				throw original;
			},
		);

		await expect(promise).rejects.toBe(original);
	});
});
