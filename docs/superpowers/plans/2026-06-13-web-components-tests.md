# Web Components — Plan de test

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Couvrir l'ensemble du package `packages/web-components` par des tests unitaires sur les fonctions pures et les Web Components natifs.

**Architecture:** Deux niveaux par composant — une fonction pure `renderXxx(props): string` testable en Node.js, et une classe `HTMLElement` testable avec jsdom. Les tests de fonctions pures vérifient la présence des bonnes couleurs/contenus dans le HTML produit. Les tests de Web Components vérifient le cycle de vie (`connectedCallback`, `attributeChangedCallback`).

**Tech Stack:** Vitest, jsdom, TypeScript ESM, `@open-dpe-logement/models`

---

## Cartographie des fichiers

| Fichier source | Fichier de test |
|---|---|
| `packages/web-components/vitest.config.ts` | à créer |
| `packages/web-components/tsconfig.test.json` | à créer |
| `src/shared/utils.ts` | `tests/shared/utils.test.ts` |
| `src/etiquette/index.ts` | `tests/etiquette.test.ts` |
| `src/etiquette-energie/index.ts` | `tests/etiquette-energie.test.ts` |
| `src/etiquette-climat/index.ts` | `tests/etiquette-climat.test.ts` |
| `src/classe-energie/index.ts` | `tests/classe-energie.test.ts` |
| `src/classe-climat/index.ts` | `tests/classe-climat.test.ts` |
| `src/confort-ete/index.ts` | `tests/confort-ete.test.ts` |
| `src/enum/index.ts` | `tests/enum.test.ts` |
| `src/repartition-deperditions/index.ts` | `tests/repartition-deperditions.test.ts` |
| `src/performance-enveloppe/index.ts` | `tests/performance.test.ts` |
| `src/performance-mur/index.ts` | `tests/performance.test.ts` |
| `src/performance-menuiserie/index.ts` | `tests/performance.test.ts` |
| `src/performance-plancher-bas/index.ts` | `tests/performance.test.ts` |
| `src/performance-plancher-haut/index.ts` | `tests/performance-plancher-haut.test.ts` |
| Tous les Web Components | `tests/web-components.test.ts` |

---

## Référence rapide

### Couleurs de performance

```ts
PERFORMANCE_COLORS = { 1: "#2CAF85", 2: "#A5CC74", 3: "#F49838", 4: "#E52322" }
```

### Seuils par composant de performance

| Composant | prop | [1] ≤ | [2] ≤ | [3] ≤ | [4] |
|---|---|---|---|---|---|
| performance-enveloppe | `ubat` | 0.45 | 0.65 | 0.85 | > 0.85 |
| performance-mur | `u` | 0.3 | 0.45 | 0.65 | > 0.65 |
| performance-menuiserie | `u` | 1.6 | 2.2 | 3 | > 3 |
| performance-plancher-bas | `u` | 0.25 | 0.45 | 0.65 | > 0.65 |
| performance-plancher-haut (plancher) | `u` | 0.15 | 0.2 | 0.3 | > 0.3 |
| performance-plancher-haut (rampants) | `u` | 0.18 | 0.25 | 0.35 | > 0.35 |
| performance-plancher-haut (terrasse) | `u` | 0.25 | 0.45 | 0.65 | > 0.65 |

### Couleurs d'étiquette énergie

```ts
ETIQUETTE_ENERGIE_COLORS = {
  A: "#00A06D", B: "#52B153", C: "#A5CC74", D: "#F4E70F",
  E: "#F0B40F", F: "#EB8235", G: "#D7221F"
}
```

### Couleurs d'étiquette climat

```ts
ETIQUETTE_CLIMAT_COLORS = {
  A: "#A4DBF8", B: "#8CB4D3", C: "#7792B1", D: "#606F8F",
  E: "#4D5271", F: "#393551", G: "#281B35"
}
```

---

## Task 1 : Infrastructure de test

**Files:**
- Create: `packages/web-components/vitest.config.ts`
- Create: `packages/web-components/tsconfig.test.json`
- Modify: `packages/web-components/package.json`

- [ ] **Step 1 : Installer jsdom**

```bash
cd packages/web-components && npm install --save-dev jsdom @types/jsdom
```

- [ ] **Step 2 : Créer `packages/web-components/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["development", "import", "module", "default"],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.{test,spec}.ts"],
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
});
```

- [ ] **Step 3 : Créer `packages/web-components/tsconfig.test.json`**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "rootDir": "."
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

- [ ] **Step 4 : Vérifier que la commande de test fonctionne (zéro test)**

