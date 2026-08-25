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

## Tests

```sh
npm run test
```

Tests d'intégration.

## Support

|   XSD   | Support |                 Commentaire                 |
| :-----: | :-----: | :-----------------------------------------: |
|  DPEv1  |   non   |              Version obsolète               |
|  DPEv2  |   non   | Double fenêtre manquante dans le modèle XSD |
| DPEv2.2 |   oui   |                      -                      |
| DPEv2.3 |   oui   |                      -                      |
| DPEv2.4 |   oui   |                      -                      |
| DPEv2.5 |   oui   |                      -                      |
| DPEv2.6 |   oui   |                      -                      |
