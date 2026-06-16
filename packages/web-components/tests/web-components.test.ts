/**
 * Tests de cycle de vie des Web Components dans jsdom.
 *
 * jsdom supporte customElements.define() mais le déclenchement de
 * connectedCallback() nécessite une insertion réelle dans document.body.
 *
 * Pattern général :
 *   1. createElement() → élément créé, pas encore connecté
 *   2. setAttribute() → attributs positionnés avant insertion
 *   3. document.body.appendChild() → déclenche connectedCallback()
 *   4. Vérification de innerHTML
 *   5. Nettoyage via document.body.removeChild()
 */

import { describe, it, expect, afterEach } from "vitest";

// Import des composants pour déclencher leur enregistrement via customElements.define()
import "../src/classe-energie/index.js";
import "../src/etiquette/index.js";
import "../src/performance-enveloppe/index.js";
import "../src/repartition-deperditions/index.js";

// Utilitaire : insère un élément dans le DOM, retourne l'élément et une fonction de nettoyage
function mount(element: HTMLElement): { el: HTMLElement; unmount: () => void } {
	document.body.appendChild(element);
	return {
		el: element,
		unmount: () => {
			if (element.parentNode) {
				element.parentNode.removeChild(element);
			}
		},
	};
}

// ─── open-dpe-logement-classe-energie ──────────────────────────────────────────────────

describe("open-dpe-logement-classe-energie (cycle de vie DOM)", () => {
	afterEach(() => {
		// Nettoyage résiduel au cas où un test échoue avant unmount
		document.body.innerHTML = "";
	});

	it("l'élément custom est enregistré dans le registre customElements", () => {
		expect(customElements.get("open-dpe-logement-classe-energie")).toBeDefined();
	});

	it("l'élément est rendu dès setAttribute (attributeChangedCallback hors DOM)", () => {
		// jsdom déclenche attributeChangedCallback même sans connexion au DOM.
		// On vérifie que l'élément produit bien du HTML après setAttribute.
		const el = document.createElement("open-dpe-logement-classe-energie");
		el.setAttribute("value", "A");
		expect(el.innerHTML).not.toBe("");
	});

	it("après appendChild, innerHTML n'est plus vide avec value='A'", () => {
		const el = document.createElement("open-dpe-logement-classe-energie");
		el.setAttribute("value", "A");
		const { unmount } = mount(el);
		expect(el.innerHTML).not.toBe("");
		unmount();
	});

	it("le rendu contient une balise <svg après connexion", () => {
		const el = document.createElement("open-dpe-logement-classe-energie");
		el.setAttribute("value", "B");
		const { unmount } = mount(el);
		expect(el.innerHTML).toContain("<svg");
		unmount();
	});

	it("attributeChangedCallback re-rend lors d'un changement de value", () => {
		const el = document.createElement("open-dpe-logement-classe-energie");
		el.setAttribute("value", "A");
		const { unmount } = mount(el);
		const htmlA = el.innerHTML;

		el.setAttribute("value", "G");
		const htmlG = el.innerHTML;

		expect(htmlA).not.toBe(htmlG);
		unmount();
	});
});

// ─── open-dpe-logement-etiquette ───────────────────────────────────────────────────────

describe("open-dpe-logement-etiquette (cycle de vie DOM)", () => {
	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("l'élément custom est enregistré dans le registre customElements", () => {
		expect(customElements.get("open-dpe-logement-etiquette")).toBeDefined();
	});

	it("l'élément est rendu dès setAttribute (attributeChangedCallback hors DOM)", () => {
		// jsdom déclenche attributeChangedCallback même sans connexion au DOM.
		// On vérifie que l'élément produit bien du HTML après setAttribute.
		const el = document.createElement("open-dpe-logement-etiquette");
		el.setAttribute("value", "C");
		expect(el.innerHTML).not.toBe("");
	});

	it("après appendChild, innerHTML contient du SVG avec value='C'", () => {
		const el = document.createElement("open-dpe-logement-etiquette");
		el.setAttribute("value", "C");
		const { unmount } = mount(el);
		expect(el.innerHTML).toContain("<svg");
		unmount();
	});

	it("l'attribut color est pris en compte dans le rendu", () => {
		const el = document.createElement("open-dpe-logement-etiquette");
		el.setAttribute("value", "D");
		el.setAttribute("color", "#FF0000");
		const { unmount } = mount(el);
		expect(el.innerHTML).toContain("#FF0000");
		unmount();
	});

	it("attributeChangedCallback re-rend lors d'un changement de value", () => {
		const el = document.createElement("open-dpe-logement-etiquette");
		el.setAttribute("value", "A");
		const { unmount } = mount(el);
		const htmlA = el.innerHTML;

		el.setAttribute("value", "F");
		expect(el.innerHTML).not.toBe(htmlA);
		unmount();
	});
});

