# Web Components — Plan de tests v2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réécrire la suite de tests de `packages/web-components` pour la nouvelle architecture (classes héritant de `BaseComponent`, `BaseIcon`, `BaseIllustration`, `BasePerformance`). Tous les tests passent par le DOM jsdom.

**Architecture:** Un fichier de test par composant dans `tests/`, avec un helper partagé `tests/helpers.ts`. Pattern : `createElement → setAttribute → mount (appendChild) → assert shadowRoot.innerHTML`. Couverture exhaustive sur les composants à logique réglementaire, smoke tests pour les illustrations et icônes.

**Tech Stack:** Vitest, jsdom (déjà configuré dans `vitest.config.ts`), TypeScript ESM

---

## Cartographie des fichiers

| Créer | Responsabilité |
|---|---|
| `tests/helpers.ts` | `mount()` + `shadow()` partagés |
| `tests/performance-enveloppe.test.ts` | Seuils `ubat` [0.45, 0.65, 0.85] + cycle vie |
| `tests/performance-mur.test.ts` | Seuils `u` [0.30, 0.45, 0.65] + cycle vie |
| `tests/performance-menuiserie.test.ts` | Seuils `u` [1.6, 2.2, 3.0] + cycle vie |
| `tests/performance-plancher-bas.test.ts` | Seuils `u` [0.25, 0.45, 0.65] + cycle vie |
| `tests/performance-plancher-haut.test.ts` | 3 configs × seuils × frontières + cycle vie |
| `tests/classe-energie.test.ts` | Mapping A-G → couleur + cycle vie |
| `tests/classe-climat.test.ts` | Mapping A-G → couleur + cycle vie |
| `tests/repartition-deperditions.test.ts` | 7 attrs numériques + NaN + percent |
| `tests/enum.test.ts` | Mapping name+value → textContent |
| `tests/etiquette-energie.test.ts` | Smoke : rendu non-vide par valeur A-G |
| `tests/etiquette-climat.test.ts` | Smoke : rendu non-vide par valeur A-G |
| `tests/confort-ete.test.ts` | Smoke + mapping A/B/C → couleur |
| `tests/icon.test.ts` | Smoke passoire/enveloppe + valeur inconnue |
| `tests/icon-energie.test.ts` | Smoke valeur connue + valeur inconnue |
| `tests/icon-etiquette.test.ts` | Smoke valeur A + valeur inconnue |
| `tests/icon-confort-ete.test.ts` | Smoke valeur 1/2/3 + valeur inconnue |
| `tests/icon-usage.test.ts` | Smoke valeur connue + valeur inconnue |

---

## Commande de test

```bash
cd packages/web-components && npm test
```

Sortie attendue (suite verte) : `X passed | 0 failed`

---

## Couleurs de référence

```
PERFORMANCE_COLORS : A="#2CAF85"  B="#A5CC74"  C="#F49838"  D="#E52322"
CONFORT_ETE_COLORS : A="#2CAF85"  B="#F49838"  C="#E52322"
ETIQUETTE_ENERGIE  : A="#00A06D"  B="#52B153"  C="#A5CC74"  D="#F4E70F"  E="#F0B40F"  F="#EB8235"  G="#D7221F"
ETIQUETTE_CLIMAT   : A="#A4DBF8"  B="#8CB4D3"  C="#7792B1"  D="#606F8F"  E="#4D5271"  F="#393551"  G="#281B35"
```

---

## Task 1 : Helpers partagés

**Fichiers :**
- Créer : `packages/web-components/tests/helpers.ts`

- [ ] **Écrire le fichier**

```typescript
// tests/helpers.ts
export function mount(el: HTMLElement): { el: HTMLElement; unmount: () => void } {
  document.body.appendChild(el);
  return {
    el,
    unmount: () => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    },
  };
}

export function shadow(el: HTMLElement): string {
  return el.shadowRoot?.innerHTML ?? "";
}
```

