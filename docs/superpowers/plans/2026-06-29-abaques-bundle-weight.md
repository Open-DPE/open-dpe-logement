# Externalisation des données `abaques` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réduire le poids du bundle final livré par les apps tierces consommant `@open-dpe-logement/engine`, en sortant les ~1.5 Mo de données `abaques` du graphe de modules JS statique, sans changer l'API synchrone du moteur de calcul.

**Architecture:**
Les ~1.5 Mo de tables sont aujourd'hui des littéraux JS importés statiquement (`import data from "#data/chauffage/combustion.js"` depuis `src/data/**/*.ts`), donc traités comme du code par tout bundler. `packages/abaques/data/**/*.json` existe déjà (généré par `scripts/generate-abaques.mjs`, 63 fichiers, en phase avec les 63 CSV de la doctrine) mais n'est consommé par personne — ce plan branche dessus au lieu de créer un nouveau répertoire. Les tables sont chargées à l'exécution via un loader isomorphe (lecture disque sous Node, `fetch` sous navigateur, résolu automatiquement par les conditions `node`/`browser` du champ `imports`). Un point d'entrée explicite `init()` charge une fois toutes les tables dans un cache mémoire ; ensuite, `load()`/`search()` et tout le moteur de calcul restent strictement synchrones comme aujourd'hui. `engine` expose son propre `init()` qui délègue à celui d'`abaques`, pour que l'app tierce n'ait jamais à connaître `abaques` directement.

Un bug bloquant pré-existant est corrigé au passage (vérifié empiriquement par `npm pack` + smoke test) : le champ `imports` (`"#*": "./src/*"`) des deux packages pointe vers `src/`, qui n'est pas publié (`files: ["dist"]`) — toute résolution `#xxx.js` casse aujourd'hui pour un vrai `npm install` externe, indépendamment du sujet data. On le rend conditionnel (`development` → `src`, `default` → `dist`), cohérent avec la condition `development` déjà déclarée dans les `vitest.config.ts` des deux packages.

**Tech Stack:** TypeScript (ESM, `moduleResolution: Bundler`), Vitest, Node `fs`/`fetch`, conditional `exports`/`imports` (package.json).

---

## File Structure

```text
packages/abaques/
├── data/                                # EXISTANT (non versionné) — 63 JSON déjà générés, à committer tel quel
│   └── <domaine>/[<sous-domaine>/]<table>.json
├── src/
│   ├── runtime/
│   │   ├── loader.node.ts               # NOUVEAU — lecture fichier (Node)
│   │   ├── loader.browser.ts            # NOUVEAU — fetch (navigateur)
│   │   ├── manifest.browser.ts          # NOUVEAU — généré, URLs statiques par table
│   │   ├── cache.ts                     # NOUVEAU — registerTable/getTable/init
│   │   └── cache.test.ts                # NOUVEAU
│   ├── repositories/**/*.ts             # MODIFIÉ (62 fichiers, via codemod)
│   ├── data/**/*.ts                     # SUPPRIMÉ (62 fichiers .ts, obsolètes — ne pas confondre avec packages/abaques/data/ ci-dessus)
│   └── index.ts                         # MODIFIÉ — export init
└── package.json                          # MODIFIÉ — imports conditionnels, files (ajout de "data")

packages/engine/
├── src/
│   ├── core/
│   │   ├── init.ts                      # NOUVEAU
│   │   └── init.test.ts                 # NOUVEAU (colocated, comme cache.ts d'abaques)
│   └── index.ts                          # MODIFIÉ — export init
└── package.json                          # MODIFIÉ — imports conditionnels

scripts/
├── generate-abaques.mjs                 # MODIFIÉ — ajoute la génération de manifest.browser.ts
└── migrate-abaques-tables.mjs           # NOUVEAU — codemod one-off (supprimé après usage)
```

---

### Task 1 : Corriger la résolution `imports` d'`abaques` pour la publication

