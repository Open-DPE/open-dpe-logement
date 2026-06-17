import { afterEach, describe, expect, it } from "vitest";
import "../src/icon-energie/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-icon-energie";

const KNOWN_VALUES = [
  "electricite",
  "electricite_renouvelable",
  "gaz_naturel",
  "gpl",
  "fioul",
  "bois_buche",
  "bois_plaquette",
  "bois_granule",
  "charbon",
  "reseau_chaleur",
  "reseau_froid",
];

describe(TAG, () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rend du SVG pour chaque valeur connue", () => {
    for (const value of KNOWN_VALUES) {
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
    el.setAttribute("value", "inconnue");
    const { unmount } = mount(el);
    expect(shadow(el)).not.toContain("<path");
    unmount();
  });
});
