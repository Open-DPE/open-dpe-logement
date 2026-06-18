import { afterEach, describe, expect, it } from "vitest";
import "../src/confort-ete/index.js";
import "../src/icon-confort-ete/index.js"; // ConfortEte appelle getName("icon-confort-ete") — doit être enregistré
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-confort-ete";

const COLORS: Record<string, string> = {
  "1": "#2CAF85",
  "2": "#F49838",
  "3": "#E52322",
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
      el.setAttribute("value", "1");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de value", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "2");
      const { unmount } = mount(el);
      const before = shadow(el);
      el.setAttribute("value", "3");
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
