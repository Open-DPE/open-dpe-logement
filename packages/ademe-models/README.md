# @open-dpe-logement/ademe-models

Modèles de données publiques de l'[observatoire DPE-Audit](https://gitlab.com/observatoire-dpe/observatoire-dpe).

## Installation

```sh
npm i @open-dpe-logement/ademe-models
```

## Usage

```ts
import { type DPE, fetchDPE } from "@open-dpe-logement/open-data";

const data = await fetchDPE("xxxxxxx", {
    client_id: "xxxxxxx",
    client_secret: "xxxxxxx",
});
```