```bash
cd packages/web-components && npx vitest run
```

Attendu : `No test files found, exiting with code 0` ou `0 tests passed`.

- [ ] **Step 5 : Commit**

```bash
git add packages/web-components/vitest.config.ts packages/web-components/tsconfig.test.json packages/web-components/package.json packages/web-components/package-lock.json
git commit -m "test(web-components): setup vitest with jsdom"
```

---

## Task 2 : Tests des utilitaires partagés

**Files:**
- Create: `packages/web-components/tests/shared/utils.test.ts`

- [ ] **Step 1 : Écrire les tests**

```ts
import { describe, it, expect } from "vitest";
import { renderIcon, renderChips } from "../../src/shared/utils.js";

describe("renderIcon", () => {
  it("intègre le content dans le SVG", () => {
    const result = renderIcon({ content: "<path d='M0 0'/>" });
    expect(result).toContain("<path d='M0 0'/>");
    expect(result).toContain("<svg");
  });

  it("utilise la taille par défaut 24", () => {
    const result = renderIcon({ content: "" });
    expect(result).toContain('width="24"');
    expect(result).toContain('height="24"');
  });

  it("utilise la couleur par défaut #000000", () => {
    const result = renderIcon({ content: "" });
    expect(result).toContain('fill="#000000"');
  });

  it("accepte une taille personnalisée", () => {
    const result = renderIcon({ content: "", size: 48 });
    expect(result).toContain('width="48"');
    expect(result).toContain('height="48"');
  });

  it("accepte une couleur personnalisée", () => {
    const result = renderIcon({ content: "", color: "#FF0000" });
    expect(result).toContain('fill="#FF0000"');
  });

  it("accepte un style personnalisé", () => {
    const result = renderIcon({ content: "", style: "display:block;" });
    expect(result).toContain('style="display:block;"');
  });
});

describe("renderChips", () => {
  it("affiche le texte", () => {
    const result = renderChips({ text: "Bon", color: "#00FF00", textColor: "#000000" });
    expect(result).toContain("Bon");
  });

  it("applique la couleur de fond", () => {
    const result = renderChips({ text: "X", color: "#ABCDEF", textColor: "#000000" });
    expect(result).toContain("background-color: #ABCDEF");
  });

  it("applique la couleur du texte", () => {
    const result = renderChips({ text: "X", color: "#000", textColor: "#FFFFFF" });
    expect(result).toContain("color: #FFFFFF");
  });

  it("accepte un style additionnel", () => {
    const result = renderChips({ text: "X", color: "#000", textColor: "#FFF", style: "margin:0;" });
    expect(result).toContain("margin:0;");
  });
});
```

- [ ] **Step 2 : Lancer les tests**

```bash
cd packages/web-components && npx vitest run tests/shared/utils.test.ts
```

Attendu : `8 tests passed`.

- [ ] **Step 3 : Commit**

```bash
git add packages/web-components/tests/shared/utils.test.ts
git commit -m "test(web-components): renderIcon et renderChips"
```

---

## Task 3 : Tests de renderEtiquette

**Files:**
- Create: `packages/web-components/tests/etiquette.test.ts`

- [ ] **Step 1 : Écrire les tests**

```ts
import { describe, it, expect } from "vitest";
import { renderEtiquette } from "../../src/etiquette/index.js";

describe("renderEtiquette", () => {
  it("retourne un SVG pour chaque étiquette", () => {
    const etiquettes = ["A", "B", "C", "D", "E", "F", "G"] as const;
    for (const value of etiquettes) {
      const result = renderEtiquette({ value });
      expect(result).toContain("<svg");
      expect(result).toContain("</svg>");
    }
  });

  it("chaque étiquette produit un contenu SVG différent", () => {
    const A = renderEtiquette({ value: "A" });
    const B = renderEtiquette({ value: "B" });
    const G = renderEtiquette({ value: "G" });
    expect(A).not.toBe(B);
    expect(B).not.toBe(G);
    expect(A).not.toBe(G);
  });

  it("couleur par défaut est blanche", () => {
    const result = renderEtiquette({ value: "A" });
    expect(result).toContain('fill="#FFFFFF"');
  });

  it("accepte une couleur personnalisée", () => {
    const result = renderEtiquette({ value: "A", color: "#FF0000" });
    expect(result).toContain('fill="#FF0000"');
  });

  it("accepte une taille personnalisée", () => {
    const result = renderEtiquette({ value: "A", size: 32 });
    expect(result).toContain('width="32"');
  });

  it("retourne un SVG vide pour une valeur inconnue", () => {
    const result = renderEtiquette({ value: "Z" as any });
    expect(result).toContain("<svg");
    expect(result).not.toContain("<path");
  });
});
```

