import { afterEach, describe, expect, it } from "vitest";
import "../src/confort-ete/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-confort-ete";

const COLORS: Record<string, string> = {
  "bon": "#2CAF85",
  "moyen": "#F49838",
  "insuffisant": "#E52322",
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
      el.setAttribute("value", "bon");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de value", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "moyen");
      const { unmount } = mount(el);
      const before = shadow(el);
      el.setAttribute("value", "insuffisant");
      expect(shadow(el)).not.toBe(before);
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
