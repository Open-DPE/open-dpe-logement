# Plan de conception — Moteur de calcul DPE (`/engine`)

## Contexte

- Monorepo Typescript
- `/packages/engine` — implémente la méthode de calcul 3CL-DPE. Consomme :
  - `/packages/models` — contrat de données publiques DPE, strictement typé, partagé entre les couches
  - `/packages/abaques` — repositories des abaques utilisés pour les valeurs conventionnelles

## Organisation

```text
/engine
├── src/
│   ├── index.ts                        # exports publics : Engine, interfaces, engine (instance)
│   ├── core/
│   │   ├── contexte.ts                 # Registre des règles, résolution des dépendances
│   │   ├── engine.ts                   # Initialisation du contexte
│   │   ├── index.ts                    # 
│   │   └── results.ts                  # Typage des résultats (cache + output)
│   ├── utils/
│   │   ├── errors.ts                   # Erreurs
│   │   ├── helpers.ts                  # Fonctions génériques
│   │   └── math.ts                     # Fonctions mathématiques
│   └── rules/
│       ├── [domaine]/
│       │   ├── formulas.ts             # Formules de calcul réglementaires
│       │   ├── registry.ts             # Registre des règles et des résultats
│       │   └── rules.ts                # Implémentation des formules de calcul
│       ├── chauffage/
│       └── etiquette/
└── tests/
    ├── core/
    ├── abaques/
    ├── utils/
    └── rules/                          # miroir de src/rules/
```

---

## Terminologie

| Terme                | Type source                 | Description                                                            |
| -------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `Diagnostic`         | `@open-dpe-logement/models` | Données saisies par le diagnosticien — entrée du moteur                |
| `DiagnosticWithData` | `@open-dpe-logement/models` | `Diagnostic` enrichi des valeurs calculées (`data`) — sortie du moteur |
| `DiagnosticScope`    | `/engine`                   | Union des clés de collections itérables dans `Diagnostic`              |

Le terme `Dpe` n'est pas utilisé dans le code. L'entrée et la sortie du moteur sont
respectivement `Diagnostic` et `DiagnosticWithData`.

---

## Interfaces (`src/core/interfaces.ts`)

```typescript
import type { DiagnosticWithData, Enveloppe } from "@open-dpe-logement/models"

// ─── Contexte ─────────────────────────────────────────────────────────────────

export type Mois     = "01"|"02"|"03"|"04"|"05"|"06"|"07"|"08"|"09"|"10"|"11"|"12"
export type Scenario = "conventionnel" | "depensier"

export const MoisEnum = {
  janvier: "01", fevrier: "02", mars: "03", avril: "04",
  mai: "05", juin: "06", juillet: "07", aout: "08",
  septembre: "09", octobre: "10", novembre: "11", decembre: "12",
} as const

export const ScenarioEnum = {
  conventionnel: "conventionnel",
  depensier:     "depensier",
} as const

export interface ExecutionContext {
  uuid?:     string    // présent si RegleIterable
  mois?:     Mois      // présent si mensuelle: true
  scenario?: Scenario  // présent si scenariisee: true
}

// ─── ResolvedDeps ─────────────────────────────────────────────────────────────

// Registre central des types de résultats par id de règle.
// Alimenté au fur et à mesure de l'implémentation des règles.
// Permet à TypeScript de vérifier les consommations de dépendances.
export interface RuleResultRegistry {
  "enveloppe:mur:u":               number
  "enveloppe:mur:sdep":            number
  "enveloppe:mur:dp":              number
  "enveloppe:pont_thermique:valeur": number
  // ... compléter à chaque nouvelle règle
}

export interface ResolvedDeps {
  // Surcharge typée — retourne le bon type si l'id est dans le registre
  get<K extends keyof RuleResultRegistry>(idRegle: K): RuleResultRegistry[K]
  // Surcharge générique — fallback pour les règles non encore enregistrées
  get<T = unknown>(idRegle: string): T
}

// ─── Scope ────────────────────────────────────────────────────────────────────

// Union dérivée des clés de collections itérables de l'enveloppe.
// Étendue à chauffage/ecs/etc. si des règles itèrent sur ces collections.
export type DiagnosticScope = keyof Pick<
  Enveloppe,
  "murs" | "baies" | "ponts_thermiques" | "planchers_hauts" | "planchers_bas" | "portes"
>

// ─── Règles ───────────────────────────────────────────────────────────────────

// Règle scalaire — s'exécute une fois par contexte (mois × scenario)
export interface Regle {
  readonly id:           string
  readonly dependencies: string[]
  readonly mensuelle?:   true
  readonly scenariisee?: true

  // Extrait les entrées typées depuis deps et contexte
  prepare(deps: ResolvedDeps, ctx: ExecutionContext): unknown
  // Calcul pur — aucun effet de bord
  compute(prepared: unknown): unknown
  // Optionnel — écrit le résultat dans la deep copy DiagnosticWithData
  apply?(result: unknown, dpe: DiagnosticWithData): void
}

// Règle itérable — s'exécute une fois par élément d'une collection
export interface RegleIterable extends Regle {
  readonly scope: DiagnosticScope

  // Reçoit l'élément courant (Mur, Baie, etc.) en plus des deps
  prepare(element: unknown, deps: ResolvedDeps, ctx: ExecutionContext): unknown
  // Optionnel — écrit le résultat dans l'élément courant via la deep copy
  apply?(result: unknown, element: unknown, dpe: DiagnosticWithData): void
}

// Règle strategy — sélectionne une variante parmi plusieurs, puis calcule
//
// TElement  — type de l'élément itéré (PontThermique, Baie…)
// TPrepared — objet construit par prepare() et passé à la stratégie sélectionnée
// TResult   — type de retour des stratégies, stocké en cache
export interface RegleStrategy<TElement, TPrepared, TResult> extends RegleIterable {
  readonly strategies: Readonly<Record<string, (prepared: TPrepared) => TResult>>

  // Sélectionne la clé de stratégie à partir de l'élément courant
  select(element: TElement, deps: ResolvedDeps): keyof this["strategies"]

  prepare(element: TElement, deps: ResolvedDeps, ctx: ExecutionContext): TPrepared
  compute(prepared: TPrepared): TResult
  apply?(result: TResult, element: TElement, dpe: DiagnosticWithData): void
}
```

