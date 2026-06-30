import { describe, expect, it, beforeEach, vi } from "vitest";

describe("cache", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("getTable lève une erreur avant init()", async () => {
		const { getTable, registerTable } = await import("../src/runtime/cache.js");
		registerTable("dummy/table");
		expect(() => getTable("dummy/table")).toThrow('"dummy/table"');
	});

	it("init() charge toutes les tables enregistrées, puis getTable les retourne", async () => {
		vi.doMock("./loader.node.js", () => ({
			loadAsset: vi.fn(async (key: string) => [{ key }]),
		}));
		const { getTable, registerTable, init } = await import("../src/runtime/cache.js");
		registerTable("a/table");
		registerTable("b/table");

		await init();

		expect(getTable("a/table")).toEqual([{ key: "a/table" }]);
		expect(getTable("b/table")).toEqual([{ key: "b/table" }]);
	});

	it("init() est idempotent (un seul chargement même appelé plusieurs fois)", async () => {
		const loadAsset = vi.fn(async (key: string) => [{ key }]);
		vi.doMock("./loader.node.js", () => ({ loadAsset }));
		const { registerTable, init } = await import("../src/runtime/cache.js");
		registerTable("a/table");

		await Promise.all([init(), init(), init()]);

		expect(loadAsset).toHaveBeenCalledTimes(1);
	});
});
