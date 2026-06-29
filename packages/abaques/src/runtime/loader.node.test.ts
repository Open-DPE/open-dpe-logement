import { describe, expect, it } from "vitest";
import { loadAsset } from "./loader.node.js";

describe("loadAsset (Node)", () => {
	it("charge un asset JSON existant relatif au package", async () => {
		const rows = await loadAsset("chauffage/combustion");
		expect(Array.isArray(rows)).toBe(true);
		expect((rows as unknown[]).length).toBeGreaterThan(0);
	});

	it("rejette si l'asset n'existe pas", async () => {
		await expect(loadAsset("inexistant/table")).rejects.toThrow();
	});
});
