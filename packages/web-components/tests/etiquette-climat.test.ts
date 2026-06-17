import { afterEach, describe, expect, it } from "vitest";
import "../src/etiquette-climat/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-etiquette-climat";

describe(TAG, () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rend du contenu SVG pour chaque valeur", () => {
    for (const value of ["A", "B", "C", "D", "E", "F", "G"]) {
      it(`value='${value}' → shadowRoot contient <path`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain("<path");
        unmount();
      });
    }
  });

  it("value inconnue → shadowRoot sans <path de contenu", () => {
    const el = document.createElement(TAG);
    el.setAttribute("value", "Z");
    const { unmount } = mount(el);
    expect(shadow(el)).not.toContain("<path");
    unmount();
  });
});
