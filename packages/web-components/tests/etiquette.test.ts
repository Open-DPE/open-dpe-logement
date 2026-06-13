import { describe, it, expect } from "vitest";
import { renderEtiquette } from "../src/etiquette/index.js";

describe("renderEtiquette", () => {
  it("retourne un SVG pour chaque étiquette", () => {
    const etiquettes = ["A", "B", "C", "D", "E", "F", "G"] as const;
    for (const value of etiquettes) {
      const result = renderEtiquette({ value });
      expect(result).toContain("<svg");
      expect(result).toContain("</svg>");
    }
  });

  it("chaque étiquette produit un contenu SVG différent", () => {
    const A = renderEtiquette({ value: "A" });
    const B = renderEtiquette({ value: "B" });
    const G = renderEtiquette({ value: "G" });
    expect(A).not.toBe(B);
    expect(B).not.toBe(G);
    expect(A).not.toBe(G);
  });

  it("couleur par défaut est blanche", () => {
    const result = renderEtiquette({ value: "A" });
    expect(result).toContain('fill="#FFFFFF"');
  });

  it("accepte une couleur personnalisée", () => {
    const result = renderEtiquette({ value: "A", color: "#FF0000" });
    expect(result).toContain('fill="#FF0000"');
  });

  it("accepte une taille personnalisée", () => {
    const result = renderEtiquette({ value: "A", size: 32 });
    expect(result).toContain('width="32"');
  });

  it("retourne un SVG vide (sans path) pour une valeur inconnue", () => {
    const result = renderEtiquette({ value: "Z" as any });
    expect(result).toContain("<svg");
    expect(result).not.toContain("<path");
  });
});
