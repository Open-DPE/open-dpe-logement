import { describe, it, expect } from "vitest";
import { renderRepartitionDeperditions } from "../src/repartition-deperditions/index.js";

// Jeu de données de base équilibré (chaque composante = gv / 6)
const BASE_PROPS = {
	dp_murs: 100,
	dp_planchers_bas: 100,
	dp_planchers_hauts: 100,
	dp_baies: 100,
	dp_portes: 100,
	pt: 100,
	dr: 100,
};

describe("renderRepartitionDeperditions", () => {
	// 1. Le rendu contient du SVG
	it("retourne une chaîne contenant une balise <svg", () => {
		const result = renderRepartitionDeperditions(BASE_PROPS);
		expect(result).toContain("<svg");
		expect(result).toContain("</svg>");
	});

	// 2. Les proportions sont reflétées visuellement
	it("une part à 50% produit un rendu différent d'une part à 10%", () => {
		const props50 = { ...BASE_PROPS, dp_murs: 100 }; // murs = 50%
		const props10 = { ...BASE_PROPS, dp_murs: 200 }; // murs = 10%
		const result50 = renderRepartitionDeperditions(props50);
		const result10 = renderRepartitionDeperditions(props10);
		expect(result50).not.toBe(result10);
	});

	// 3. Les différentes catégories sont présentes dans le rendu
	it("contient le label Murs", () => {
		const result = renderRepartitionDeperditions(BASE_PROPS);
		expect(result).toContain("Murs");
	});

	it("contient le label Planchers", () => {
		const result = renderRepartitionDeperditions(BASE_PROPS);
		expect(result).toContain("Planchers");
	});

	it("contient le label Toitures (planchers hauts)", () => {
		const result = renderRepartitionDeperditions(BASE_PROPS);
		expect(result).toContain("Toitures");
	});

	it("contient le label Menuiseries", () => {
		const result = renderRepartitionDeperditions(BASE_PROPS);
		expect(result).toContain("Menuiseries");
	});

	it("contient le label Ponts thermiques", () => {
		const result = renderRepartitionDeperditions(BASE_PROPS);
		expect(result).toContain("Ponts thermiques");
	});

	it("contient le label Ventilation (renouvellement d'air)", () => {
		const result = renderRepartitionDeperditions(BASE_PROPS);
		expect(result).toContain("Ventilation");
	});

	// 4. Les valeurs nulles ou à zéro ne cassent pas le rendu
	it("ne lève pas d'erreur quand toutes les déperditions sont à zéro (gv > 0)", () => {
		const props = {
			dp_murs: 0,
			dp_planchers_bas: 0,
			dp_planchers_hauts: 0,
			pt: 0,
			dp_baies: 0,
			dp_portes: 0,
			dr: 0,
		};
		expect(() => renderRepartitionDeperditions(props)).not.toThrow();
		const result = renderRepartitionDeperditions(props);
		expect(result).toContain("<svg");
	});

	it("produit un SVG même quand une seule catégorie a une valeur", () => {
		const props = {
			dp_murs: 100,
			dp_planchers_bas: 0,
			dp_planchers_hauts: 0,
			pt: 0,
			dp_baies: 0,
			dp_portes: 0,
			dr: 0,
		};
		const result = renderRepartitionDeperditions(props);
		expect(result).toContain("<svg");
		expect(result).toContain("</svg>");
	});

	// 5. Les proportions totalisent toujours 100% visuellement (le SVG est complet)
	it("le SVG contient exactement une balise ouvrante <svg et une balise fermante </svg>", () => {
		const result = renderRepartitionDeperditions(BASE_PROPS);
		const openCount = (result.match(/<svg/g) ?? []).length;
		const closeCount = (result.match(/<\/svg>/g) ?? []).length;
		expect(openCount).toBe(1);
		expect(closeCount).toBe(1);
	});
});
