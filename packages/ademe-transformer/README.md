# @open-dpe-logement/ademe-transformer

Conversion des données DPE de l'observatoire DPE-Audit.

## Installation

```sh
npm i @open-dpe-logement/ademe-transformer
```

## Usages

```ts
import { fromDPE, toDPE } from "@open-dpe-logement/transformer"

const data = fromObservatoire(/** Observatoire DPE data **/);
const data = toObservatoire(/** Open DPE data **/); //
```


```text
/from
├── refroidissement.ts
├── refroidissement.mapping.ts
├── ventilation.ts
├── ventilation.mapping.ts
├── utils.ts
/to                                 # next
```


```text
/<domaine>
├── transform.mapping.ts
├── transform.ts
├── reverse.mapping.ts
├── reverse.ts
```