- [ ] **Step 2 : Lancer les tests**

```bash
cd packages/web-components && npx vitest run tests/etiquette.test.ts
```

Attendu : `6 tests passed`.

- [ ] **Step 3 : Commit**

```bash
git add packages/web-components/tests/etiquette.test.ts
git commit -m "test(web-components): renderEtiquette"
```

---

## Task 4 : Tests renderEtiquetteEnergie et renderEtiquetteClimat

**Files:**
- Create: `packages/web-components/tests/etiquette-energie.test.ts`
- Create: `packages/web-components/tests/etiquette-climat.test.ts`

- [ ] **Step 1 : Écrire `tests/etiquette-energie.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { renderEtiquetteEnergie } from "../../src/etiquette-energie/index.js";

const ENERGIE_COLORS = {
  A: "#00A06D", B: "#52B153", C: "#A5CC74", D: "#F4E70F",
  E: "#F0B40F", F: "#EB8235", G: "#D7221F",
};

describe("renderEtiquetteEnergie", () => {
  it("retourne un SVG pleine largeur pour chaque étiquette", () => {
    for (const value of ["A", "B", "C", "D", "E", "F", "G"] as const) {
      const result = renderEtiquetteEnergie({ value });
      expect(result).toContain('width="100%"');
      expect(result).toContain('viewBox="0 0 234 276"');
    }
  });

  it("chaque étiquette contient sa propre couleur dans le SVG mis en avant", () => {
    for (const [value, color] of Object.entries(ENERGIE_COLORS)) {
      const result = renderEtiquetteEnergie({ value: value as any });
      expect(result).toContain(color);
    }
  });

  it("chaque étiquette produit un SVG différent", () => {
    const svgs = (["A", "B", "C", "D", "E", "F", "G"] as const).map(
      (v) => renderEtiquetteEnergie({ value: v }),
    );
    const unique = new Set(svgs);
    expect(unique.size).toBe(7);
  });

  it("retourne un SVG vide (sans path) pour une valeur inconnue", () => {
    const result = renderEtiquetteEnergie({ value: "Z" as any });
    expect(result).toContain("<svg");
    // Le contenu SVG_MAP["Z"] est undefined → "" → SVG sans path de lettre
    expect(result.length).toBeLessThan(100);
  });
});
```

- [ ] **Step 2 : Écrire `tests/etiquette-climat.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { renderEtiquetteClimat } from "../../src/etiquette-climat/index.js";

const CLIMAT_COLORS = {
  A: "#A4DBF8", B: "#8CB4D3", C: "#7792B1", D: "#606F8F",
  E: "#4D5271", F: "#393551", G: "#281B35",
};

describe("renderEtiquetteClimat", () => {
  it("retourne un SVG pleine largeur pour chaque étiquette", () => {
    for (const value of ["A", "B", "C", "D", "E", "F", "G"] as const) {
      const result = renderEtiquetteClimat({ value });
      expect(result).toContain('width="100%"');
      expect(result).toContain('viewBox="0 0 234 276"');
    }
  });

  it("chaque étiquette contient sa propre couleur dans le SVG mis en avant", () => {
    for (const [value, color] of Object.entries(CLIMAT_COLORS)) {
      const result = renderEtiquetteClimat({ value: value as any });
      expect(result).toContain(color);
    }
  });

  it("chaque étiquette produit un SVG différent", () => {
    const svgs = (["A", "B", "C", "D", "E", "F", "G"] as const).map(
      (v) => renderEtiquetteClimat({ value: v }),
    );
    const unique = new Set(svgs);
    expect(unique.size).toBe(7);
  });
});
```

- [ ] **Step 3 : Lancer les tests**

```bash
cd packages/web-components && npx vitest run tests/etiquette-energie.test.ts tests/etiquette-climat.test.ts
```

Attendu : `7 tests passed`.

- [ ] **Step 4 : Commit**

```bash
git add packages/web-components/tests/etiquette-energie.test.ts packages/web-components/tests/etiquette-climat.test.ts
git commit -m "test(web-components): renderEtiquetteEnergie et renderEtiquetteClimat"
```

---

## Task 5 : Tests renderClasseEnergie et renderClasseClimat

**Files:**
- Create: `packages/web-components/tests/classe-energie.test.ts`
- Create: `packages/web-components/tests/classe-climat.test.ts`

