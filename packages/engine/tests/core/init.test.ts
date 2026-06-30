import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
	vi.resetModules();
});

describe("engine init()", () => {
	it("délègue à l'init() d'abaques et est idempotent", async () => {
		const initAbaques = vi.fn(async () => undefined);
		vi.doMock("@open-dpe-logement/abaques", () => ({ init: initAbaques }));

		const { init } = await import("../../src/core/init.js");
		await Promise.all([init(), init(), init()]);

		expect(initAbaques).toHaveBeenCalledTimes(1);
	});
});