**Contexte :** vérifié par smoke test (`npm pack` + extraction + `node --input-type=module -e "import(...)"`) — l'erreur observée était `Cannot find module '.../package/src/data/chauffage/combustion.js'`, car `imports: {"#*": "./src/*"}` pointe vers `src/`, absent du tarball (`files: ["dist"]`).

**Files:**
- Modify: `packages/abaques/package.json`

- [ ] **Step 1 : Modifier le champ `imports`**

Dans `packages/abaques/package.json`, remplacer :

```json
  "imports": {
    "#*": "./src/*"
  },
```

par :

```json
  "imports": {
    "#*": {
      "development": "./src/*",
      "default": "./dist/*"
    }
  },
```

- [ ] **Step 2 : Vérifier que le build et les tests passent toujours**

Run: `cd packages/abaques && npm run build && npm test`
Expected: build et tests passent (les tests passent par la condition `development` déjà déclarée dans `vitest.config.ts`).

- [ ] **Step 3 : Commit**

```bash
git add packages/abaques/package.json
git commit -m "fix(abaques): résoudre #imports vers dist en production"
```

---

### Task 2 : Même correctif pour `engine`

**Files:**
- Modify: `packages/engine/package.json`

- [ ] **Step 1 : Modifier le champ `imports`**

Dans `packages/engine/package.json`, remplacer :

```json
  "imports": {
    "#*": "./src/*"
  },
```

par :

```json
  "imports": {
    "#*": {
      "development": "./src/*",
      "default": "./dist/*"
    }
  },
```

- [ ] **Step 2 : Vérifier build + tests**

Run: `cd packages/engine && npm run build && npm test`
Expected: build et tests passent.

- [ ] **Step 3 : Commit**

```bash
git add packages/engine/package.json
git commit -m "fix(engine): résoudre #imports vers dist en production"
```

---

### Task 3 : Loader Node (lecture fichier)

**Files:**
- Create: `packages/abaques/src/runtime/loader.node.ts`
- Test: `packages/abaques/src/runtime/loader.node.test.ts`

- [ ] **Step 1 : Écrire le test (fixture réelle)**

```ts
// packages/abaques/src/runtime/loader.node.test.ts
import { describe, expect, it } from "vitest";
import { loadAsset } from "./loader.node.js";

describe("loadAsset (Node)", () => {
	it("charge un asset JSON existant relatif au package", async () => {
		const rows = await loadAsset("chauffage/combustion");
		expect(Array.isArray(rows)).toBe(true);
		expect((rows as unknown[]).length).toBeGreaterThan(0);
	});

	it("rejette si l'asset n'existe pas", async () => {
		await expect(loadAsset("inexistant/table")).rejects.toThrow();
	});
});
```

- [ ] **Step 2 : Lancer le test, vérifier qu'il échoue**

Run: `cd packages/abaques && npx vitest run src/runtime/loader.node.test.ts`
Expected: FAIL — `Cannot find module './loader.node.js'`

- [ ] **Step 3 : Implémenter le loader**

```ts
// packages/abaques/src/runtime/loader.node.ts
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export async function loadAsset(key: string): Promise<unknown> {
	const path = join(PACKAGE_ROOT, "data", `${key}.json`);
	const content = await readFile(path, "utf-8");
	return JSON.parse(content);
}
```

> Cette résolution est relative au fichier compilé lui-même (`import.meta.url`), pas au champ `imports` — elle fonctionne donc identiquement en dev (`src/runtime/`) et publié (`dist/runtime/`), car `data/` est toujours deux niveaux au-dessus. `packages/abaques/data/chauffage/combustion.json` existe déjà aujourd'hui (généré par `scripts/generate-abaques.mjs`), ce test peut donc passer immédiatement sans attendre Task 6.

- [ ] **Step 4 : Lancer le test, vérifier qu'il passe**

Run: `cd packages/abaques && npx vitest run src/runtime/loader.node.test.ts`
Expected: PASS

- [ ] **Step 5 : Commit**

