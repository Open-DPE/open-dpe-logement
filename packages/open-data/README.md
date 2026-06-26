# @open-dpe-logement/open-data

Accès aux données de l'observatoire DPE-Audit.

## Installation

```sh
npm i @open-dpe-logement/open-data
```

## Usage

```ts
import { fetchDPE } from "@open-dpe-logement/open-data";

const dpe = await fetchDPE("xxxxxxx", {
    client_id: "xxxxxxx",
    client_secret: "xxxxxxx",
});
```

## Sources

- [API DPE](https://eu1.anypoint.mulesoft.com/exchange/portals/ademe/5dbd7b95-bc7d-47ed-be4a-d40b49eb8e47/x-ademe-externe-api/minor/1.0/console/method/%236056/)
- [Observatoire DPE-Audit](https://gitlab.com/observatoire-dpe/observatoire-dpe)
