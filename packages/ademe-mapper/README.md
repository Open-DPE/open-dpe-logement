# @open-dpe-logement/ademe-mapper

Conversion des données DPE de l'observatoire DPE-Audit.

## Installation

```sh
npm i @open-dpe-logement/ademe-mapper
```

## Usages

```ts
import { mapFromDPE, mapFromAudit } from "@open-dpe-logement/ademe-mapper"

const data = mapFromDPE({/* dpe */})
const data = mapFromAudit({/* audit */}, "0")
```

## Tests

```sh
npm run test
```

Tests d'intégration.

## Support

|    XSD     | Support |       Commentaire       |
| :--------: | :-----: | :---------------------: |
|   DPEv1    |   non   |    Version obsolète     |
|   DPEv2    |   non   | Références optionnelles |
|  DPEv2.2   |   oui   |            -            |
|  DPEv2.3   |   oui   |            -            |
|  DPEv2.4   |   oui   |            -            |
|  DPEv2.5   |   oui   |            -            |
|  DPEv2.6   |   oui   |            -            |
| Audit_v2.0 |   oui   |            -            |
| Audit_v2.1 |   oui   |            -            |
| Audit_v2.2 |   oui   |            -            |
| Audit_v2.3 |   oui   |            -            |
| Audit_v2.4 |   oui   |            -            |
| Audit_v2.5 |   oui   |            -            |
