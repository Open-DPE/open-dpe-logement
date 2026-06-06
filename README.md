# Open DPE Logement

Monorepo communautaire pour la transparence, la fiabilité et la compréhension du Diagnostic de Performance Énergétique (DPE).

## Objectifs

- **Transparence** — centraliser la doctrine réglementaire, les schémas de données publics et le code dans un seul dépôt auditable
- **Fiabilité** — garantir que deux DPE identiques et justes produisent systématiquement le même résultat
- **Compréhension** — offrir un espace de référence partagé pour la communauté des exploitants et producteurs de données DPE

## Organisation

```text
doctrine/                       # Référentiel doctrinal
schemas/                        # Schémas de données publiques JSON Schema
apps/                           # Applications
packages/
├── engine/                     # Moteur de calcul 3CL-DPE
├── models/                     # Types TypeScript (écriture manuelle, stables)
├── schemas/                    # Repositories des schémas de données publiques et validation
├── transformer/                # Transformers de données (schemas → schemas)
└── database/                   # Infrastructure SQL
```

## Stack

- Node.js ≥ 18
- TypeScript ≥ 5
- npm >= 11
- Turborepo
- Next.js 16
- React 19
- ESLint

## Commandes

| Commande              | Description                               |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Lance tous les apps en mode développement |
| `npm run build`       | Build toutes les apps et packages         |
| `npm run lint`        | Lint l'ensemble du monorepo               |
| `npm run check-types` | Vérification TypeScript                   |
| `npm run format`      | Formatage avec Prettier                   |

Pour cibler un workspace spécifique :

```sh
npx turbo dev --filter=web
npx turbo build --filter=@dpe-audit/core
```

## Feuilles de route

1. Alpha

- [x] Doctrine 3CL-DPE
- [ ] Schémas de données publiques - `schemas`  `packages/schemas`
- [ ] Moteur de calcul - `packages/engine`
- [ ] Modèle de données - `packages/models`

2. Beta

- [ ] Migration des données Observatoire DPE - `packages/transformer`
- [ ] Tests de régression - `packages/transformer`

## Contribution

Ce monorepo est également un **espace d'échange collaboratif** pour les exploitants et producteurs de données DPE.

- Les contributions doctrinales (corrections, extensions) sont les bienvenues via Pull Request
- Les discussions sur la méthode se tiennent dans les Issues
- La gouvernance des contributions extra-réglementaires est décrite dans [`CONTRIBUTING.md`](./CONTRIBUTING.md)

## Licence

Voir [`LICENSE`](./LICENSE)
