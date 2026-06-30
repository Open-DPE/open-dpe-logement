# @open-dpe-logement/transformer

Transformation des 

Package pour la transformation des données du Diagnostic de Performance Energétique (DPE) entre le modèle de données de l'[Observatoire DPE Audit](https://gitlab.com/observatoire-dpe/observatoire-dpe/-/raw/master/modele_donnee/modele_commun_DPE_audit.xsd) et le modèle de données Open DPE.

```text
Observatoire Schema -> Open DPE Schema
Open DPE Schema -> Observatoire Schema
```

## Usages

```typescript
import { transform, reverseTransform } from "@open-dpe-logement/transformer"

const data = transform(/** Open DPE data **/); //
const data = reverseTransform(/** Observatoire DPE data **/);
```
