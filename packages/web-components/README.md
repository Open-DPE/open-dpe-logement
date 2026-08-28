# @open-dpe-logement/web-components

Librairie de composants web (Web Components) dédiés à l'affichage des données du DPE.

## Installation

```sh
npm i @open-dpe-logement/web-components
```

## Commandes

| Commande              | Effet                                        |
| --------------------- | -------------------------------------------- |
| `npm run build`       | Compile `src/` → `dist/` (types + JS, `tsc`) |
| `npm run check-types` | Vérification TypeScript sans émission        |
| `npm test`            | Lance la suite de tests                      |

## Organisation

```text
/src
├── <component>/
│   └── index.ts
├── shared/
│   ├── colors.ts
│   └── utils.ts
└── index.ts                        # Point d'entrée
```
