# @open-dpe-logement/ademe-client

Wrapper de l'API publique de l'[observatoire DPE-Audit](https://eu1.anypoint.mulesoft.com/exchange/portals/ademe/5dbd7b95-bc7d-47ed-be4a-d40b49eb8e47/x-ademe-externe-api/minor/1.0/console/method/%236056/).

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