---

## Squelette d'une règle

```typescript
// Conventions
// - Fichier   : regle-{scope}-{variable}.ts    ex: regle-mur-u.ts
// - Classe    : Regle{Scope}{Variable}          ex: RegleMurU
// - id        : {domaine}:{scope}:{variable}    ex: "enveloppe:mur:u"
// - Fonctions pures : nommées selon la variable calculée, avec commentaire formule 3CL

class RegleMurU implements RegleIterable {
  readonly id         = "enveloppe:mur:u"
  readonly scope      = "murs" as const
  readonly dependencies: string[] = []

  prepare(mur: Mur, _deps: ResolvedDeps, _ctx: ExecutionContext) {
    return { epaisseur: mur.structures[0].epaisseur, conductivite: ... }
  }

  // u = λ / e  (W/m².K)  §x.x méthode 3CL
  compute({ epaisseur, conductivite }: ReturnType<this["prepare"]>): number {
    throw new Error("not implemented")
  }

  apply(u: number, mur: Mur, dpe: DiagnosticWithData): void {
    throw new Error("not implemented")
  }
}

class RegleDPMur implements RegleIterable {
  readonly id           = "enveloppe:mur:dp"
  readonly scope        = "murs" as const
  readonly dependencies = ["enveloppe:mur:sdep", "enveloppe:mur:u", "enveloppe:paroi:b"]

  prepare(mur: Mur, deps: ResolvedDeps, _ctx: ExecutionContext) {
    return {
      sdep: deps.get("enveloppe:mur:sdep"),  // typé number via RuleResultRegistry
      u:    deps.get("enveloppe:mur:u"),
      b:    deps.get("enveloppe:paroi:b"),
    }
  }

  // dp = Sdep × U × b
  compute({ sdep, u, b }: ReturnType<this["prepare"]>): number {
    throw new Error("not implemented")
  }

  apply(dp: number, mur: Mur, dpe: DiagnosticWithData): void {
    throw new Error("not implemented")
  }
}
```

---

## Squelette d'une règle Strategy

