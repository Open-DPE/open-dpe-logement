# @open-dpe-logement/ademe-models

Modèles de données publiques de l'[observatoire DPE-Audit](https://gitlab.com/observatoire-dpe/observatoire-dpe).

## Installation

```sh
npm i @open-dpe-logement/ademe-models
```

## Usage

```ts
import { dpe } from "@open-dpe-logement/ademe-models";

const xml = `<dpe></dpe>`;
const data = dpe.parse(xml); // type dpe.DPE
```