```bash
git add packages/abaques/src/runtime/loader.node.ts packages/abaques/src/runtime/loader.node.test.ts
git commit -m "feat(abaques): ajouter le loader Node pour les données externalisées"
```

---

### Task 4 : Loader navigateur (fetch) + manifest statique

**Contexte :** un bundler ne peut transformer `new URL(<littéral>, import.meta.url)` en asset statique que si le chemin est un littéral, pas une variable interpolée. Le manifest fournit une entrée littérale par table, générée automatiquement (Task 5/6).

**Files:**
- Create: `packages/abaques/src/runtime/loader.browser.ts`
- Create: `packages/abaques/src/runtime/manifest.browser.ts` (généré — placeholder vide pour permettre la compilation avant Task 6)

- [ ] **Step 1 : Créer un manifest minimal (sera régénéré en Task 6)**

```ts
// packages/abaques/src/runtime/manifest.browser.ts
// GÉNÉRÉ AUTOMATIQUEMENT par scripts/generate-abaques.mjs — ne pas modifier manuellement
export const ASSET_URLS: Record<string, URL> = {};
```

- [ ] **Step 2 : Implémenter le loader navigateur**

```ts
// packages/abaques/src/runtime/loader.browser.ts
import { ASSET_URLS } from "./manifest.browser.js";

export async function loadAsset(key: string): Promise<unknown> {
	const url = ASSET_URLS[key];
	if (!url) {
		throw new Error(`[abaques] Asset inconnu : "${key}"`);
	}
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`[abaques] Échec du chargement de "${key}" : ${response.status}`);
	}
	return response.json();
}
```

- [ ] **Step 3 : Vérifier la compilation**

Run: `cd packages/abaques && npx tsc --noEmit`
Expected: aucune erreur

- [ ] **Step 4 : Commit**

```bash
git add packages/abaques/src/runtime/loader.browser.ts packages/abaques/src/runtime/manifest.browser.ts
git commit -m "feat(abaques): ajouter le loader navigateur (fetch + manifest statique)"
```

---

### Task 5 : Cache mémoire — `registerTable` / `getTable` / `init`

**Files:**
- Create: `packages/abaques/src/runtime/cache.ts`
- Test: `packages/abaques/src/runtime/cache.test.ts`

- [ ] **Step 1 : Écrire les tests**

```ts
// packages/abaques/src/runtime/cache.test.ts
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("cache", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("getTable lève une erreur avant init()", async () => {
		const { getTable, registerTable } = await import("./cache.js");
		registerTable("dummy/table");
		expect(() => getTable("dummy/table")).toThrow('"dummy/table"');
	});

	it("init() charge toutes les tables enregistrées, puis getTable les retourne", async () => {
		vi.doMock("./loader.node.js", () => ({
			loadAsset: vi.fn(async (key: string) => [{ key }]),
		}));
		const { getTable, registerTable, init } = await import("./cache.js");
		registerTable("a/table");
		registerTable("b/table");

		await init();

		expect(getTable("a/table")).toEqual([{ key: "a/table" }]);
		expect(getTable("b/table")).toEqual([{ key: "b/table" }]);
	});

	it("init() est idempotent (un seul chargement même appelé plusieurs fois)", async () => {
		const loadAsset = vi.fn(async (key: string) => [{ key }]);
		vi.doMock("./loader.node.js", () => ({ loadAsset }));
		const { registerTable, init } = await import("./cache.js");
		registerTable("a/table");

		await Promise.all([init(), init(), init()]);

		expect(loadAsset).toHaveBeenCalledTimes(1);
	});
});
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils échouent**

Run: `cd packages/abaques && npx vitest run src/runtime/cache.test.ts`
Expected: FAIL — `Cannot find module './cache.js'`

- [ ] **Step 3 : Implémenter le cache**

```ts
// packages/abaques/src/runtime/cache.ts
import { loadAsset } from "#runtime/loader.js";

const store = new Map<string, unknown>();
const keys = new Set<string>();
let pending: Promise<void> | undefined;

