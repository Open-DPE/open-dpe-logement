import { afterEach, describe, expect, it } from "vitest";
import "../src/enum/index.js";
import { mount } from "./helpers.js";

const TAG = "open-dpe-logement-enum";

describe(TAG, () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("cycle de vie DOM", () => {
    it("connectedCallback rend la valeur après mount", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "usage");
      el.setAttribute("value", "chauffage");
      const { unmount } = mount(el);
      expect(el.textContent).toBe("Chauffage");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de value", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "usage");
      el.setAttribute("value", "chauffage");
      const { unmount } = mount(el);
      el.setAttribute("value", "ecs");
      expect(el.textContent).toBe("Eau chaude sanitaire");
      unmount();
    });
  });

  describe("mappings par domaine", () => {
    const cases: [string, string, string][] = [
      ["usage", "chauffage", "Chauffage"],
      ["usage", "ecs", "Eau chaude sanitaire"],
      ["usage", "refroidissement", "Refroidissement"],
      ["usage", "eclairage", "Éclairage"],
      ["usage", "auxiliaire", "Auxiliaire"],
      ["etiquette", "A", "A"],
      ["etiquette", "G", "G"],
      ["confort-ete", "bon", "Bon"],
      ["confort-ete", "moyen", "Moyen"],
      ["confort-ete", "insuffisant", "Insuffisant"],
      ["type-batiment", "maison", "Maison individuelle"],
      ["energie", "electricite", "Électricité"],
    ];

    for (const [name, value, expected] of cases) {
      it(`name='${name}' value='${value}' → '${expected}'`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("name", name);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(el.textContent).toBe(expected);
        unmount();
      });
    }
  });

  describe("cas invalides", () => {
    it("value='null' → affiche '-'", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "usage");
      el.setAttribute("value", "null");
      const { unmount } = mount(el);
      expect(el.textContent).toBe("-");
      unmount();
    });

    it("name inconnu → textContent inchangé (vide)", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "inconnu");
      el.setAttribute("value", "foo");
      const { unmount } = mount(el);
      expect(el.textContent).toBe("");
      unmount();
    });

    it("value inconnue dans un name valide → textContent inchangé (vide)", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "usage");
      el.setAttribute("value", "inconnue");
      const { unmount } = mount(el);
      expect(el.textContent).toBe("");
      unmount();
    });
  });
});
