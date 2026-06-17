import { afterEach, describe, expect, it } from "vitest";
import "../src/classe-climat/index.js"; // importe aussi icon-etiquette
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-classe-climat";

const COLORS: Record<string, string> = {
  A: "#A4DBF8",
  B: "#8CB4D3",
  C: "#7792B1",
  D: "#606F8F",
  E: "#4D5271",
  F: "#393551",
  G: "#281B35",
};

describe(TAG, () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("cycle de vie DOM", () => {
    it("connectedCallback rend le composant avec value='A'", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "A");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de value", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "A");
      const { unmount } = mount(el);
      const htmlA = shadow(el);
      el.setAttribute("value", "G");
      expect(shadow(el)).not.toBe(htmlA);
      unmount();
    });

    it("value absente → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });

    it("value inconnue → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "Z");
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });
  });

  describe("mapping value → couleur de fond", () => {
    for (const [value, color] of Object.entries(COLORS)) {
      it(`value='${value}' → background-color ${color}`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain(color);
        unmount();
      });
    }
  });
});
