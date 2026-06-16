import { describe, it, expect } from "vitest";
import { renderConfortEte } from "../src/confort-ete/index.js";
import { CONFORT_ETE_COLORS } from "../src/shared/colors.js";

describe("renderConfortEte", () => {
	it("valeur 1 (Bon) → couleur verte #2CAF85", () => {
		const result = renderConfortEte({ value: 1 });
		expect(result).toContain(CONFORT_ETE_COLORS[1]);
	});

	it("valeur 2 (Moyen) → couleur jaune #A5CC74", () => {
		const result = renderConfortEte({ value: 2 });
		expect(result).toContain(CONFORT_ETE_COLORS[2]);
	});

	it("valeur 3 (Insuffisant) → couleur orange #F49838", () => {
		const result = renderConfortEte({ value: 3 });
		expect(result).toContain(CONFORT_ETE_COLORS[3]);
	});

	it("affiche le libellé dans le rendu", () => {
		const result = renderConfortEte({ value: 1 });
		expect(result).toContain("Bon");
	});

	it("valeur inconnue → couleur fallback #000000", () => {
		const result = renderConfortEte({ value: 99 as any });
		expect(result).toContain("#000000");
	});
});
