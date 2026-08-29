# @open-dpe-logement/abaques

Tables de valeurs forfaitaires utilisées par l'application de la méthode 3CL-DPE 2021.

## Installation

```sh
npm i @open-dpe-logement/abaques
```

## Commandes

| Commande              | Effet                                        |
| --------------------- | -------------------------------------------- |
| `npm run build`       | Compile `src/` → `dist/` (types + JS, `tsc`) |
| `npm run check-types` | Vérification TypeScript sans émission        |
| `npm test`            | Lance la suite de tests                      |

## Usages

```ts
import { abaques } from "@open-dpe-logement/abaques";

const abaque = abaques.climat.zone_climatique;
const query = { code_departement: "84" }
const match = abaque.search(query, abaque.load()).at(0);
const value = match?.zone_climatique; // "H2d"
```

## Organisation

```text
/doctrine                           # Source de vérité
/src
├── data/                           # Données compilées en lecture seule
├── repositories/                   # Chargement et filtres
└── index.ts                        # Point d'entrée
```

## Spécifications

- CSV
- Encodage UTF-8
- Séparateur ";"

### En-têtes

- Snake case
- Minuscules sans accents

### En tête de comparaison

- `<filtre>/eq` : Équivalent à
- `<filtre>/lt` : Inférieur à
- `<filtre>/lte` : Inférieur ou égal à
- `<filtre>/gt` : Supérieur à
- `<filtre>/gte` : Supérieur ou égal à

### Schémas

Chaque fichier CSV est décrit par un schéma [Table Schéma](https://datapackage.org/standard/table-schema/) au format YAML :

```text
/doctrine/chauffage/combustion.csv
/doctrine/chauffage/combustion.schema.yaml
```

#### Mots clés

- **x-enum** : Référence une valeur dans le dictionnaire des énumérations.
