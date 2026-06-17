import { afterEach, describe, expect, it } from "vitest";
import "../src/performance-plancher-haut/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-performance-plancher-haut";

const A = "#2CAF85";
const B = "#A5CC74";
const C = "#F49838";
const D = "#E52322";

function html(configuration: string, u: number): string {
  const el = document.createElement(TAG);
  el.setAttribute("configuration", configuration);
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
      el.setAttribute("configuration", "plancher");
      el.setAttribute("u", "0.1");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de u", () => {
      const el = document.createElement(TAG);
      el.setAttribute("configuration", "plancher");
      el.setAttribute("u", "0.1");
      const { unmount } = mount(el);
      const before = shadow(el);
      el.setAttribute("u", "0.5");
      expect(shadow(el)).not.toBe(before);
      unmount();
    });

    it("configuration invalide → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      el.setAttribute("configuration", "inconnu");
      el.setAttribute("u", "0.1");
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });

    it("u invalide → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      el.setAttribute("configuration", "plancher");
      el.setAttribute("u", "invalide");
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });
  });

  describe("configuration: plancher (seuils 0.15 / 0.20 / 0.30)", () => {
    it("u=0.10 → A", () => {
      expect(html("plancher", 0.1)).toContain(A);
    });
    it("u=0.15 (frontière A/B) → A", () => {
      expect(html("plancher", 0.15)).toContain(A);
      expect(html("plancher", 0.15)).not.toContain(B);
    });
    it("u=0.16 → B", () => {
      expect(html("plancher", 0.16)).toContain(B);
    });
    it("u=0.18 → B", () => {
      expect(html("plancher", 0.18)).toContain(B);
    });
    it("u=0.20 (frontière B/C) → B", () => {
      expect(html("plancher", 0.2)).toContain(B);
      expect(html("plancher", 0.2)).not.toContain(C);
    });
    it("u=0.25 → C", () => {
      expect(html("plancher", 0.25)).toContain(C);
    });
    it("u=0.30 (frontière C/D) → C", () => {
      expect(html("plancher", 0.3)).toContain(C);
      expect(html("plancher", 0.3)).not.toContain(D);
    });
    it("u=0.31 → D", () => {
      expect(html("plancher", 0.31)).toContain(D);
    });
    it("u=0.50 → D", () => {
      expect(html("plancher", 0.5)).toContain(D);
    });
  });

  describe("configuration: rampants (seuils 0.18 / 0.25 / 0.35)", () => {
    it("u=0.10 → A", () => {
      expect(html("rampants", 0.1)).toContain(A);
    });
    it("u=0.18 (frontière A/B) → A", () => {
      expect(html("rampants", 0.18)).toContain(A);
      expect(html("rampants", 0.18)).not.toContain(B);
    });
    it("u=0.19 → B", () => {
      expect(html("rampants", 0.19)).toContain(B);
    });
    it("u=0.25 (frontière B/C) → B", () => {
      expect(html("rampants", 0.25)).toContain(B);
      expect(html("rampants", 0.25)).not.toContain(C);
    });
    it("u=0.30 → C", () => {
      expect(html("rampants", 0.3)).toContain(C);
    });
    it("u=0.35 (frontière C/D) → C", () => {
      expect(html("rampants", 0.35)).toContain(C);
      expect(html("rampants", 0.35)).not.toContain(D);
    });
    it("u=0.36 → D", () => {
      expect(html("rampants", 0.36)).toContain(D);
    });
    it("u=0.50 → D", () => {
      expect(html("rampants", 0.5)).toContain(D);
    });
  });

  describe("configuration: terrasse (seuils 0.25 / 0.45 / 0.65)", () => {
    it("u=0.10 → A", () => {
      expect(html("terrasse", 0.1)).toContain(A);
    });
    it("u=0.25 (frontière A/B) → A", () => {
      expect(html("terrasse", 0.25)).toContain(A);
      expect(html("terrasse", 0.25)).not.toContain(B);
    });
    it("u=0.26 → B", () => {
      expect(html("terrasse", 0.26)).toContain(B);
    });
    it("u=0.35 → B", () => {
      expect(html("terrasse", 0.35)).toContain(B);
    });
    it("u=0.45 (frontière B/C) → B", () => {
      expect(html("terrasse", 0.45)).toContain(B);
      expect(html("terrasse", 0.45)).not.toContain(C);
    });
    it("u=0.55 → C", () => {
      expect(html("terrasse", 0.55)).toContain(C);
    });
    it("u=0.65 (frontière C/D) → C", () => {
      expect(html("terrasse", 0.65)).toContain(C);
      expect(html("terrasse", 0.65)).not.toContain(D);
    });
    it("u=0.66 → D", () => {
      expect(html("terrasse", 0.66)).toContain(D);
    });
    it("u=0.90 → D", () => {
      expect(html("terrasse", 0.9)).toContain(D);
    });
  });
});