- [ ] **Vérifier que le fichier est syntaxiquement valide** (pas de test à lancer pour ce fichier seul)

---

## Task 2 : performance-enveloppe

**Fichiers :**
- Créer : `packages/web-components/tests/performance-enveloppe.test.ts`

Seuils : `ubat ≤ 0.45 → A`, `≤ 0.65 → B`, `≤ 0.85 → C`, `> 0.85 → D`

- [ ] **Écrire le fichier**

```typescript
// tests/performance-enveloppe.test.ts
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
    it("ubat=0.2 → A", () => { expect(html(0.2)).toContain(A); });
    it("ubat=0.45 (frontière A/B) → A", () => {
      expect(html(0.45)).toContain(A);
      expect(html(0.45)).not.toContain(B);
    });
    it("ubat=0.46 → B", () => { expect(html(0.46)).toContain(B); });
    it("ubat=0.55 → B", () => { expect(html(0.55)).toContain(B); });
    it("ubat=0.65 (frontière B/C) → B", () => {
      expect(html(0.65)).toContain(B);
      expect(html(0.65)).not.toContain(C);
    });
    it("ubat=0.66 → C", () => { expect(html(0.66)).toContain(C); });
    it("ubat=0.75 → C", () => { expect(html(0.75)).toContain(C); });
    it("ubat=0.85 (frontière C/D) → C", () => {
      expect(html(0.85)).toContain(C);
      expect(html(0.85)).not.toContain(D);
    });
    it("ubat=0.86 → D", () => { expect(html(0.86)).toContain(D); });
    it("ubat=1.5 → D", () => { expect(html(1.5)).toContain(D); });
  });

  describe("texte affiché", () => {
    it("ubat=0.45 → affiche '0.45'", () => { expect(html(0.45)).toContain("0.45"); });
    it("ubat=0.3 → affiche '0.30'", () => { expect(html(0.3)).toContain("0.30"); });
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

Attendu : tous les tests de ce fichier PASS

- [ ] **Committer**

```bash
git add packages/web-components/tests/helpers.ts packages/web-components/tests/performance-enveloppe.test.ts
git commit -m "test(web-components): performance-enveloppe — seuils ubat + cycle vie DOM"
```

---

## Task 3 : performance-mur

**Fichiers :**
- Créer : `packages/web-components/tests/performance-mur.test.ts`

Seuils : `u ≤ 0.30 → A`, `≤ 0.45 → B`, `≤ 0.65 → C`, `> 0.65 → D`

- [ ] **Écrire le fichier**

```typescript
// tests/performance-mur.test.ts
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
  afterEach(() => { document.body.innerHTML = ""; });

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
    it("u=0.1 → A", () => { expect(html(0.1)).toContain(A); });
    it("u=0.30 (frontière A/B) → A", () => {
      expect(html(0.30)).toContain(A);
      expect(html(0.30)).not.toContain(B);
    });
    it("u=0.31 → B", () => { expect(html(0.31)).toContain(B); });
    it("u=0.40 → B", () => { expect(html(0.40)).toContain(B); });
    it("u=0.45 (frontière B/C) → B", () => {
      expect(html(0.45)).toContain(B);
      expect(html(0.45)).not.toContain(C);
    });
    it("u=0.46 → C", () => { expect(html(0.46)).toContain(C); });
    it("u=0.55 → C", () => { expect(html(0.55)).toContain(C); });
    it("u=0.65 (frontière C/D) → C", () => {
      expect(html(0.65)).toContain(C);
      expect(html(0.65)).not.toContain(D);
    });
    it("u=0.66 → D", () => { expect(html(0.66)).toContain(D); });
    it("u=1.0 → D", () => { expect(html(1.0)).toContain(D); });
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

Attendu : PASS

- [ ] **Committer**