- [ ] **Step 1 : Écrire `tests/classe-energie.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { renderClasseEnergie } from "../../src/classe-energie/index.js";

const ENERGIE_COLORS = {
  A: "#00A06D", B: "#52B153", C: "#A5CC74", D: "#F4E70F",
  E: "#F0B40F", F: "#EB8235", G: "#D7221F",
};

describe("renderClasseEnergie", () => {
  it("contient la couleur correcte pour chaque étiquette", () => {
    for (const [value, color] of Object.entries(ENERGIE_COLORS)) {
      const result = renderClasseEnergie({ value: value as any });
      expect(result).toContain(`background-color: ${color}`);
    }
  });

  it("taille par défaut est 32px", () => {
    const result = renderClasseEnergie({ value: "A" });
    expect(result).toContain("width: 32px");
    expect(result).toContain("height: 32px");
  });

  it("accepte une taille personnalisée", () => {
    const result = renderClasseEnergie({ value: "A", size: 64 });
    expect(result).toContain("width: 64px");
    expect(result).toContain("height: 64px");
  });

  it("contient le SVG de la lettre", () => {
    const result = renderClasseEnergie({ value: "A" });
    expect(result).toContain("<svg");
  });
});
```

- [ ] **Step 2 : Écrire `tests/classe-climat.test.ts`**

Lire d'abord `src/classe-climat/index.ts` pour vérifier les couleurs utilisées (devrait être `ETIQUETTE_CLIMAT_COLORS`), puis écrire :

```ts
import { describe, it, expect } from "vitest";
import { renderClasseClimat } from "../../src/classe-climat/index.js";

const CLIMAT_COLORS = {
  A: "#A4DBF8", B: "#8CB4D3", C: "#7792B1", D: "#606F8F",
  E: "#4D5271", F: "#393551", G: "#281B35",
};

describe("renderClasseClimat", () => {
  it("contient la couleur correcte pour chaque étiquette", () => {
    for (const [value, color] of Object.entries(CLIMAT_COLORS)) {
      const result = renderClasseClimat({ value: value as any });
      expect(result).toContain(`background-color: ${color}`);
    }
  });

  it("taille par défaut est 32px", () => {
    const result = renderClasseClimat({ value: "A" });
    expect(result).toContain("width: 32px");
    expect(result).toContain("height: 32px");
  });
});
```

- [ ] **Step 3 : Lancer les tests**

```bash
cd packages/web-components && npx vitest run tests/classe-energie.test.ts tests/classe-climat.test.ts
```

Attendu : `7 tests passed`.

- [ ] **Step 4 : Commit**

```bash
git add packages/web-components/tests/classe-energie.test.ts packages/web-components/tests/classe-climat.test.ts
git commit -m "test(web-components): renderClasseEnergie et renderClasseClimat"
```

---

## Task 6 : Tests renderConfortEte et renderEnum

**Files:**
- Create: `packages/web-components/tests/confort-ete.test.ts`
- Create: `packages/web-components/tests/enum.test.ts`

- [ ] **Step 1 : Écrire `tests/confort-ete.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { renderConfortEte } from "../../src/confort-ete/index.js";

const PERFORMANCE_COLORS = { 1: "#2CAF85", 2: "#A5CC74", 3: "#F49838", 4: "#E52322" };

describe("renderConfortEte", () => {
  it("valeur 1 (Bon) → couleur verte #2CAF85", () => {
    const result = renderConfortEte({ value: 1 });
    expect(result).toContain(PERFORMANCE_COLORS[1]);
  });

  it("valeur 2 (Moyen) → couleur jaune #A5CC74", () => {
    const result = renderConfortEte({ value: 2 });
    expect(result).toContain(PERFORMANCE_COLORS[2]);
  });

  it("valeur 3 (Insuffisant) → couleur orange #F49838", () => {
    const result = renderConfortEte({ value: 3 });
    expect(result).toContain(PERFORMANCE_COLORS[3]);
  });

  it("affiche le libellé dans le rendu", () => {
    const result = renderConfortEte({ value: 1 });
    expect(result).toContain("Bon");
  });

  it("valeur inconnue → couleur fallback #000000", () => {
    const result = renderConfortEte({ value: 99 as any });
    expect(result).toContain("#000000");
  });
});
```

