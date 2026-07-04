# @open-dpe-logement/engine

Moteur de calcul 3CL-DPE 2021.

## Installation

```sh
npm i @open-dpe-logement/engine
```

## Usage

```ts
import { engine } from "@open-dpe-logement/engine"

// À appeler une seule fois (au démarrage de l'application
await engine.init();

const diagnostic = {...};

const { data, log } = engine.calcule({ diagnostic }) // scenario: 'conventionnel'
const { data, log } = engine.calcule({ diagnostic, scenario: 'depensier' }) // scenario: 'depensier'
```

## Organisation

```text
/src
├── core/
│   ├── cache.ts                    # Cache des contextes de calcul
│   ├── init.ts                     # Point d'entrée d'initialisation des données abaques
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
