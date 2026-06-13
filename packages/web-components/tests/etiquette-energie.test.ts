import { describe, it, expect } from "vitest";
import { renderEtiquetteEnergie } from "../src/etiquette-energie/index.js";

const ENERGIE_COLORS = {
  A: "#00A06D", B: "#52B153", C: "#A5CC74", D: "#F4E70F",
  E: "#F0B40F", F: "#EB8235", G: "#D7221F",
};

describe("renderEtiquetteEnergie", () => {
  it("retourne un SVG pleine largeur pour chaque étiquette", () => {
    for (const value of ["A", "B", "C", "D", "E", "F", "G"] as const) {
      const result = renderEtiquetteEnergie({ value });
      expect(result).toContain('width="100%"');
      expect(result).toContain('viewBox="0 0 234 276"');
    }
  });

  it("chaque étiquette contient sa propre couleur dans le SVG mis en avant", () => {
    for (const [value, color] of Object.entries(ENERGIE_COLORS)) {
      const result = renderEtiquetteEnergie({ value: value as any });
      expect(result).toContain(color);
    }
  });

  it("chaque étiquette produit un SVG différent", () => {
    const svgs = (["A", "B", "C", "D", "E", "F", "G"] as const).map(
      (v) => renderEtiquetteEnergie({ value: v }),
    );
    const unique = new Set(svgs);
    expect(unique.size).toBe(7);
  });

  it("retourne un SVG vide (sans path) pour une valeur inconnue", () => {
    const result = renderEtiquetteEnergie({ value: "Z" as any });
    expect(result).toContain("<svg");
    expect(result.length).toBeLessThan(100);
  });
});