export function registerTable(key: string): void {
	keys.add(key);
}

export function init(): Promise<void> {
	if (!pending) {
		pending = Promise.all(
			[...keys].map(async (key) => {
				store.set(key, await loadAsset(key));
			}),
		).then(() => undefined);
	}
	return pending;
}

export function getTable<T>(key: string): T {
	if (!store.has(key)) {
		throw new Error(
			`[abaques] Table "${key}" non chargée. Avez-vous appelé init() avant utilisation ?`,
		);
	}
	return store.get(key) as T;
}
```

- [ ] **Step 4 : Déclarer la résolution conditionnelle de `#runtime/loader.js`**

Dans `packages/abaques/package.json`, étendre le champ `imports` (qui contient déjà `"#*"` depuis la Task 1) :

```json
  "imports": {
    "#runtime/loader.js": {
      "types": "./dist/runtime/loader.node.d.ts",
      "development": "./src/runtime/loader.node.ts",
      "node": "./dist/runtime/loader.node.js",
      "browser": "./dist/runtime/loader.browser.js",
      "default": "./dist/runtime/loader.node.js"
    },
    "#*": {
      "development": "./src/*",
      "default": "./dist/*"
    }
  },
```

> Node résout toujours la clé la plus spécifique en priorité : `#runtime/loader.js` ne passe jamais par le fallback générique `#*`.

- [ ] **Step 5 : Lancer les tests, vérifier qu'ils passent**

Run: `cd packages/abaques && npx vitest run src/runtime/cache.test.ts`
Expected: PASS

- [ ] **Step 6 : Commit**

```bash
git add packages/abaques/src/runtime/cache.ts packages/abaques/src/runtime/cache.test.ts packages/abaques/package.json
git commit -m "feat(abaques): ajouter le cache mémoire et l'init isomorphe (Node/navigateur)"
```

---

### Task 6 : Générateur — ajouter la génération du manifest navigateur

**Contexte :** `packages/abaques/data/**/*.json` est déjà produit par ce script (63 fichiers, en phase avec les 63 CSV de la doctrine) — on ne touche pas à cette partie, on ajoute seulement l'émission du manifest navigateur (Task 4) en complément.

**Files:**
- Modify: `scripts/generate-abaques.mjs:183-190`

- [ ] **Step 1 : Ajouter la génération du manifest après la boucle existante**

Remplacer les lignes 183 à 190 actuelles :

```js
const DOCTRINE = join(ROOT, "doctrine", "abaques");
const PACKAGE = join(ROOT, "packages", "abaques", "data");

for (const csv of findCsvFiles(DOCTRINE)) {
	const relative = csv.slice(DOCTRINE.length + 1);
	const out = join(PACKAGE, relative.replace(/\.csv$/, ".json"));
	generateFromCsv(csv, out, relative);
}
```

par :

```js
const DOCTRINE = join(ROOT, "doctrine", "abaques");
const PACKAGE = join(ROOT, "packages", "abaques", "data");
const MANIFEST = join(
	ROOT,
	"packages",
	"abaques",
	"src",
	"runtime",
	"manifest.browser.ts",
);

/** @type {string[]} */
const keys = [];

for (const csv of findCsvFiles(DOCTRINE)) {
	const relative = csv.slice(DOCTRINE.length + 1);
	const relativeKey = relative.replaceAll("\\", "/").replace(/\.csv$/, "");
	const out = join(PACKAGE, relative.replace(/\.csv$/, ".json"));
	generateFromCsv(csv, out, relative);
	keys.push(relativeKey);
}

keys.sort();
const manifestEntries = keys
	.map(
		(key) =>
			`\t"${key}": new URL("../../data/${key}.json", import.meta.url),`,
	)
	.join("\n");

mkdirSync(dirname(MANIFEST), { recursive: true });
writeFileSync(
	MANIFEST,
	[
		"// GÉNÉRÉ AUTOMATIQUEMENT par scripts/generate-abaques.mjs — ne pas modifier manuellement",
		"export const ASSET_URLS: Record<string, URL> = {",
		manifestEntries,
		"};",
		"",
	].join("\n"),
	"utf-8",
);
console.log(`✓ ${MANIFEST.replace(ROOT, "").replaceAll("\\", "/")}`);
```

