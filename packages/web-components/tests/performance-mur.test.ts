import { afterEach, describe, expect, it } from "vitest";
import "../src/performance-mur/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-performance-mur";

const A = "#2CAF85";
const B = "#A5CC74";
const C = "#F49838";
const D = "#E52322";

function html(u: number): string {
  const el = document.createElement(TAG);
  el.setAttribute("u", String(u));
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
      el.setAttribute("u", "0.2");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
      unmount();
    });

    it("attributeChangedCallback re-rend", () => {
      const el = document.createElement(TAG);
      el.setAttribute("u", "0.2");
      const { unmount } = mount(el);
      const before = shadow(el);
      el.setAttribute("u", "0.9");
      expect(shadow(el)).not.toBe(before);
      unmount();
    });

    it("u invalide → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      el.setAttribute("u", "invalide");
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });
  });

  describe("seuils — u", () => {
    it("u=0.1 → A", () => {
      expect(html(0.1)).toContain(A);
    });
    it("u=0.30 (frontière A/B) → A", () => {
      expect(html(0.3)).toContain(A);
      expect(html(0.3)).not.toContain(B);
    });
    it("u=0.31 → B", () => {
      expect(html(0.31)).toContain(B);
    });
    it("u=0.40 → B", () => {
      expect(html(0.4)).toContain(B);
    });
    it("u=0.45 (frontière B/C) → B", () => {
      expect(html(0.45)).toContain(B);
      expect(html(0.45)).not.toContain(C);
    });
    it("u=0.46 → C", () => {
      expect(html(0.46)).toContain(C);
    });
    it("u=0.55 → C", () => {
      expect(html(0.55)).toContain(C);
    });
    it("u=0.65 (frontière C/D) → C", () => {
      expect(html(0.65)).toContain(C);
      expect(html(0.65)).not.toContain(D);
    });
    it("u=0.66 → D", () => {
      expect(html(0.66)).toContain(D);
    });
    it("u=1.0 → D", () => {
      expect(html(1.0)).toContain(D);
    });
  });
});
