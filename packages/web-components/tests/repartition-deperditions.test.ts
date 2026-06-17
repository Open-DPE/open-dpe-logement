import { afterEach, describe, expect, it } from "vitest";
import "../src/repartition-deperditions/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-repartition-deperditions";

function makeEl(attrs: Record<string, string | number>): HTMLElement {
  const el = document.createElement(TAG);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el;
}

const VALID_ATTRS = {
  dp_murs: 100,
  dp_planchers_bas: 80,
  dp_planchers_hauts: 60,
  dp_baies: 40,
  dp_portes: 10,
  pt: 30,
  dr: 20,
};

describe(TAG, () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("cycle de vie DOM", () => {
    it("connectedCallback rend le composant avec attributs valides", () => {
      const el = makeEl(VALID_ATTRS);
      const { unmount } = mount(el);
      expect(shadow(el)).toContain("<text");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de dp_murs", () => {
      const el = makeEl(VALID_ATTRS);
      const { unmount } = mount(el);
      const before = shadow(el);
      el.setAttribute("dp_murs", "200");
      expect(shadow(el)).not.toBe(before);
      unmount();
    });
  });

  describe("attribut invalide → aucune donnée affichée", () => {
    const invalids = [
      "dp_murs",
      "dp_planchers_bas",
      "dp_planchers_hauts",
      "dp_baies",
      "dp_portes",
      "pt",
      "dr",
    ];
    for (const attr of invalids) {
      it(`${attr}='invalide' → pas de libellés W/K`, () => {
        const attrs = { ...VALID_ATTRS, [attr]: "invalide" };
        const el = makeEl(attrs);
        const { unmount } = mount(el);
        expect(shadow(el)).not.toContain("W/K");
        unmount();
      });
    }
  });

  describe("affichage des valeurs (mode W/K)", () => {
    it("dp_murs=100 → affiche '100 W/K'", () => {
      const el = makeEl(VALID_ATTRS);
      const { unmount } = mount(el);
      expect(shadow(el)).toContain("100 W/K");
      unmount();
    });

    it("dr=20 → affiche '20 W/K'", () => {
      const el = makeEl(VALID_ATTRS);
      const { unmount } = mount(el);
      expect(shadow(el)).toContain("20 W/K");
      unmount();
    });

    it("dp_baies + dp_portes fusionnés dans Menuiseries", () => {
      const el = makeEl({ ...VALID_ATTRS, dp_baies: 30, dp_portes: 10 });
      const { unmount } = mount(el);
      // dp_menuiseries = 30 + 10 = 40
      expect(shadow(el)).toContain("40 W/K");
      unmount();
    });
  });

  describe("attribut percent", () => {
    it("sans percent → affiche 'W/K'", () => {
      const el = makeEl(VALID_ATTRS);
      const { unmount } = mount(el);
      expect(shadow(el)).toContain("W/K");
      unmount();
    });

    it("avec percent → affiche '%' et non 'W/K'", () => {
      const el = makeEl(VALID_ATTRS);
      el.setAttribute("percent", "");
      const { unmount } = mount(el);
      expect(shadow(el)).toContain("%");
      expect(shadow(el)).not.toContain("W/K");
      unmount();
    });
  });
});