```bash
git add packages/web-components/tests/performance-mur.test.ts
git commit -m "test(web-components): performance-mur — seuils u + cycle vie DOM"
```

---

## Task 4 : performance-menuiserie

**Fichiers :**
- Créer : `packages/web-components/tests/performance-menuiserie.test.ts`

Seuils : `u ≤ 1.6 → A`, `≤ 2.2 → B`, `≤ 3.0 → C`, `> 3.0 → D`

- [ ] **Écrire le fichier**

```typescript
// tests/performance-menuiserie.test.ts
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
  afterEach(() => { document.body.innerHTML = ""; });

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
    it("u=1.0 → A", () => { expect(html(1.0)).toContain(A); });
    it("u=1.6 (frontière A/B) → A", () => {
      expect(html(1.6)).toContain(A);
      expect(html(1.6)).not.toContain(B);
    });
    it("u=1.7 → B", () => { expect(html(1.7)).toContain(B); });
    it("u=2.0 → B", () => { expect(html(2.0)).toContain(B); });
    it("u=2.2 (frontière B/C) → B", () => {
      expect(html(2.2)).toContain(B);
      expect(html(2.2)).not.toContain(C);
    });
    it("u=2.3 → C", () => { expect(html(2.3)).toContain(C); });
    it("u=2.7 → C", () => { expect(html(2.7)).toContain(C); });
    it("u=3.0 (frontière C/D) → C", () => {
      expect(html(3.0)).toContain(C);
      expect(html(3.0)).not.toContain(D);
    });
    it("u=3.1 → D", () => { expect(html(3.1)).toContain(D); });
    it("u=5.0 → D", () => { expect(html(5.0)).toContain(D); });
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/performance-menuiserie.test.ts
git commit -m "test(web-components): performance-menuiserie — seuils u + cycle vie DOM"
```

---

## Task 5 : performance-plancher-bas

**Fichiers :**
- Créer : `packages/web-components/tests/performance-plancher-bas.test.ts`

Seuils : `u ≤ 0.25 → A`, `≤ 0.45 → B`, `≤ 0.65 → C`, `> 0.65 → D`

- [ ] **Écrire le fichier**

```typescript
// tests/performance-plancher-bas.test.ts
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
  afterEach(() => { document.body.innerHTML = ""; });

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
    it("u=0.1 → A", () => { expect(html(0.1)).toContain(A); });
    it("u=0.25 (frontière A/B) → A", () => {
      expect(html(0.25)).toContain(A);
      expect(html(0.25)).not.toContain(B);
    });
    it("u=0.26 → B", () => { expect(html(0.26)).toContain(B); });
    it("u=0.35 → B", () => { expect(html(0.35)).toContain(B); });
    it("u=0.45 (frontière B/C) → B", () => {
      expect(html(0.45)).toContain(B);
      expect(html(0.45)).not.toContain(C);
    });
    it("u=0.46 → C", () => { expect(html(0.46)).toContain(C); });
    it("u=0.55 → C", () => { expect(html(0.55)).toContain(C); });
    it("u=0.65 (frontière C/D) → C", () => {
      expect(html(0.65)).toContain(C);
      expect(html(0.65)).not.toContain(D);
    });
    it("u=0.66 → D", () => { expect(html(0.66)).toContain(D); });
    it("u=1.0 → D", () => { expect(html(1.0)).toContain(D); });
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/performance-plancher-bas.test.ts
git commit -m "test(web-components): performance-plancher-bas — seuils u + cycle vie DOM"
```

---

## Task 6 : performance-plancher-haut

**Fichiers :**
- Créer : `packages/web-components/tests/performance-plancher-haut.test.ts`

3 configurations, chacune avec ses propres seuils :
- `plancher`  : ≤0.15 → A, ≤0.20 → B, ≤0.30 → C, >0.30 → D
- `rampants`  : ≤0.18 → A, ≤0.25 → B, ≤0.35 → C, >0.35 → D
- `terrasse`  : ≤0.25 → A, ≤0.45 → B, ≤0.65 → C, >0.65 → D

