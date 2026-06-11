# @open-dpe-logement/engine

Moteur de calcul 3CL-DPE 2021.

## Installation

```sh
npm i @open-dpe-logement/engine
```

## Usage

```ts
import { createContext, calcule, rules, formulas } from "@open-dpe-logement/engine"

const diagnostic = {...};

// Application d'une formule de calcule
formulas.climat.calcule_zone_climatique({ code_departement: "84" })

// Application d'une règle
const context = createContext({ diagnostic });
rules.climat.zone_climatique(context);

// Calcule d'un diagnostic
const data = calcule({ diagnostic })

// Scénarios d'usage
createContext({ diagnostic }) // scenario: 'conventionnel'
createContext({ diagnostic, scenario: 'depensier' }) // scenario: 'depensier'
calcule({ diagnostic }) // scenario: 'conventionnel'
calcule({ diagnostic, scenario: 'depensier' }) // scenario: 'depensier'
```

## Organisation

```text
/src
├── core/
│   ├── cache.ts                    # Gestion du cache
│   ├── context.ts                  # Données d'entrée, scénario de calcul, gestion des dépendances
│   ├── engine.ts                   # Moteur de calcul
│   └── results.ts                  # Typage des données calculées
├── rules/
│   ├── <domaine>/
│   │    ├── formules.ts            # Formules de calcul (fonctions pures)
│   │    ├── registry.ts            # Registre des règles
│   │    └── rules.ts               # Règles de calcul (orchestrateur)
│   ├── errors.ts
│   ├── helpers.ts
│   └── math.ts
└── index.ts                        # Point d'entrée
```

## Formules de calcul

### Tags JSDoc

- `@formules path.to.formule` : Documente la formule de calcul implémentée
- `@abaque path.to.abaque` : Documente l'abaque utilisée par la formule de calcul