- [ ] **Step 2 : Exécuter le générateur**

Run: `npm run abaques:generate`
Expected: les 63 lignes `✓ .../data/<domaine>/<table>.json` habituelles, suivies d'une nouvelle ligne `✓ .../src/runtime/manifest.browser.ts`

- [ ] **Step 3 : Vérifier le contenu du manifest généré**

Run: `grep -c "new URL" packages/abaques/src/runtime/manifest.browser.ts`
Expected: `63`

- [ ] **Step 4 : Vérifier que les données existantes n'ont pas changé**

Run: `git status --short packages/abaques/data`
Expected: aucune sortie si `packages/abaques/data` est déjà à jour avec la doctrine actuelle (sinon les fichiers concernés apparaissent en modifiés — vérifier dans ce cas qu'il s'agit bien d'une mise à jour de doctrine légitime, pas d'une régression du script)

- [ ] **Step 5 : Relancer les tests du loader Node (Task 3)**

Run: `cd packages/abaques && npx vitest run src/runtime/loader.node.test.ts`
Expected: PASS (déjà vert depuis Task 3, confirme l'absence de régression)

- [ ] **Step 6 : Committer `packages/abaques/data` (jusqu'ici non versionné) et le manifest**

```bash
git add scripts/generate-abaques.mjs packages/abaques/data packages/abaques/src/runtime/manifest.browser.ts
git commit -m "feat(abaques): versionner les données JSON générées et ajouter le manifest navigateur"
```

---

### Task 7 : Codemod — migrer les 62 fichiers `repositories/**`

**Contexte :** chaque table suit exactement le même motif (`import data from "#data/<key>.js"` + `export const load = (): Schema[] => data;`). Un script mécanique évite 62 modifications manuelles identiques.

**Files:**
- Create (temporaire) : `scripts/migrate-abaques-tables.mjs`
- Modify : les 62 fichiers sous `packages/abaques/src/repositories/**`

- [ ] **Step 1 : Écrire le codemod**

```js
// scripts/migrate-abaques-tables.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "packages", "abaques", "src", "repositories");

const IMPORT_RE = /import data from "#data\/([^"]+)\.js";\n/;
const LOAD_RE = /export const load = \(\): Schema\[\] => data;/;

function findTsFiles(dir) {
	const results = [];
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		if (statSync(fullPath).isDirectory()) {
			results.push(...findTsFiles(fullPath));
		} else if (entry.endsWith(".ts") && entry !== "index.ts") {
			results.push(fullPath);
		}
	}
	return results;
}

let migrated = 0;
for (const file of findTsFiles(ROOT)) {
	const content = readFileSync(file, "utf-8");
	const importMatch = content.match(IMPORT_RE);
	if (!importMatch) {
		console.warn(`[migrate] ${file}: motif d'import non trouvé, ignoré`);
		continue;
	}

	const key = importMatch[1];
	let next = content.replace(
		IMPORT_RE,
		`import { getTable, registerTable } from "#runtime/cache.js";\n`,
	);
	next = next.replace(
		LOAD_RE,
		`const TABLE_KEY = "${key}";\nregisterTable(TABLE_KEY);\n\nexport const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);`,
	);

	if (next === content) {
		console.warn(`[migrate] ${file}: motif "load" non trouvé, ignoré`);
		continue;
	}

	writeFileSync(file, next, "utf-8");
	migrated++;
	console.log(`✓ ${file}`);
}