- [ ] **Écrire le fichier**

```typescript
// tests/performance-plancher-haut.test.ts
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
  afterEach(() => { document.body.innerHTML = ""; });

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
    it("u=0.10 → A", () => { expect(html("plancher", 0.10)).toContain(A); });
    it("u=0.15 (frontière A/B) → A", () => {
      expect(html("plancher", 0.15)).toContain(A);
      expect(html("plancher", 0.15)).not.toContain(B);
    });
    it("u=0.16 → B", () => { expect(html("plancher", 0.16)).toContain(B); });
    it("u=0.18 → B", () => { expect(html("plancher", 0.18)).toContain(B); });
    it("u=0.20 (frontière B/C) → B", () => {
      expect(html("plancher", 0.20)).toContain(B);
      expect(html("plancher", 0.20)).not.toContain(C);
    });
    it("u=0.25 → C", () => { expect(html("plancher", 0.25)).toContain(C); });
    it("u=0.30 (frontière C/D) → C", () => {
      expect(html("plancher", 0.30)).toContain(C);
      expect(html("plancher", 0.30)).not.toContain(D);
    });
    it("u=0.31 → D", () => { expect(html("plancher", 0.31)).toContain(D); });
    it("u=0.50 → D", () => { expect(html("plancher", 0.50)).toContain(D); });
  });

  describe("configuration: rampants (seuils 0.18 / 0.25 / 0.35)", () => {
    it("u=0.10 → A", () => { expect(html("rampants", 0.10)).toContain(A); });
    it("u=0.18 (frontière A/B) → A", () => {
      expect(html("rampants", 0.18)).toContain(A);
      expect(html("rampants", 0.18)).not.toContain(B);
    });
    it("u=0.19 → B", () => { expect(html("rampants", 0.19)).toContain(B); });
    it("u=0.25 (frontière B/C) → B", () => {
      expect(html("rampants", 0.25)).toContain(B);
      expect(html("rampants", 0.25)).not.toContain(C);
    });
    it("u=0.30 → C", () => { expect(html("rampants", 0.30)).toContain(C); });
    it("u=0.35 (frontière C/D) → C", () => {
      expect(html("rampants", 0.35)).toContain(C);
      expect(html("rampants", 0.35)).not.toContain(D);
    });
    it("u=0.36 → D", () => { expect(html("rampants", 0.36)).toContain(D); });
    it("u=0.50 → D", () => { expect(html("rampants", 0.50)).toContain(D); });
  });

  describe("configuration: terrasse (seuils 0.25 / 0.45 / 0.65)", () => {
    it("u=0.10 → A", () => { expect(html("terrasse", 0.10)).toContain(A); });
    it("u=0.25 (frontière A/B) → A", () => {
      expect(html("terrasse", 0.25)).toContain(A);
      expect(html("terrasse", 0.25)).not.toContain(B);
    });
    it("u=0.26 → B", () => { expect(html("terrasse", 0.26)).toContain(B); });
    it("u=0.35 → B", () => { expect(html("terrasse", 0.35)).toContain(B); });
    it("u=0.45 (frontière B/C) → B", () => {
      expect(html("terrasse", 0.45)).toContain(B);
      expect(html("terrasse", 0.45)).not.toContain(C);
    });
    it("u=0.55 → C", () => { expect(html("terrasse", 0.55)).toContain(C); });
    it("u=0.65 (frontière C/D) → C", () => {
      expect(html("terrasse", 0.65)).toContain(C);
      expect(html("terrasse", 0.65)).not.toContain(D);
    });
    it("u=0.66 → D", () => { expect(html("terrasse", 0.66)).toContain(D); });
    it("u=0.90 → D", () => { expect(html("terrasse", 0.90)).toContain(D); });
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/performance-plancher-haut.test.ts
git commit -m "test(web-components): performance-plancher-haut — 3 configs × seuils × frontières"
```

