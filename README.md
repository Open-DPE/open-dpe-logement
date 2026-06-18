# Open DPE Logement

Monorepo communautaire pour la transparence, la fiabilité et la compréhension du Diagnostic de Performance Énergétique (DPE).

## Objectifs

- **Transparence** — centraliser la doctrine réglementaire, les schémas de données publics et le code dans un seul dépôt auditable
- **Fiabilité** — garantir que deux DPE identiques et justes produisent systématiquement le même résultat
- **Compréhension** — offrir un espace de référence partagé pour la communauté des exploitants et producteurs de données DPE

## Support

- [x] Maison individuelle
- [x] Immeuble collectif
- [x] Appartement
- [ ] Appartement depuis les données d'un immeuble collectif  

## Organisation

```text
doctrine/                       # Référentiel doctrinal
schemas/                        # Schémas de données publiques JSON Schema
apps/                           # Applications
packages/
├── engine/                     # Moteur de calcul 3CL-DPE
├── models/                     # Implémentation des schémas de données publiques
├── schemas/                    # Export des schémas de données publiques et validation
├── transformer/                # Transformers de données (schemas to schemas)
└── database/                   # Infrastructure SQL
```

## Stack

- Node.js ≥ 18
- TypeScript ≥ 5
- npm >= 11
- Turborepo
- ESLint

## Commandes

```sh
npm run dev                                 # Lance tous les apps en mode développement
npx turbo dev --filter=web                  # Lance une app spécifique
npm run build                               # Build toutes les apps et packages
npx turbo build --filter=@dpe-audit/core    # Build un workspace spécifique
npm run lint                                # Lint l'ensemble du monorepo
npm run check-types                         # Vérification TypeScript
npm run format                              # Formatage avec Prettier
npm run abaques:generate                    # Exporte les abaques depuis `/doctrine/abaques` vers `/packages/abaques`
npm run schemas:generate                    # Exporte les schémas de données publiques depuis `/schemas` vers `/packages/schemas`

```

## Contribution

Ce monorepo est également un **espace d'échange collaboratif** pour les exploitants et producteurs de données DPE.

- Les contributions doctrinales (corrections, extensions) sont les bienvenues via Pull Request
- Les discussions sur la méthode se tiennent dans les Issues
- La gouvernance des contributions extra-réglementaires est décrite dans [`CONTRIBUTING.md`](./CONTRIBUTING.md)

## Licence

Voir [`LICENSE`](./LICENSE)
