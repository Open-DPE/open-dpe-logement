# @open-dpe-logement/ademe-client

Wrapper de l'API publique de l'[observatoire DPE-Audit](https://eu1.anypoint.mulesoft.com/exchange/portals/ademe/).

## Installation

```sh
npm i @open-dpe-logement/ademe-client
```

## Usage

```ts
import { fetchDPE } from "@open-dpe-logement/ademe-client";

const data = await fetchDPE("xxxxxxx", {
    client_id: "xxxxxxx",
    client_secret: "xxxxxxx",
});
```