---

## Task 7 : classe-energie

**Fichiers :**
- Créer : `packages/web-components/tests/classe-energie.test.ts`

`classe-energie/index.ts` importe déjà `icon-etiquette` → pas besoin de l'importer séparément.

- [ ] **Écrire le fichier**

```typescript
// tests/classe-energie.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/classe-energie/index.js"; // importe aussi icon-etiquette
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-classe-energie";

// Couleurs ETIQUETTE_ENERGIE_COLORS
const COLORS: Record<string, string> = {
  A: "#00A06D",
  B: "#52B153",
  C: "#A5CC74",
  D: "#F4E70F",
  E: "#F0B40F",
  F: "#EB8235",
  G: "#D7221F",
};

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("cycle de vie DOM", () => {
    it("connectedCallback rend le composant avec value='A'", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "A");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de value", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "A");
      const { unmount } = mount(el);
      const htmlA = shadow(el);
      el.setAttribute("value", "G");
      expect(shadow(el)).not.toBe(htmlA);
      unmount();
    });

    it("value absente → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });

    it("value inconnue → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "Z");
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });
  });

  describe("mapping value → couleur de fond", () => {
    for (const [value, color] of Object.entries(COLORS)) {
      it(`value='${value}' → background-color ${color}`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain(color);
        unmount();
      });
    }
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/classe-energie.test.ts
git commit -m "test(web-components): classe-energie — mapping A-G → couleur + cycle vie DOM"
```

---

## Task 8 : classe-climat

**Fichiers :**
- Créer : `packages/web-components/tests/classe-climat.test.ts`

- [ ] **Écrire le fichier**

```typescript
// tests/classe-climat.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/classe-climat/index.js"; // importe aussi icon-etiquette
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-classe-climat";

// Couleurs ETIQUETTE_CLIMAT_COLORS
const COLORS: Record<string, string> = {
  A: "#A4DBF8",
  B: "#8CB4D3",
  C: "#7792B1",
  D: "#606F8F",
  E: "#4D5271",
  F: "#393551",
  G: "#281B35",
};

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("cycle de vie DOM", () => {
    it("connectedCallback rend le composant avec value='A'", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "A");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de value", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "A");
      const { unmount } = mount(el);
      const htmlA = shadow(el);
      el.setAttribute("value", "G");
      expect(shadow(el)).not.toBe(htmlA);
      unmount();
    });

    it("value absente → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });

    it("value inconnue → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "Z");
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });
  });

  describe("mapping value → couleur de fond", () => {
    for (const [value, color] of Object.entries(COLORS)) {
      it(`value='${value}' → background-color ${color}`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain(color);
        unmount();
      });
    }
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/classe-climat.test.ts
git commit -m "test(web-components): classe-climat — mapping A-G → couleur + cycle vie DOM"
```

---

## Task 9 : repartition-deperditions

**Fichiers :**
- Créer : `packages/web-components/tests/repartition-deperditions.test.ts`

7 attributs numériques : `dp_murs`, `dp_planchers_bas`, `dp_planchers_hauts`, `dp_baies`, `dp_portes`, `pt`, `dr`. Attribut booléen : `percent`.

- [ ] **Écrire le fichier**

```typescript
// tests/repartition-deperditions.test.ts
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
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("cycle de vie DOM", () => {
    it("connectedCallback rend le composant avec attributs valides", () => {
      const el = makeEl(VALID_ATTRS);
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
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

  describe("attribut invalide → shadowRoot vide", () => {
    const invalids = [
      "dp_murs", "dp_planchers_bas", "dp_planchers_hauts",
      "dp_baies", "dp_portes", "pt", "dr",
    ];
    for (const attr of invalids) {
      it(`${attr}='invalide' → shadowRoot vide`, () => {
        const attrs = { ...VALID_ATTRS, [attr]: "invalide" };
        const el = makeEl(attrs);
        const { unmount } = mount(el);
        expect(shadow(el)).toBe("");
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
      const el = makeEl({ ...VALID_ATTRS, dp_murs: 50 });
      el.setAttribute("percent", "");
      const { unmount } = mount(el);
      expect(shadow(el)).toContain("%");
      expect(shadow(el)).not.toContain("W/K");
      unmount();
    });
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/repartition-deperditions.test.ts
git commit -m "test(web-components): repartition-deperditions — 7 attrs + NaN + percent"
```

