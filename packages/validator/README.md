# @open-dpe-logement/validator

Validation des données du Diagnostic de Performance Énergétique.

## Installation

```sh
npm i @open-dpe-logement/validator
```

## Usage

```ts
import { validate } from "@open-dpe-logement/validator";

const response = validate("/diagnostic", {...});

if (response.valid) {
    const data = { response } // Données typées
} else {
    const errors = { response } // Erreurs
}
```

## Todo

- [ ] Implémentation des règles de validation complémentaires
