# Open DPE Logement

Monorepo communautaire pour la transparence, la fiabilité et la compréhension du Diagnostic de Performance Énergétique (DPE).

## Objectifs

- **Transparence** — centraliser la doctrine réglementaire, les schémas de données publics et le code dans un seul dépôt auditable
- **Fiabilité** — garantir que deux DPE identiques et justes produisent systématiquement le même résultat
- **Compréhension** — offrir un espace de référence partagé pour la communauté des exploitants et producteurs de données DPE

## Support

- ✅ Logement existant - Maison individuelle
- ✅ Logement existant - Immeuble collectif
- ✅ Logement existant - Appartement
- ⏳ Logement existant - Appartement depuis les données d'un immeuble collectif  
- ❌ Logement neuf
- ❌ Tertiaire

## Organisation

```text
doctrine/                       # Référentiel doctrinal
apps/                           # Applications
packages/
├── ademe-client/               # Client HTTP pour l'API publique de l'observatoire DPE-Audit
├── ademe-fixtures/             # Fixtures XML réelles de l'observatoire DPE-Audit
├── ademe-mapper/               # Couversion schéma Observatoire DPE-Audit -> Open DPE Logement
├── ademe-models/               # Modèles TypeScript pour les exports XML de l'observatoire DPE-Audit (ADEME)
├── engine/                     # Moteur de calcul 3CL-DPE
├── engine-abaques/             # Tables de valeurs forfaitaires 3CL-DPE 2021
├── models/                     # Implémentation des schémas de données publiques
├── storage/                    # Infrastructure SQL
├── schemas/                    # Schémas de données publiques JSON Schema
├── validator/                  # Fonctions de validation des données
└── web-components/             # Bibliothèque de composants web DPE
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
npm run abaques:generate                    # Régénère `/packages/abaques/data` depuis `/packages/abaques/doctrine`
npm run schemas:generate                    # Exporte les schémas de données publiques depuis `/schemas` vers `/packages/schemas`

```

## Contribution

Ce monorepo est également un **espace d'échange collaboratif** pour les exploitants et producteurs de données DPE.

- Les contributions doctrinales (corrections, extensions) sont les bienvenues via Pull Request
- Les discussions sur la méthode se tiennent dans les Issues
- La gouvernance des contributions extra-réglementaires est décrite dans [`CONTRIBUTING.md`](./CONTRIBUTING.md)

## Licence

Voir [`LICENSE`](./LICENSE)