console.log(`\n${migrated} fichier(s) migré(s).`);
```

- [ ] **Step 2 : Exécuter le codemod**

Run: `node scripts/migrate-abaques-tables.mjs`
Expected: `62 fichier(s) migré(s).` sans aucun avertissement `[migrate] ... ignoré`

- [ ] **Step 3 : Vérifier qu'aucune trace de l'ancien import ne subsiste**

Run: `grep -rl '#data/' packages/abaques/src/repositories`
Expected: aucune sortie (exit code 1, "no matches found")

- [ ] **Step 4 : Spot-check manuel d'un fichier migré**

Run: `cat packages/abaques/src/repositories/chauffage/combustion.ts`
Expected :

```ts
import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	energie_generateur: string | null;
	mode_combustion: string | null;
	"annee_installation/lte": number | null;
	"annee_installation/gte": number | null;
	"pn/lte": number | null;
	"pn/gt": number | null;
	pn_max: number | null;
	rpn: string | number;
	rpint: string | number;
	qp0: string | number;
	pveilleuse: number;
};

export type Query = {
	type_generateur: string;
	energie_generateur: string;
	mode_combustion: string;
	annee_installation: number;
	pn: number;
};

const TABLE_KEY = "chauffage/combustion";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
```

- [ ] **Step 5 : Build pour vérifier la cohérence TypeScript de l'ensemble**

Run: `cd packages/abaques && npx tsc --noEmit`
Expected: aucune erreur

- [ ] **Step 6 : Supprimer le codemod (outil à usage unique, ne sert plus)**

Run: `rm scripts/migrate-abaques-tables.mjs`

- [ ] **Step 7 : Commit**

```bash
git add packages/abaques/src/repositories
git commit -m "refactor(abaques): charger les tables via le cache runtime plutôt que des imports statiques"
```

---

### Task 8 : Supprimer les données statiques obsolètes

**Files:**
- Delete : `packages/abaques/src/data/**/*.ts` (62 fichiers)

- [ ] **Step 1 : Vérifier qu'aucune référence ne subsiste**

Run: `grep -rl '"#data/\|src/data' packages/abaques/src --include=*.ts`
Expected: aucune sortie (seuls `repositories/**` et `index.ts` existaient, déjà nettoyés en Task 7)

- [ ] **Step 2 : Supprimer le répertoire**

Run: `rm -rf packages/abaques/src/data`

- [ ] **Step 3 : Build complet**

Run: `cd packages/abaques && npm run build`
Expected: build réussi, aucune référence cassée

- [ ] **Step 4 : Commit**

```bash
git add -A packages/abaques/src/data
git commit -m "chore(abaques): supprimer les données statiques remplacées par les données externes"
```

---

### Task 9 : Exporter `init` depuis `abaques`

**Files:**
- Modify: `packages/abaques/src/index.ts`

- [ ] **Step 1 : Ajouter l'export**

```ts
// packages/abaques/src/index.ts
import * as chauffage from "./repositories/chauffage/index.js";
import * as climat from "./repositories/climat/index.js";
import * as diagnostic from "./repositories/diagnostic/index.js";
import * as eclairage from "./repositories/eclairage/index.js";
import * as ecs from "./repositories/ecs/index.js";
import * as enveloppe from "./repositories/enveloppe/index.js";
import * as performance from "./repositories/performance/index.js";
import * as production from "./repositories/production/index.js";
import * as refroidissement from "./repositories/refroidissement/index.js";
import * as ventilation from "./repositories/ventilation/index.js";

export { init } from "./runtime/cache.js";

export const abaques = {
	chauffage,
	climat,
	diagnostic,
	eclairage,
	ecs,
	enveloppe,
	performance,
	production,
	refroidissement,
	ventilation,
};

export type Abaques = typeof abaques;
```

> L'ordre des imports garantit que tous les modules `repositories/**` s'exécutent (et donc appellent `registerTable`) avant que `init()` ne soit invoqué par le consommateur.

- [ ] **Step 2 : Test d'intégration bout-en-bout**

```ts
// packages/abaques/src/index.test.ts
import { describe, expect, it } from "vitest";
import { abaques, init } from "./index.js";

describe("abaques (intégration)", () => {
	it("load() échoue avant init()", () => {
		expect(() => abaques.chauffage.combustion.load()).toThrow();
	});

	it("init() permet ensuite à toutes les tables connues de se charger", async () => {
		await init();
		expect(abaques.chauffage.combustion.load().length).toBeGreaterThan(0);
		expect(abaques.climat.zoneClimatique.load().length).toBeGreaterThan(0);
		expect(abaques.ventilation.debits.load().length).toBeGreaterThan(0);
	});
});
```

> Note : si l'export du namespace `climat` utilise une clé `zone-climatique` (camelCase JS impossible avec un tiret), vérifier le nom réel exposé via `export * as <nom> from "./zone-climatique.js"` dans `repositories/climat/index.ts` avant d'écrire ce test (le fichier source utilise déjà un alias JS-valide à cet effet).

- [ ] **Step 3 : Lancer les tests**

Run: `cd packages/abaques && npx vitest run src/index.test.ts`
Expected: PASS

- [ ] **Step 4 : Commit**

```bash
git add packages/abaques/src/index.ts packages/abaques/src/index.test.ts
git commit -m "feat(abaques): exposer init() comme point d'entrée explicite de chargement"
```

---

### Task 10 : `package.json` d'`abaques` — publier les données

**Files:**
- Modify: `packages/abaques/package.json`

- [ ] **Step 1 : Ajouter `data` aux fichiers publiés**

```json
  "files": [
    "dist",
    "data"
  ],
```

- [ ] **Step 2 : Build et smoke test du tarball publié**

Run:
```bash
cd packages/abaques
npm run build
npm pack
mkdir -p smoke-test
tar -xzf open-dpe-logement-abaques-*.tgz -C smoke-test
node --input-type=module -e "
import('./smoke-test/package/dist/index.js').then(async (m) => {
  await m.init();
  console.log('OK', m.abaques.chauffage.combustion.load().length);
}).catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
"
```
Expected: `OK <nombre de lignes>` (auparavant, vérifié empiriquement en amont de ce plan : `FAIL: Cannot find module ... src/data/chauffage/combustion.js`)

- [ ] **Step 3 : Mesurer le nouveau poids du tarball**

Run: `du -sh open-dpe-logement-abaques-*.tgz; du -sh smoke-test/package`
Expected: poids significativement inférieur à l'état initial (1.5 Mo de données ne sont plus dupliqués dans `dist/`, seulement présents une fois dans `data/`)

- [ ] **Step 4 : Nettoyer les artefacts de test**

Run: `rm -rf smoke-test open-dpe-logement-abaques-*.tgz`

- [ ] **Step 5 : Commit**

```bash
git add packages/abaques/package.json
git commit -m "feat(abaques): publier le répertoire data dans le package npm"
```

---

### Task 11 : `engine` — `init()` délégué

**Files:**
- Create: `packages/engine/src/core/init.ts`
- Test: `packages/engine/tests/core/init.test.ts`
- Modify: `packages/engine/src/index.ts`

- [ ] **Step 1 : Écrire le test**

```ts
// packages/engine/tests/core/init.test.ts
import { describe, expect, it, vi } from "vitest";

describe("engine init()", () => {
	it("délègue à l'init() d'abaques et est idempotent", async () => {
		const initAbaques = vi.fn(async () => undefined);
		vi.doMock("@open-dpe-logement/abaques", () => ({ init: initAbaques }));

		const { init } = await import("../../src/core/init.js");
		await Promise.all([init(), init(), init()]);

		expect(initAbaques).toHaveBeenCalledTimes(1);
	});
});
```

- [ ] **Step 2 : Lancer le test, vérifier qu'il échoue**

Run: `cd packages/engine && npx vitest run tests/core/init.test.ts`
Expected: FAIL — `Cannot find module '../../src/core/init.js'`

- [ ] **Step 3 : Implémenter**

```ts
// packages/engine/src/core/init.ts
import { init as initAbaques } from "@open-dpe-logement/abaques";

let pending: Promise<void> | undefined;

export function init(): Promise<void> {
	if (!pending) {
		pending = initAbaques();
	}
	return pending;
}
```

- [ ] **Step 4 : Exporter depuis l'index**

```ts
// packages/engine/src/index.ts
export { createContext } from "./core/context.js";
export { init } from "./core/init.js";
export * as services from "./rules/services.js";
export * as rules from "./rules/rules.js";
export * as constants from "./rules/constants.js";
export * as formulas from "./rules/formulas.js";
```

- [ ] **Step 5 : Lancer le test, vérifier qu'il passe**

Run: `cd packages/engine && npx vitest run tests/core/init.test.ts`
Expected: PASS

- [ ] **Step 6 : Test d'intégration — calcul réel après init()**

Run: `cd packages/engine && npx vitest run`
Expected: tous les tests existants (`tests/formulas/**`, `tests/rules/**`) passent toujours sans modification — confirme que le changement n'a impacté aucune formule ni règle.

- [ ] **Step 7 : Commit**

```bash
git add packages/engine/src/core/init.ts packages/engine/tests/core/init.test.ts packages/engine/src/index.ts
git commit -m "feat(engine): exposer init() pour charger les données abaques avant tout calcul"
```

---

### Task 12 : Documentation d'usage

**Files:**
- Modify: `packages/engine/README.md`

- [ ] **Step 1 : Mettre à jour l'exemple d'usage**

Dans la section `## Usage`, remplacer :

```ts
import { createContext, rules, formulas, services } from "@open-dpe-logement/engine"

const diagnostic = {...};

createContext({ diagnostic }) // scenario: 'conventionnel'
```

par :

```ts
import { createContext, init, rules, formulas, services } from "@open-dpe-logement/engine"

// À appeler une seule fois au démarrage de l'application, avant tout calcul
await init();

const diagnostic = {...};

createContext({ diagnostic }) // scenario: 'conventionnel'
```

- [ ] **Step 2 : Commit**

```bash
git add packages/engine/README.md
git commit -m "docs(engine): documenter l'appel obligatoire à init()"
```

---

## Self-Review

**Couverture du spec :**

| Décision actée dans la conversation | Tâche(s) |
|---|---|
| Sortir les données du graphe de modules statique (bundle → 0 dans le JS) | 3, 4, 6, 7, 8 |
| Mécanisme isomorphe Node/navigateur, résolu automatiquement, zéro config tierce | 3, 4, 5 (conditions `node`/`browser`/`default`) |
| `init()` explicite, mémoïsé, charge tout en une fois | 5, 9, 11 |
| API de calcul (`createContext`, `rules`, `formulas`, `services`) reste strictement synchrone | 7, 11 (aucune modification des fichiers `formulas.ts`) |
| `engine` seule surface connue de l'app tierce — `abaques` jamais exposé directement | 11 (wrapper `init()` dédié) |
| Bug de résolution `#imports` pour publication réelle (découvert en cours d'analyse) | 1, 2, 10 |

**Scan de placeholders :** aucun trouvé — chaque étape contient le code complet, les commandes exactes et le résultat attendu.

**Cohérence des types/signatures :** `getTable<T>(key)` / `registerTable(key)` / `init()` utilisés identiquement dans Task 5 (définition), Task 7 (62 fichiers repositories), Task 9 (index.ts). `loadAsset(key)` identique dans Task 3 et Task 4. Clé de table (`"chauffage/combustion"`, etc.) cohérente entre les données déjà générées (`packages/abaques/data/**`), le manifest navigateur (Task 6) et le codemod (Task 7).

**Adaptation suite à votre précision :** `packages/abaques/data/**/*.json` (63 fichiers) existait déjà, généré par `scripts/generate-abaques.mjs` mais jamais consommé ni committé. Le plan original prévoyait un nouveau répertoire `assets/` ; il branche maintenant directement sur `data/` existant — Task 6 n'ajoute que la génération du manifest navigateur, Tasks 3/4/10 référencent `data/` au lieu d'`assets/`.
