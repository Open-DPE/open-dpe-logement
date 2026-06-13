# @open-dpe-logement/engine

Moteur de calcul 3CL-DPE 2021.

## Installation

```sh
npm i @open-dpe-logement/engine
```

## Usage

```ts
import { createContext, rules, formulas, services } from "@open-dpe-logement/engine"

const diagnostic = {...};

createContext({ diagnostic }) // scenario: 'conventionnel'
createContext({ diagnostic, scenario: 'depensier' }) // scenario: 'depensier'

// Application d'une formule de calcule
formulas.climat.calcule_zone_climatique({ code_departement: "84" })

// Application d'une règle
const context = createContext({ diagnostic });
rules.climat.zone_climatique(context);

// Calcule d'un diagnostic
const context = createContext({ diagnostic });
const data = services.diagnostic.calcule(context);

// Liste des données calculées
context.log();
```

## Organisation

```text
/src
├── core/
│   ├── cache.ts                    # Gestion du cache
│   ├── context.ts                  # Contexte d'exécution du moteur de calcul
│   └── registry.ts                 # Registre des règles de calcul
├── rules/
│   ├── <domaine>/
│   │    ├── constants.ts           # Déclaration NAMESPACE + RULES
│   │    ├── formulas.ts            # Formules de calcul (fonctions pures)
│   │    ├── rules.ts               # Règles de calcul (orchestrateur)
│   │    └── service.ts             # Hydrate les données calculées
│   ├── errors.ts
│   ├── helpers.ts
│   └── math.ts
└── index.ts                        # Point d'entrée
```

## Formules de calcul

### Tags JSDoc

- `@formule` : Documente la formule de calcul implémentée
- `@guard` : Documente la condition d'application de la formule de calcul
- `@abaque` : Documente l'abaque utilisée par la formule de calcul

### Tests

Toutes les formules de calcul sont testées :

1. Cas limites
2. Valeurs forfaitaires
