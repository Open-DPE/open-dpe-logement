import { afterEach, describe, expect, it } from "vitest";
import "../src/icon/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-icon";

describe(TAG, () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rendu pour chaque icône connue", () => {
    for (const name of ["passoire", "enveloppe"]) {
      it(`name='${name}' → shadowRoot contient <path`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("name", name);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain("<path");
        unmount();
      });
    }
  });

  describe("cas invalides", () => {
    it("name absent → shadowRoot sans <path", () => {
      const el = document.createElement(TAG);
      const { unmount } = mount(el);
      expect(shadow(el)).not.toContain("<path");
      unmount();
    });

    it("name inconnu → shadowRoot sans <path", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "inconnu");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toContain("<path");
      unmount();
    });
  });

  describe("attributs size et color", () => {
    it("size=48 → CSS variable --icon-size: 48px", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "passoire");
      el.setAttribute("size", "48");
      const { unmount } = mount(el);
      expect(el.style.getPropertyValue("--icon-size")).toBe("48px");
      unmount();
    });

    it("color=#FF0000 → CSS variable --icon-color: #FF0000", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "passoire");
      el.setAttribute("color", "#FF0000");
      const { unmount } = mount(el);
      expect(el.style.getPropertyValue("--icon-color")).toBe("#FF0000");
      unmount();
    });
  });
});