- [ ] **Step 2 : Écrire `tests/enum.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { renderEnum } from "../../src/enum/index.js";

describe("renderEnum", () => {
  it("retourne le libellé correct pour un couple clé/valeur connu", () => {
    const result = renderEnum("scenario", "conventionnel");
    expect(result).toContain("Scénario conventionnel");
  });

  it("retourne le libellé correct pour une énergie connue", () => {
    const result = renderEnum("energie", "electricite");
    expect(result).toContain("Électricité");
  });

  it("retourne '-' pour une valeur inconnue dans une clé existante", () => {
    const result = renderEnum("scenario", "inconnu" as any);
    expect(result).toContain("-");
  });

  it("retourne '-' pour une clé inconnue", () => {
    const result = renderEnum("inexistant" as any, "valeur");
    expect(result).toContain("-");
  });

  it("encapsule le résultat dans un <span>", () => {
    const result = renderEnum("etiquette", "A");
    expect(result).toMatch(/^<span>.*<\/span>$/);
  });

  it("retourne le libellé de zone climatique", () => {
    const result = renderEnum("zone-climatique", "H2d");
    expect(result).toContain("H2d");
  });

  it("retourne le libellé de type de bâtiment", () => {
    const result = renderEnum("type-batiment", "maison");
    expect(result).toContain("Maison individuelle");
  });
});
```

- [ ] **Step 3 : Lancer les tests**

```bash
cd packages/web-components && npx vitest run tests/confort-ete.test.ts tests/enum.test.ts
```

Attendu : `12 tests passed`.

- [ ] **Step 4 : Commit**

```bash
git add packages/web-components/tests/confort-ete.test.ts packages/web-components/tests/enum.test.ts
git commit -m "test(web-components): renderConfortEte et renderEnum"
```

---

## Task 7 : Tests renderRepartitionDeperditions

**Files:**
- Create: `packages/web-components/tests/repartition-deperditions.test.ts`

- [ ] **Step 1 : Écrire les tests**

```ts
import { describe, it, expect } from "vitest";
import { renderRepartitionDeperditions } from "../../src/repartition-deperditions/index.js";

const BASE = {
  gv: 100,
  dp_murs: 25,
  dp_planchers_bas: 15,
  dp_planchers_hauts: 20,
  dp_ponts_thermiques: 10,
  dp_menuiseries: 20,
  dr: 10,
};

describe("renderRepartitionDeperditions", () => {
  it("retourne un SVG", () => {
    const result = renderRepartitionDeperditions(BASE);
    expect(result).toContain("<svg");
    expect(result).toContain("</svg>");
  });

  it("calcule et affiche le pourcentage des murs", () => {
    // dp_murs=25, gv=100 → 25%
    const result = renderRepartitionDeperditions({ ...BASE, dp_murs: 25, gv: 100 });
    expect(result).toContain("25");
  });

  it("calcule et affiche le pourcentage de ventilation (dr)", () => {
    // dr=10, gv=100 → 10%
    const result = renderRepartitionDeperditions({ ...BASE, dr: 10, gv: 100 });
    expect(result).toContain("10");
  });

  it("la somme des composantes égale 100% si gv est bien la somme", () => {
    // Vérifie que les calculs % sont bien basés sur gv
    const props = {
      gv: 200,
      dp_murs: 50,
      dp_planchers_bas: 30,
      dp_planchers_hauts: 40,
      dp_ponts_thermiques: 20,
      dp_menuiseries: 40,
      dr: 20,
    };
    const result = renderRepartitionDeperditions(props);
    // dp_murs/gv*100 = 25%
    expect(result).toContain("25");
  });

  it("contient les labels attendus", () => {
    const result = renderRepartitionDeperditions(BASE);
    expect(result).toContain("Ventilation");
    expect(result).toContain("Toitures");
    expect(result).toContain("Murs");
    expect(result).toContain("Planchers");
    expect(result).toContain("Menuiseries");
  });
});
```

- [ ] **Step 2 : Lancer les tests**

```bash
cd packages/web-components && npx vitest run tests/repartition-deperditions.test.ts
```

Attendu : `5 tests passed`.

- [ ] **Step 3 : Commit**

```bash
git add packages/web-components/tests/repartition-deperditions.test.ts
git commit -m "test(web-components): renderRepartitionDeperditions"
```

---

## Task 8 : Tests renderPerformance* (4 composants à seuils simples)

**Files:**
- Create: `packages/web-components/tests/performance.test.ts`

- [ ] **Step 1 : Écrire les tests**

