import { describe, it, expect } from "vitest";
import { renderClasseClimat } from "../src/classe-climat/index.js";

const CLIMAT_COLORS = {
	A: "#A4DBF8",
	B: "#8CB4D3",
	C: "#7792B1",
	D: "#606F8F",
	E: "#4D5271",
	F: "#393551",
	G: "#281B35",
};

describe("renderClasseClimat", () => {
	it("contient la couleur correcte pour chaque étiquette", () => {
		for (const [value, color] of Object.entries(CLIMAT_COLORS)) {
			const result = renderClasseClimat({ value: value as any });
			expect(result).toContain(`background-color: ${color}`);
		}
	});

	it("taille par défaut est 32px", () => {
		const result = renderClasseClimat({ value: "A" });
		expect(result).toContain("width: 32px");
		expect(result).toContain("height: 32px");
	});
});
