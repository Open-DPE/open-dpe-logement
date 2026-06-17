import { afterEach, describe, expect, it } from "vitest";
import "../src/performance-plancher-bas/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-performance-plancher-bas";

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
    it("u=0.25 (frontière A/B) → A", () => {
      expect(html(0.25)).toContain(A);
      expect(html(0.25)).not.toContain(B);
    });
    it("u=0.26 → B", () => {
      expect(html(0.26)).toContain(B);
    });
    it("u=0.35 → B", () => {
      expect(html(0.35)).toContain(B);
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