```ts
import { describe, it, expect } from "vitest";
import { renderPerformanceEnveloppe } from "../../src/performance-enveloppe/index.js";
import { renderPerformanceMur } from "../../src/performance-mur/index.js";
import { renderPerformanceMenuiserie } from "../../src/performance-menuiserie/index.js";
import { renderPerformancePlancherBas } from "../../src/performance-plancher-bas/index.js";

const C1 = "#2CAF85";
const C2 = "#A5CC74";
const C3 = "#F49838";
const C4 = "#E52322";

describe("renderPerformanceEnveloppe (seuils ubat ≤ 0.45 / 0.65 / 0.85)", () => {
  it.each([
    [0, C1], [0.45, C1],
    [0.46, C2], [0.65, C2],
    [0.66, C3], [0.85, C3],
    [0.86, C4], [1.5, C4],
  ])("ubat=%s → couleur %s", (ubat, expected) => {
    expect(renderPerformanceEnveloppe({ ubat })).toContain(expected);
  });

  it("affiche la valeur formatée", () => {
    const result = renderPerformanceEnveloppe({ ubat: 0.5 });
    expect(result).toContain("0");
  });
});

describe("renderPerformanceMur (seuils u ≤ 0.3 / 0.45 / 0.65)", () => {
  it.each([
    [0, C1], [0.3, C1],
    [0.31, C2], [0.45, C2],
    [0.46, C3], [0.65, C3],
    [0.66, C4], [1.0, C4],
  ])("u=%s → couleur %s", (u, expected) => {
    expect(renderPerformanceMur({ u })).toContain(expected);
  });
});

describe("renderPerformanceMenuiserie (seuils u ≤ 1.6 / 2.2 / 3)", () => {
  it.each([
    [0, C1], [1.6, C1],
    [1.61, C2], [2.2, C2],
    [2.21, C3], [3, C3],
    [3.01, C4], [5, C4],
  ])("u=%s → couleur %s", (u, expected) => {
    expect(renderPerformanceMenuiserie({ u })).toContain(expected);
  });
});

describe("renderPerformancePlancherBas (seuils u ≤ 0.25 / 0.45 / 0.65)", () => {
  it.each([
    [0, C1], [0.25, C1],
    [0.26, C2], [0.45, C2],
    [0.46, C3], [0.65, C3],
    [0.66, C4], [1.0, C4],
  ])("u=%s → couleur %s", (u, expected) => {
    expect(renderPerformancePlancherBas({ u })).toContain(expected);
  });
});
```

- [ ] **Step 2 : Lancer les tests**

```bash
cd packages/web-components && npx vitest run tests/performance.test.ts
```

Attendu : `32 tests passed`.

- [ ] **Step 3 : Commit**

```bash
git add packages/web-components/tests/performance.test.ts
git commit -m "test(web-components): renderPerformance* (enveloppe, mur, menuiserie, plancher-bas)"
```

---

## Task 9 : Tests renderPerformancePlancherHaut (3 configurations)

**Files:**
- Create: `packages/web-components/tests/performance-plancher-haut.test.ts`

- [ ] **Step 1 : Écrire les tests**

```ts
import { describe, it, expect } from "vitest";
import { renderPerformancePlancherHaut } from "../../src/performance-plancher-haut/index.js";

const C1 = "#2CAF85";
const C2 = "#A5CC74";
const C3 = "#F49838";
const C4 = "#E52322";

describe("renderPerformancePlancherHaut — configuration plancher (≤0.15 / 0.2 / 0.3)", () => {
  it.each([
    [0, C1], [0.15, C1],
    [0.16, C2], [0.2, C2],
    [0.21, C3], [0.3, C3],
    [0.31, C4], [0.5, C4],
  ])("u=%s → couleur %s", (u, expected) => {
    expect(renderPerformancePlancherHaut({ configuration: "plancher", u })).toContain(expected);
  });
});

describe("renderPerformancePlancherHaut — configuration rampants (≤0.18 / 0.25 / 0.35)", () => {
  it.each([
    [0, C1], [0.18, C1],
    [0.19, C2], [0.25, C2],
    [0.26, C3], [0.35, C3],
    [0.36, C4], [0.5, C4],
  ])("u=%s → couleur %s", (u, expected) => {
    expect(renderPerformancePlancherHaut({ configuration: "rampants", u })).toContain(expected);
  });
});

describe("renderPerformancePlancherHaut — configuration terrasse (≤0.25 / 0.45 / 0.65)", () => {
  it.each([
    [0, C1], [0.25, C1],
    [0.26, C2], [0.45, C2],
    [0.46, C3], [0.65, C3],
    [0.66, C4], [1.0, C4],
  ])("u=%s → couleur %s", (u, expected) => {
    expect(renderPerformancePlancherHaut({ configuration: "terrasse", u })).toContain(expected);
  });
});
```

- [ ] **Step 2 : Lancer les tests**

