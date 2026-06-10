# @open-dpe-logement/abaques

Tables de valeurs forfaitaires utilisées par l'application de la méthode 3CL-DPE 2021.

## Installation

```sh
npm i @open-dpe-logement/abaques
```

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
/src
├── data/                           # Données compilées en lecture seule
├── repositories/                   # Chargement et filtres
└── index.ts                        # Point d'entrée
```
