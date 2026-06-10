# @open-dpe-logement/schemas

Schémas de données publiques Open DPE Logement.

## Installation

```sh
npm i @open-dpe-logement/schemas
```

## Usage

```javascript
import { get, validate, SCHEMA_KEYS } from @open-dpe-logement/schemas

// Retourne le schéma de données publiques Diagnostic
const schema = get(SCHEMA_KEYS['diagnostic']);

// Validation des données
const validation = validate(schema, { ... });
if (!validation.isValid) {
    console.log(validation.errors)
}
```
