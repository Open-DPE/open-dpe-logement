import { afterEach, describe, expect, it } from "vitest";
import "../src/performance-enveloppe/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-performance-enveloppe";

const A = "#2CAF85";
const B = "#A5CC74";
const C = "#F49838";
const D = "#E52322";

function html(ubat: number): string {
  const el = document.createElement(TAG);
  el.setAttribute("ubat", String(ubat));
  const { unmount } = mount(el);
  const h = shadow(el);
  unmount();
  return h;
}

describe(TAG, () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("cycle de vie DOM", () => {
    it("connectedCallback rend le composant", () => {
      const el = document.createElement(TAG);
      el.setAttribute("ubat", "0.3");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de ubat", () => {
      const el = document.createElement(TAG);
      el.setAttribute("ubat", "0.3");
      const { unmount } = mount(el);
      const before = shadow(el);
      el.setAttribute("ubat", "0.9");
      expect(shadow(el)).not.toBe(before);
      unmount();
    });

    it("ubat invalide → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      el.setAttribute("ubat", "invalide");
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });
  });

  describe("seuils — ubat", () => {
    it("ubat=0.2 → A", () => {
      expect(html(0.2)).toContain(A);
    });
    it("ubat=0.45 (frontière A/B) → A", () => {
      expect(html(0.45)).toContain(A);
      expect(html(0.45)).not.toContain(B);
    });
    it("ubat=0.46 → B", () => {
      expect(html(0.46)).toContain(B);
    });
    it("ubat=0.55 → B", () => {
      expect(html(0.55)).toContain(B);
    });
    it("ubat=0.65 (frontière B/C) → B", () => {
      expect(html(0.65)).toContain(B);
      expect(html(0.65)).not.toContain(C);
    });
    it("ubat=0.66 → C", () => {
      expect(html(0.66)).toContain(C);
    });
    it("ubat=0.75 → C", () => {
      expect(html(0.75)).toContain(C);
    });
    it("ubat=0.85 (frontière C/D) → C", () => {
      expect(html(0.85)).toContain(C);
      expect(html(0.85)).not.toContain(D);
    });
    it("ubat=0.86 → D", () => {
      expect(html(0.86)).toContain(D);
    });
    it("ubat=1.5 → D", () => {
      expect(html(1.5)).toContain(D);
    });
  });

  describe("texte affiché", () => {
    it("ubat=0.45 → affiche '0.45'", () => {
      expect(html(0.45)).toContain("0.45");
    });
    it("ubat=0.3 → affiche '0.30'", () => {
      expect(html(0.3)).toContain("0.30");
    });
  });
});