---

## Task 10 : enum

**Fichiers :**
- Créer : `packages/web-components/tests/enum.test.ts`

`Enum` n'utilise pas Shadow DOM : il pose `this.textContent`. Assertions sur `el.textContent`.

- [ ] **Écrire le fichier**

```typescript
// tests/enum.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/enum/index.js";
import { mount } from "./helpers.js";

const TAG = "open-dpe-logement-enum";

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

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
      ["confort-ete", "1", "Bon"],
      ["confort-ete", "2", "Moyen"],
      ["confort-ete", "3", "Insuffisant"],
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
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/enum.test.ts
git commit -m "test(web-components): enum — mappings domaine/valeur + cas invalides"
```

---

## Task 11 : etiquette-energie (smoke)

**Fichiers :**
- Créer : `packages/web-components/tests/etiquette-energie.test.ts`

- [ ] **Écrire le fichier**

```typescript
// tests/etiquette-energie.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/etiquette-energie/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-etiquette-energie";

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rend du contenu SVG pour chaque valeur", () => {
    for (const value of ["A", "B", "C", "D", "E", "F", "G"]) {
      it(`value='${value}' → shadowRoot contient <svg`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain("<svg");
        unmount();
      });
    }
  });

  it("value inconnue → shadowRoot vide (aucun SVG)", () => {
    const el = document.createElement(TAG);
    el.setAttribute("value", "Z");
    const { unmount } = mount(el);
    expect(shadow(el)).not.toContain("<path");
    unmount();
  });

  it("attributeChangedCallback re-rend lors d'un changement de value", () => {
    const el = document.createElement(TAG);
    el.setAttribute("value", "A");
    const { unmount } = mount(el);
    const htmlA = shadow(el);
    el.setAttribute("value", "G");
    expect(shadow(el)).not.toBe(htmlA);
    unmount();
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/etiquette-energie.test.ts
git commit -m "test(web-components): etiquette-energie — smoke A-G + valeur inconnue"
```

---

## Task 12 : etiquette-climat (smoke)

**Fichiers :**
- Créer : `packages/web-components/tests/etiquette-climat.test.ts`

- [ ] **Écrire le fichier**

```typescript
// tests/etiquette-climat.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/etiquette-climat/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-etiquette-climat";

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rend du contenu SVG pour chaque valeur", () => {
    for (const value of ["A", "B", "C", "D", "E", "F", "G"]) {
      it(`value='${value}' → shadowRoot contient <svg`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain("<svg");
        unmount();
      });
    }
  });

  it("value inconnue → shadowRoot vide (aucun SVG de contenu)", () => {
    const el = document.createElement(TAG);
    el.setAttribute("value", "Z");
    const { unmount } = mount(el);
    expect(shadow(el)).not.toContain("<path");
    unmount();
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/etiquette-climat.test.ts
git commit -m "test(web-components): etiquette-climat — smoke A-G + valeur inconnue"
```

---

## Task 13 : confort-ete

**Fichiers :**
- Créer : `packages/web-components/tests/confort-ete.test.ts`

`ConfortEte` appelle `getName("icon-confort-ete")` qui lève une erreur si l'icône n'est pas enregistrée. Il faut importer `icon-confort-ete` **explicitement** car `confort-ete/index.ts` ne le fait pas.

