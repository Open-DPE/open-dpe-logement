import { afterEach, describe, expect, it, vi } from "vitest";
import { APIError, call } from "../src/api.js";

function jsonResponse(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), { status });
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("call", () => {
	it("retourne le corps de la réponse en cas de succès (200)", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("<xml/>", { status: 200 })),
		);

		const result = await call("https://example.test/resource", {
			client_id: "id",
			client_secret: "secret",
		});

		expect(result).toBe("<xml/>");
	});

	it("transmet client_id et client_secret en headers", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response("ok", { status: 200 }));
		vi.stubGlobal("fetch", fetchMock);

		await call("https://example.test/resource", {
			client_id: "my-id",
			client_secret: "my-secret",
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = init.headers as Record<string, string>;
		expect(headers["client_id"]).toBe("my-id");
		expect(headers["client_secret"]).toBe("my-secret");
	});

	it("retourne null sur un 404 (ressource introuvable)", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
		);

		const result = await call("https://example.test/resource", {
			client_id: "id",
			client_secret: "secret",
		});

		expect(result).toBeNull();
	});

	it("lève une APIError avec le détail de errorDetails sur une erreur documentée", async () => {
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

		const promise = call("https://example.test/resource", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toBeInstanceOf(APIError);
		await expect(promise).rejects.toMatchObject({
			code: 401,
			reason: "UNAUTHORIZED",
			message: "client_id ou client_secret invalide",
		});
	});

	it("lève une APIError avec des valeurs par défaut si errorDetails est absent d'un corps JSON valide", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(500, {})));

		const promise = call("https://example.test/resource", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toMatchObject({
			code: 500,
			reason: "Unknown error",
			message: "Unknown error",
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

		const promise = call("https://example.test/resource", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toMatchObject({
			code: 502,
			reason: "malformed_error_response",
			message: "<html>Bad Gateway</html>",
		});
	});

	it("tronque le corps d'un malformed_error_response trop long", async () => {
		const hugeBody = "x".repeat(600);
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(hugeBody, { status: 502 })),
		);

		const promise = call("https://example.test/resource", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toMatchObject({
			reason: "malformed_error_response",
			message: `${"x".repeat(500)}...`,
		});
	});

	it("lève une APIError network_error si fetch rejette avec une Error", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValue(new Error("connection refused")),
		);

		const promise = call("https://example.test/resource", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toMatchObject({
			code: 500,
			reason: "network_error",
			message: "connection refused",
		});
	});

	it("lève une APIError network_error si fetch rejette avec une valeur non-Error", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue("boom"));

		const promise = call("https://example.test/resource", {
			client_id: "id",
			client_secret: "secret",
		});

		await expect(promise).rejects.toMatchObject({
			code: 500,
			reason: "network_error",
			message: "boom",
		});
	});

	it("lève une APIError timeout si la requête est abandonnée", async () => {
		const abortError = new DOMException(
			"The user aborted a request.",
			"AbortError",
		);
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));

		const promise = call("https://example.test/resource", {
			client_id: "id",
			client_secret: "secret",
			timeoutMs: 10,
		});

		await expect(promise).rejects.toMatchObject({
			code: 408,
			reason: "timeout",
			message: "Request timed out after 10ms",
		});
	});
});
