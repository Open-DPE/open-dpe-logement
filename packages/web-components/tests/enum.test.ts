import { describe, it, expect } from "vitest";
import { renderEnum } from "../src/enum/index.js";

describe("renderEnum", () => {
  it("retourne le libellé correct pour un couple clé/valeur connu", () => {
    const result = renderEnum("scenario", "conventionnel");
    expect(result).toContain("Scénario conventionnel");
  });

  it("retourne le libellé correct pour une énergie connue", () => {
    const result = renderEnum("energie", "electricite");
    expect(result).toContain("Électricité");
  });

  it("retourne '-' pour une clé inconnue", () => {
    const result = renderEnum("inexistant" as any, "valeur");
    expect(result).toContain("-");
  });

  it("encapsule le résultat dans un <span>", () => {
    const result = renderEnum("etiquette", "A");
    expect(result).toMatch(/^<span>.*<\/span>$/);
  });

  it("retourne le libellé de zone climatique", () => {
    const result = renderEnum("zone-climatique", "H2d");
    expect(result).toContain("H2d");
  });

  it("retourne le libellé de type de bâtiment", () => {
    const result = renderEnum("type-batiment", "maison");
    expect(result).toContain("Maison individuelle");
  });

  it("retourne le libellé scénario dépensier", () => {
    const result = renderEnum("scenario", "depensier");
    expect(result).toContain("Scénario dépensier");
  });

  it("retourne '-' pour une valeur inconnue dans une clé existante", () => {
    const result = renderEnum("scenario", "inconnu" as any);
    expect(result).toContain("-");
    expect(result).not.toContain("undefined");
  });
});