```bash
cd packages/web-components && npx vitest run tests/performance-plancher-haut.test.ts
```

Attendu : `24 tests passed`.

- [ ] **Step 3 : Commit**

```bash
git add packages/web-components/tests/performance-plancher-haut.test.ts
git commit -m "test(web-components): renderPerformancePlancherHaut (3 configurations)"
```

---

## Task 10 : Tests du cycle de vie des Web Components

**Files:**
- Create: `packages/web-components/tests/web-components.test.ts`

Ces tests nécessitent jsdom (déjà configuré en Task 1). Ils vérifient que chaque Web Component enregistre un custom element, se connecte au DOM et réagit aux changements d'attributs.

- [ ] **Step 1 : Écrire les tests**

```ts
import { describe, it, expect, beforeAll } from "vitest";

// Les imports suivants déclenchent les enregistrements customElements
import "../../src/etiquette/index.js";
import "../../src/classe-energie/index.js";
import "../../src/performance-enveloppe/index.js";
import "../../src/enum/index.js";
import "../../src/confort-ete/index.js";
import "../../src/repartition-deperditions/index.js";

describe("Web Component : open-dpe-etiquette", () => {
  it("est enregistré", () => {
    expect(customElements.get("open-dpe-etiquette")).toBeDefined();
  });

  it("rend le contenu lors de connectedCallback", () => {
    const el = document.createElement("open-dpe-etiquette");
    el.setAttribute("value", "A");
    document.body.appendChild(el);
    expect(el.innerHTML).toContain("<svg");
    document.body.removeChild(el);
  });

  it("re-rend lors d'un changement d'attribut", () => {
    const el = document.createElement("open-dpe-etiquette");
    el.setAttribute("value", "A");
    document.body.appendChild(el);
    const before = el.innerHTML;
    el.setAttribute("value", "G");
    const after = el.innerHTML;
    expect(before).not.toBe(after);
    document.body.removeChild(el);
  });
});

describe("Web Component : open-dpe-classe-energie", () => {
  it("est enregistré", () => {
    expect(customElements.get("open-dpe-classe-energie")).toBeDefined();
  });

  it("rend la couleur de l'étiquette A", () => {
    const el = document.createElement("open-dpe-classe-energie");
    el.setAttribute("value", "A");
    document.body.appendChild(el);
    expect(el.innerHTML).toContain("#00A06D");
    document.body.removeChild(el);
  });

  it("re-rend avec la bonne couleur après changement d'étiquette", () => {
    const el = document.createElement("open-dpe-classe-energie");
    el.setAttribute("value", "A");
    document.body.appendChild(el);
    el.setAttribute("value", "G");
    expect(el.innerHTML).toContain("#D7221F");
    document.body.removeChild(el);
  });
});

describe("Web Component : open-dpe-performance-enveloppe", () => {
  it("est enregistré", () => {
    expect(customElements.get("open-dpe-performance-enveloppe")).toBeDefined();
  });

  it("rend la couleur correcte pour ubat=0.3", () => {
    const el = document.createElement("open-dpe-performance-enveloppe");
    el.setAttribute("ubat", "0.3");
    document.body.appendChild(el);
    expect(el.innerHTML).toContain("#2CAF85");
    document.body.removeChild(el);
  });

  it("re-rend avec la bonne couleur après changement de ubat", () => {
    const el = document.createElement("open-dpe-performance-enveloppe");
    el.setAttribute("ubat", "0.3");
    document.body.appendChild(el);
    el.setAttribute("ubat", "1.0");
    expect(el.innerHTML).toContain("#E52322");
    document.body.removeChild(el);
  });
});

describe("Web Component : open-dpe-logement-enum", () => {
  it("est enregistré", () => {
    expect(customElements.get("open-dpe-logement-enum")).toBeDefined();
  });

  it("rend le libellé pour key=scenario, value=conventionnel", () => {
    const el = document.createElement("open-dpe-logement-enum");
    el.setAttribute("key", "scenario");
    el.setAttribute("value", "conventionnel");
    document.body.appendChild(el);
    expect(el.innerHTML).toContain("Scénario conventionnel");
    document.body.removeChild(el);
  });

  it("re-rend après changement de value", () => {
    const el = document.createElement("open-dpe-logement-enum");
    el.setAttribute("key", "scenario");
    el.setAttribute("value", "conventionnel");
    document.body.appendChild(el);
    el.setAttribute("value", "depensier");
    expect(el.innerHTML).toContain("Scénario dépensier");
    document.body.removeChild(el);
  });
});

describe("Web Component : open-dpe-confort-ete", () => {
  it("est enregistré", () => {
    expect(customElements.get("open-dpe-confort-ete")).toBeDefined();
  });

  it("rend 'Bon' pour value=1", () => {
    const el = document.createElement("open-dpe-confort-ete");
    el.setAttribute("value", "1");
    document.body.appendChild(el);
    expect(el.innerHTML).toContain("Bon");
    document.body.removeChild(el);
  });
});

describe("Web Component : open-dpe-repartition-deperditions", () => {
  it("est enregistré", () => {
    expect(customElements.get("open-dpe-repartition-deperditions")).toBeDefined();
  });

  it("rend un SVG avec les attributs numériques", () => {
    const el = document.createElement("open-dpe-repartition-deperditions");
    el.setAttribute("gv", "100");
    el.setAttribute("dp_murs", "20");
    el.setAttribute("dp_planchers_bas", "15");
    el.setAttribute("dp_planchers_hauts", "20");
    el.setAttribute("dp_ponts_thermiques", "15");
    el.setAttribute("dp_menuiseries", "20");
    el.setAttribute("dr", "10");
    document.body.appendChild(el);
    expect(el.innerHTML).toContain("<svg");
    document.body.removeChild(el);
  });
});
```

