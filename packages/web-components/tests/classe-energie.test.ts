import { describe, it, expect } from "vitest";
import { renderClasseEnergie } from "../src/classe-energie/index.js";

const ENERGIE_COLORS = {
	A: "#00A06D",
	B: "#52B153",
	C: "#A5CC74",
	D: "#F4E70F",
	E: "#F0B40F",
	F: "#EB8235",
	G: "#D7221F",
};

describe("renderClasseEnergie", () => {
	it("contient la couleur correcte pour chaque étiquette", () => {
		for (const [value, color] of Object.entries(ENERGIE_COLORS)) {
			const result = renderClasseEnergie({ value: value as any });
			expect(result).toContain(`background-color: ${color}`);
		}
	});

	it("taille par défaut est 32px", () => {
		const result = renderClasseEnergie({ value: "A" });
		expect(result).toContain("width: 32px");
		expect(result).toContain("height: 32px");
	});

	it("accepte une taille personnalisée", () => {
		const result = renderClasseEnergie({ value: "A", size: 64 });
		expect(result).toContain("width: 64px");
		expect(result).toContain("height: 64px");
	});

	it("contient le SVG de la lettre", () => {
		const result = renderClasseEnergie({ value: "A" });
		expect(result).toContain("<svg");
	});
});