```typescript
// Les fonctions dans strategies/ partagent la signature (prepared: TPrepared) => TResult
// Aucune dépendance externe, aucun import de règle

// strategies/pont-thermique-refend-mur.ts
export function pontThermiqueRefendMur(
  prepared: { longueur: number; rows: PontThermiqueRow[] }
): number {
  throw new Error("not implemented")
}

// regle-pont-thermique-valeur.ts
type PontThermiquePrepared = { longueur: number; rows: PontThermiqueRow[] }

class RegleValeurPontThermique
  implements RegleStrategy<PontThermique, PontThermiquePrepared, number>
{
  readonly id           = "enveloppe:pont_thermique:valeur"
  readonly scope        = "ponts_thermiques" as const
  readonly dependencies: string[] = []

  constructor(private abaque: Abaque<PontThermiqueRow>) {}

  readonly strategies = {
    refend_mur:     pontThermiqueRefendMur,
    menuiserie_mur: pontThermiqueMenuiserieMur,
  } as const

  prepare(pont: PontThermique, _deps: ResolvedDeps, _ctx: ExecutionContext): PontThermiquePrepared {
    return { longueur: pont.longueur, rows: this.abaque.all() }
  }

  select(pont: PontThermique): keyof typeof this.strategies {
    throw new Error("not implemented")
  }

  compute(prepared: PontThermiquePrepared): number {
    return this.strategies[this.select(prepared.pont)](prepared)
  }

  apply(valeur: number, pont: PontThermique, dpe: DiagnosticWithData): void {
    throw new Error("not implemented")
  }
}
```

## Cache (`src/core/cache.ts`)

```typescript
// Clé de cache : {idRegle}[::uuid][::mois][::scenario]
// Exemples :
// "enveloppe:mur:dp"
// "enveloppe:mur:dp::550e8400-..."
// "chauffage:besoins::01::conventionnel"
// "chauffage:besoins::550e8400-...::06::depensier"

function buildKey(idRegle: string, ctx: ExecutionContext): string {
  const parts = [idRegle]
  if (ctx.uuid)     parts.push(ctx.uuid)
  if (ctx.mois)     parts.push(ctx.mois)
  if (ctx.scenario) parts.push(ctx.scenario)
  return parts.join("::")
}

// Résolution avec fallback — dégradation successive des axes
// Essai 1 : clé complète
// Essai 2 : sans mois
// Essai 3 : sans scenario
// Essai 4 : scalaire pure
// → permet à une règle non mensuelle d'être consommée depuis un contexte mensuel

// Invalidation ciblée par UUID + cascade via DAG
// invalidate(uuid) → supprime toutes les clés contenant cet UUID
// invalidateCascade(uuid) → remonte le DAG et invalide les règles dépendantes
```

---

## DAG (`src/core/dag.ts`)

```typescript
// Résolution à l'initialisation du moteur — une seule fois
// Algorithme de Kahn pour l'ordre topologique
// DFS pour la détection de cycles — fail-fast au démarrage
// getAncestors() — remontée du graphe pour l'invalidation en cascade

// Règles Strategy : les variantes (strategies/) n'ont pas d'id
// → jamais enregistrées dans le DAG
// → impossibilité structurelle d'appel direct depuis une autre règle
```

---

## Engine (`src/core/engine.ts`)

```typescript
// Point d'entrée : compute(dpe: Diagnostic): DiagnosticWithData
// - Reçoit une deep copy de Diagnostic (responsabilité de l'appelant)
// - Retourne la même deep copy hydratée en DiagnosticWithData

// Gestion des erreurs : mode fail-fast
// → la première règle en erreur arrête immédiatement le calcul
// → l'exception remonte à l'appelant non interceptée
// Justification : un DPE partiellement calculé n'a pas de sens réglementaire.

// Responsabilités du moteur :
// 1. Résoudre l'ordre topologique (DAG)
// 2. Pour chaque règle dans l'ordre :
//    a. Résoudre les contextes d'exécution (mois × scenario)
//    b. Si RegleIterable : itérer sur dpe.enveloppe[scope]
//    c. Construire ResolvedDeps (lecture cache, fallback scalaire)
//    d. Appeler prepare() → compute()
//    e. Stocker le résultat dans le cache
//    f. Appeler apply() si défini → hydrate la deep copy
// 3. Retourner la deep copy hydratée

// Le moteur ne connaît pas :
// - Les abaques
// - La logique de filtrage des données
// - La structure interne des règles
// - Les fonctions pures

// Contextes d'exécution :
// const MOIS      = Object.values(MoisEnum)      // itération si mensuelle: true
// const SCENARIOS = Object.values(ScenarioEnum)  // itération si scenariisee: true
// Règle simple          → 1 contexte
// Règle mensuelle       → 12 contextes
// Règle scénarisée      → 2 contextes
// Règle mensuelle+scén. → 24 contextes
```

