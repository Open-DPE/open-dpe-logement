import { afterEach, describe, expect, it } from "vitest";
import "../src/performance-menuiserie/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-performance-menuiserie";

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
      el.setAttribute("u", "1.2");
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
    it("u=1.0 → A", () => {
      expect(html(1.0)).toContain(A);
    });
    it("u=1.6 (frontière A/B) → A", () => {
      expect(html(1.6)).toContain(A);
      expect(html(1.6)).not.toContain(B);
    });
    it("u=1.7 → B", () => {
      expect(html(1.7)).toContain(B);
    });
    it("u=2.0 → B", () => {
      expect(html(2.0)).toContain(B);
    });
    it("u=2.2 (frontière B/C) → B", () => {
      expect(html(2.2)).toContain(B);
      expect(html(2.2)).not.toContain(C);
    });
    it("u=2.3 → C", () => {
      expect(html(2.3)).toContain(C);
    });
    it("u=2.7 → C", () => {
      expect(html(2.7)).toContain(C);
    });
    it("u=3.0 (frontière C/D) → C", () => {
      expect(html(3.0)).toContain(C);
      expect(html(3.0)).not.toContain(D);
    });
    it("u=3.1 → D", () => {
      expect(html(3.1)).toContain(D);
    });
    it("u=5.0 → D", () => {
      expect(html(5.0)).toContain(D);
    });
  });
});
