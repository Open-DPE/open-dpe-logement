import { describe, it, expect } from "vitest";
import { renderIcon, renderChips } from "../../src/shared/utils.js";

describe("renderIcon", () => {
  it("intègre le content dans le SVG", () => {
    const result = renderIcon({ content: "<path d='M0 0'/>" });
    expect(result).toContain("<path d='M0 0'/>");
    expect(result).toContain("<svg");
  });

  it("utilise la taille par défaut 24", () => {
    const result = renderIcon({ content: "" });
    expect(result).toContain('width="24"');
    expect(result).toContain('height="24"');
  });

  it("utilise la couleur par défaut #000000", () => {
    const result = renderIcon({ content: "" });
    expect(result).toContain('fill="#000000"');
  });

  it("accepte une taille personnalisée", () => {
    const result = renderIcon({ content: "", size: 48 });
    expect(result).toContain('width="48"');
    expect(result).toContain('height="48"');
  });

  it("accepte une couleur personnalisée", () => {
    const result = renderIcon({ content: "", color: "#FF0000" });
    expect(result).toContain('fill="#FF0000"');
  });

  it("accepte un style personnalisé", () => {
    const result = renderIcon({ content: "", style: "display:block;" });
    expect(result).toContain('style="display:block;"');
  });
});

describe("renderChips", () => {
  it("affiche le texte", () => {
    const result = renderChips({ text: "Bon", color: "#00FF00", textColor: "#000000" });
    expect(result).toContain("Bon");
  });

  it("applique la couleur de fond", () => {
    const result = renderChips({ text: "X", color: "#ABCDEF", textColor: "#000000" });
    expect(result).toContain("background-color: #ABCDEF");
  });

  it("applique la couleur du texte", () => {
    const result = renderChips({ text: "X", color: "#000", textColor: "#FFFFFF" });
    expect(result).toContain("color: #FFFFFF");
  });

  it("accepte un style additionnel", () => {
    const result = renderChips({ text: "X", color: "#000", textColor: "#FFF", style: "margin:0;" });
    expect(result).toContain("margin:0;");
  });
});