---

## Composition (`src/rules/index.ts`)

```typescript
export function createEngine(): Engine {
  const abaques = createAbaques()

  return new Engine([
    // enveloppe
    new RegleMurU(),
    new RegleMurSdep(),
    new RegleDPMur(),
    new RegleValeurPontThermique(abaques.pontThermique),
    // chauffage
    // etiquette
    // ...
  ])
}

// Instance préconfigurée pour usage courant (ex : Next.js API routes).
// Stateless côté entrées, statefull sur le cache interne.
// En contexte concurrent (tests parallèles, multi-requêtes), préférer createEngine()
// par requête ou appeler engine.cache.clear() entre deux calculs.
export const engine = createEngine()
```

---

## Exports publics (`src/index.ts`)

```typescript
export { engine }                              // instance préconfigurée
export { Engine }                              // classe si instanciation custom
export type {
  Regle, RegleIterable, RegleStrategy,
  ResolvedDeps, ExecutionContext,
  DiagnosticScope, RuleResultRegistry,
}
// Les règles individuelles ne sont PAS exportées
// Les abaques ne sont PAS exportés
```

---

## Conventions règles

| Élément                | Convention                                                      |
| ---------------------- | --------------------------------------------------------------- |
| Fichier                | `regle-{scope}-{variable}.ts`                                   |
| Classe                 | `Regle{Scope}{Variable}`                                        |
| `id`                   | `{domaine}:{scope}:{variable}`                                  |
| `scope`                | Valeur de type `DiagnosticScope` — `as const` obligatoire       |
| Fonctions pures        | Nommées selon la variable calculée                              |
| Imports autorisés      | Fonctions pures colocalisées + `/utils` uniquement              |
| Abaque                 | Injecté via constructeur, typé `Abaque<S>`                      |
| `RuleResultRegistry`   | Alimenter pour chaque nouvelle règle avec id + type de retour   |
| Données intermédiaires | `apply` absent → cache moteur uniquement, jamais dans `/models` |
| Données publiques      | `apply` présent → hydrate la deep copy                          |

---

## Conventions tests

| Élément               | Convention                                                            |
| --------------------- | --------------------------------------------------------------------- |
| Localisation          | `tests/` miroir de `src/rules/`                                       |
| Fonctions pures       | Testées directement, aucun mock                                       |
| `select()` strategy   | Testée directement, aucun mock                                        |
| Abaque en test        | `abaqueMock<S>(rows)` — stub sur `Abaque<S>`, jamais sur `Repository` |
| `prepare` / `compute` | Non implémentés en phase 1 — `throw new Error("not implemented")`     |

---

## Phases de développement

**Phase 1 — Traduction de la méthode 3CL**
- Écrire toutes les règles avec `id`, `scope`, `dependencies`, fonctions pures
- `prepare` et `compute` non implémentés (`throw new Error("not implemented")`)
- Objectif : valider le DAG et la couverture de la méthode 3CL

Definition of Done :
- DAG instanciable sans erreur (aucun cycle détecté)
- Tous les `id` sont uniques dans le registre
- Toutes les `dependencies` référencent des `id` existants dans le registre
- `RuleResultRegistry` alimenté pour chaque règle

**Phase 2 — Implémentation du moteur**
- `core/` : Engine, Cache, DAG
- `abaques/` : Repository, repositories concrets

Definition of Done :
- `engine.compute(diagnostic)` s'exécute sur un `Diagnostic` minimal sans erreur
  (les règles lèvent `not implemented` mais le moteur orchestre correctement l'ordre et le cache)
- Tests unitaires de `Engine`, `EngineCache`, `DependencyGraph`

**Phase 3 — Implémentation des règles**
- `prepare`, `compute`, `apply` sur chaque règle
- Tests unitaires des fonctions pures
- Tests d'intégration sur `engine.compute(diagnostic)` avec un diagnostic réel

Definition of Done :
- Tests unitaires des fonctions pures passent (100 %)
- Test d'intégration : DPE de référence produit l'étiquette attendue (conformité 3CL)