- [ ] **Écrire le fichier**

```typescript
// tests/confort-ete.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/confort-ete/index.js";
import "../src/icon-confort-ete/index.js"; // nécessaire : ConfortEte appelle getName("icon-confort-ete")
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-confort-ete";

const COLORS: Record<string, string> = {
  A: "#2CAF85",
  B: "#F49838",
  C: "#E52322",
};

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("cycle de vie DOM", () => {
    it("connectedCallback rend le composant avec value='A'", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "A");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toBe("");
      unmount();
    });

    it("attributeChangedCallback re-rend lors d'un changement de value", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "A");
      const { unmount } = mount(el);
      const before = shadow(el);
      el.setAttribute("value", "C");
      expect(shadow(el)).not.toBe(before);
      unmount();
    });

    it("value absente → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });

    it("value inconnue → shadowRoot vide", () => {
      const el = document.createElement(TAG);
      el.setAttribute("value", "Z");
      const { unmount } = mount(el);
      expect(shadow(el)).toBe("");
      unmount();
    });
  });

  describe("mapping value → couleur de fond", () => {
    for (const [value, color] of Object.entries(COLORS)) {
      it(`value='${value}' → background-color ${color}`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain(color);
        unmount();
      });
    }
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/confort-ete.test.ts
git commit -m "test(web-components): confort-ete — mapping A/B/C → couleur + cycle vie DOM"
```

---

## Task 14 : icon

**Fichiers :**
- Créer : `packages/web-components/tests/icon.test.ts`

Valeurs valides : `passoire`, `enveloppe`. Attributs supplémentaires : `size`, `color`.

- [ ] **Écrire le fichier**

```typescript
// tests/icon.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/icon/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-icon";

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rendu pour chaque icône connue", () => {
    for (const name of ["passoire", "enveloppe"]) {
      it(`name='${name}' → shadowRoot contient <svg`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("name", name);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain("<svg");
        unmount();
      });
    }
  });

  describe("cas invalides", () => {
    it("name absent → shadowRoot vide (aucun path)", () => {
      const el = document.createElement(TAG);
      const { unmount } = mount(el);
      expect(shadow(el)).not.toContain("<path");
      unmount();
    });

    it("name inconnu → shadowRoot vide (aucun path)", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "inconnu");
      const { unmount } = mount(el);
      expect(shadow(el)).not.toContain("<path");
      unmount();
    });
  });

  describe("attributs size et color", () => {
    it("size=48 → CSS variable --icon-size: 48px", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "passoire");
      el.setAttribute("size", "48");
      const { unmount } = mount(el);
      expect(el.style.getPropertyValue("--icon-size")).toBe("48px");
      unmount();
    });

    it("color=#FF0000 → CSS variable --icon-color: #FF0000", () => {
      const el = document.createElement(TAG);
      el.setAttribute("name", "passoire");
      el.setAttribute("color", "#FF0000");
      const { unmount } = mount(el);
      expect(el.style.getPropertyValue("--icon-color")).toBe("#FF0000");
      unmount();
    });
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/icon.test.ts
git commit -m "test(web-components): icon — smoke passoire/enveloppe + size/color + invalide"
```

---

## Task 15 : icon-energie

**Fichiers :**
- Créer : `packages/web-components/tests/icon-energie.test.ts`

- [ ] **Écrire le fichier**

```typescript
// tests/icon-energie.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/icon-energie/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-icon-energie";

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rend du SVG pour une valeur connue", () => {
    const known = [
      "electricite", "electricite_renouvelable", "gaz_naturel", "gpl",
      "fioul", "bois_buche", "bois_plaquette", "bois_granule",
      "charbon", "reseau_chaleur", "reseau_froid",
    ];
    for (const value of known) {
      it(`value='${value}' → shadowRoot contient <path`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain("<path");
        unmount();
      });
    }
  });

  it("value inconnue → shadowRoot sans <path de contenu", () => {
    const el = document.createElement(TAG);
    el.setAttribute("value", "inconnue");
    const { unmount } = mount(el);
    // Le SVG est rendu mais sans path de contenu (content() retourne "")
    expect(shadow(el)).not.toContain("<path d=");
    unmount();
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/icon-energie.test.ts
git commit -m "test(web-components): icon-energie — smoke toutes valeurs + valeur inconnue"
```