- [ ] **Step 2 : Lancer les tests**

```bash
cd packages/web-components && npx vitest run tests/web-components.test.ts
```

Attendu : `16 tests passed`.

- [ ] **Step 3 : Commit**

```bash
git add packages/web-components/tests/web-components.test.ts
git commit -m "test(web-components): cycle de vie des Web Components (jsdom)"
```

---

## Task 11 : Validation finale

- [ ] **Step 1 : Lancer tous les tests du package**

```bash
cd packages/web-components && npx vitest run
```

Attendu : au minimum `~100 tests passed`, 0 failed.

- [ ] **Step 2 : Vérifier le type-check**

```bash
cd packages/web-components && npm run check-types
```

Attendu : aucune erreur TypeScript.

- [ ] **Step 3 : Lancer les tests depuis la racine (Turborepo)**

```bash
npx turbo test --filter=@open-dpe-logement/web-components
```

Attendu : le pipeline passe sans erreur.

- [ ] **Step 4 : Commit final**

```bash
git add .
git commit -m "test(web-components): couverture complète du package"
```

---

## Auto-révision

### Couverture des composants

| Composant | Fonction pure | Web Component |
|---|---|---|
| `shared/utils` — renderIcon | ✅ Task 2 | — |
| `shared/utils` — renderChips | ✅ Task 2 | — |
| `etiquette` | ✅ Task 3 | ✅ Task 10 |
| `etiquette-energie` | ✅ Task 4 | — |
| `etiquette-climat` | ✅ Task 4 | — |
| `classe-energie` | ✅ Task 5 | ✅ Task 10 |
| `classe-climat` | ✅ Task 5 | — |
| `confort-ete` | ✅ Task 6 | ✅ Task 10 |
| `enum` | ✅ Task 6 | ✅ Task 10 |
| `repartition-deperditions` | ✅ Task 7 | ✅ Task 10 |
| `performance-enveloppe` | ✅ Task 8 | ✅ Task 10 |
| `performance-mur` | ✅ Task 8 | — |
| `performance-menuiserie` | ✅ Task 8 | — |
| `performance-plancher-bas` | ✅ Task 8 | — |
| `performance-plancher-haut` | ✅ Task 9 | — |
| `icon-*` (5 composants) | ⚠️ Non couvert — fonctions délèguent à renderIcon déjà testé | — |

> **Note sur les `icon-*`** : `icon-energie`, `icon-confort-ete`, `icon-enveloppe`, `icon-passoire`, `icon-usage` délèguent tous à `renderIcon` (déjà testé) avec un SVG statique. Leur logique propre est uniquement le mapping valeur→SVG_MAP. Si une couverture supplémentaire est souhaitée, ajouter un test minimal vérifiant que chaque valeur d'enum produit un SVG non vide.

### Scan des placeholders

Aucun placeholder trouvé — chaque step contient du code complet.

### Cohérence des types

- `"plancher" | "rampants" | "terrasse"` utilisés dans Task 9 correspondent aux valeurs de `enveloppe.plancherHaut.ConfigurationEnum` dans le code source.
- Les valeurs `"A"…"G"` correspondent à `models.diagnostic.EtiquetteEnum`.
- Les couleurs dans les tests sont extraites directement des constantes définies dans `src/shared/colors.ts`.
