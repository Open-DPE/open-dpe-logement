import { describe, it, expect } from "vitest";
import { renderEtiquetteClimat } from "../src/etiquette-climat/index.js";

const CLIMAT_COLORS = {
  A: "#A4DBF8", B: "#8CB4D3", C: "#7792B1", D: "#606F8F",
  E: "#4D5271", F: "#393551", G: "#281B35",
};

describe("renderEtiquetteClimat", () => {
  it("retourne un SVG pleine largeur pour chaque étiquette", () => {
    for (const value of ["A", "B", "C", "D", "E", "F", "G"] as const) {
      const result = renderEtiquetteClimat({ value });
      expect(result).toContain('width="100%"');
      expect(result).toContain('viewBox="0 0 234 276"');
    }
  });

  it("chaque étiquette contient sa propre couleur dans le SVG mis en avant", () => {
    for (const [value, color] of Object.entries(CLIMAT_COLORS)) {
      const result = renderEtiquetteClimat({ value: value as any });
      expect(result).toContain(color);
    }
  });

  it("chaque étiquette produit un SVG différent", () => {
    const svgs = (["A", "B", "C", "D", "E", "F", "G"] as const).map(
      (v) => renderEtiquetteClimat({ value: v }),
    );
    const unique = new Set(svgs);
    expect(unique.size).toBe(7);
  });
});