// ─── open-dpe-logement-performance-enveloppe ──────────────────────────────────────────

describe("open-dpe-logement-performance-enveloppe (cycle de vie DOM)", () => {
	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("l'élément custom est enregistré dans le registre customElements", () => {
		expect(customElements.get("open-dpe-logement-performance-enveloppe")).toBeDefined();
	});

	it("l'élément est rendu dès setAttribute (attributeChangedCallback hors DOM)", () => {
		// jsdom déclenche attributeChangedCallback même sans connexion au DOM.
		// On vérifie que l'élément produit bien du HTML après setAttribute.
		const el = document.createElement("open-dpe-logement-performance-enveloppe");
		el.setAttribute("ubat", "0.3");
		expect(el.innerHTML).not.toBe("");
	});

	it("après appendChild, innerHTML n'est plus vide avec ubat='0.3'", () => {
		const el = document.createElement("open-dpe-logement-performance-enveloppe");
		el.setAttribute("ubat", "0.3");
		const { unmount } = mount(el);
		expect(el.innerHTML).not.toBe("");
		unmount();
	});

	it("le rendu contient la valeur ubat formatée", () => {
		const el = document.createElement("open-dpe-logement-performance-enveloppe");
		el.setAttribute("ubat", "0.55");
		const { unmount } = mount(el);
		expect(el.innerHTML).toContain((0.55).toFixed(2));
		unmount();
	});

	it("attributeChangedCallback re-rend lors d'un changement de ubat", () => {
		const el = document.createElement("open-dpe-logement-performance-enveloppe");
		el.setAttribute("ubat", "0.3");
		const { unmount } = mount(el);
		const html1 = el.innerHTML;

		el.setAttribute("ubat", "1.0");
		expect(el.innerHTML).not.toBe(html1);
		unmount();
	});
});

// ─── open-dpe-logement-repartition-deperditions ───────────────────────────────────────

describe("open-dpe-logement-repartition-deperditions (cycle de vie DOM)", () => {
	const BASE_ATTRS = {
		gv: "600",
		dp_murs: "100",
		dp_planchers_bas: "100",
		dp_planchers_hauts: "100",
		dp_ponts_thermiques: "100",
		dp_menuiseries: "100",
		dr: "100",
	};

	function createWithAttrs(attrs: Record<string, string>): HTMLElement {
		const el = document.createElement("open-dpe-logement-repartition-deperditions");
		for (const [key, value] of Object.entries(attrs)) {
			el.setAttribute(key, value);
		}
		return el;
	}

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("l'élément custom est enregistré dans le registre customElements", () => {
		expect(
			customElements.get("open-dpe-logement-repartition-deperditions"),
		).toBeDefined();
	});

	it("l'élément est rendu dès setAttribute (attributeChangedCallback hors DOM)", () => {
		// jsdom déclenche attributeChangedCallback même sans connexion au DOM.
		// On vérifie que l'élément produit bien du HTML après setAttribute.
		const el = createWithAttrs(BASE_ATTRS);
		expect(el.innerHTML).not.toBe("");
	});

	it("après appendChild, innerHTML contient un SVG", () => {
		const el = createWithAttrs(BASE_ATTRS);
		const { unmount } = mount(el);
		expect(el.innerHTML).toContain("<svg");
		expect(el.innerHTML).toContain("</svg>");
		unmount();
	});

	it("le rendu contient les labels de toutes les catégories", () => {
		const el = createWithAttrs(BASE_ATTRS);
		const { unmount } = mount(el);
		expect(el.innerHTML).toContain("Murs");
		expect(el.innerHTML).toContain("Planchers");
		expect(el.innerHTML).toContain("Toitures");
		expect(el.innerHTML).toContain("Menuiseries");
		expect(el.innerHTML).toContain("Ponts thermiques");
		expect(el.innerHTML).toContain("Ventilation");
		unmount();
	});

	it("attributeChangedCallback re-rend lors d'un changement de valeur", () => {
		const el = createWithAttrs(BASE_ATTRS);
		const { unmount } = mount(el);
		const html1 = el.innerHTML;

		el.setAttribute("dp_murs", "1200");
		expect(el.innerHTML).not.toBe(html1);
		unmount();
	});
});
