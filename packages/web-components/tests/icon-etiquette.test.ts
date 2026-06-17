import { afterEach, describe, expect, it } from "vitest";
import "../src/icon-etiquette/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-icon-etiquette";

describe(TAG, () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rend du SVG pour chaque valeur A-G", () => {
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

  it("value inconnue → shadowRoot sans <path", () => {
    const el = document.createElement(TAG);
    el.setAttribute("value", "Z");
    const { unmount } = mount(el);
    expect(shadow(el)).not.toContain("<path");
    unmount();
  });
});