---

## Task 16 : icon-etiquette

**Fichiers :**
- Créer : `packages/web-components/tests/icon-etiquette.test.ts`

- [ ] **Écrire le fichier**

```typescript
// tests/icon-etiquette.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/icon-etiquette/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-icon-etiquette";

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

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

  it("value inconnue → shadowRoot sans <path de contenu", () => {
    const el = document.createElement(TAG);
    el.setAttribute("value", "Z");
    const { unmount } = mount(el);
    expect(shadow(el)).not.toContain("<path d=");
    unmount();
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/icon-etiquette.test.ts
git commit -m "test(web-components): icon-etiquette — smoke A-G + valeur inconnue"
```

---

## Task 17 : icon-confort-ete

**Fichiers :**
- Créer : `packages/web-components/tests/icon-confort-ete.test.ts`

- [ ] **Écrire le fichier**

```typescript
// tests/icon-confort-ete.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/icon-confort-ete/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-icon-confort-ete";

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rend du SVG pour chaque valeur 1/2/3", () => {
    for (const value of ["1", "2", "3"]) {
      it(`value='${value}' → shadowRoot contient <path`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain("<path");
        unmount();
      });
    }
  });

  it("value inconnue → shadowRoot sans <path de contenu", () => {
    const el = document.createElement(TAG);
    el.setAttribute("value", "4");
    const { unmount } = mount(el);
    expect(shadow(el)).not.toContain("<path d=");
    unmount();
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer**

```bash
git add packages/web-components/tests/icon-confort-ete.test.ts
git commit -m "test(web-components): icon-confort-ete — smoke 1/2/3 + valeur inconnue"
```

---

## Task 18 : icon-usage

**Fichiers :**
- Créer : `packages/web-components/tests/icon-usage.test.ts`

- [ ] **Écrire le fichier**

```typescript
// tests/icon-usage.test.ts
import { afterEach, describe, expect, it } from "vitest";
import "../src/icon-usage/index.js";
import { mount, shadow } from "./helpers.js";

const TAG = "open-dpe-logement-icon-usage";

describe(TAG, () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("enregistré dans customElements", () => {
    expect(customElements.get(TAG)).toBeDefined();
  });

  describe("smoke : rend du SVG pour chaque valeur connue", () => {
    const known = ["chauffage", "ecs", "refroidissement", "eclairage", "auxiliaire"];
    for (const value of known) {
      it(`value='${value}' → shadowRoot contient <path`, () => {
        const el = document.createElement(TAG);
        el.setAttribute("value", value);
        const { unmount } = mount(el);
        expect(shadow(el)).toContain("<path");
        unmount();
      });
    }
  });

  it("value inconnue → shadowRoot sans <path de contenu", () => {
    const el = document.createElement(TAG);
    el.setAttribute("value", "inconnue");
    const { unmount } = mount(el);
    expect(shadow(el)).not.toContain("<path d=");
    unmount();
  });
});
```

- [ ] **Lancer les tests**

```bash
cd packages/web-components && npm test -- --reporter=verbose
```

- [ ] **Committer final**

```bash
git add packages/web-components/tests/icon-usage.test.ts
git commit -m "test(web-components): icon-usage — smoke toutes valeurs + valeur inconnue"
```

---

## Vérification finale

- [ ] **Lancer la suite complète depuis la racine**

```bash
npx turbo test --filter=@open-dpe-logement/web-components
```

Attendu : tous les tests PASS, 0 failed.
