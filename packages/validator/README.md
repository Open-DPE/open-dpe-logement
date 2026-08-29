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

- [x] [RC-001 : Cohérence de l'adresse](#rc-001--cohérence-de-ladresse)

## Règles de cohérence

Les règles de cohérence ci-après ne sont pas supportées par JSON Schema et doivent être implémentées lors de la validation.

### RC-001 : Cohérence de l'adresse

Path : `diagnostic.batiment.adresse`

Contrainte : `code_postal` et `code_insee` vérifiés depuis la Base d'Adresse Nationale.

> **Non implémentée.** Contrairement aux trois autres, cette règle nécessite un appel réseau (API BAN) alors
> que `validate()` et le reste du package sont synchrones. Traitement à concevoir séparément (fonction async
> dédiée, ou passage de `validate()` en async) — voir `claude/design-regles-validator.md` §5.2.

### RC-002 : Cohérence des années d'installation / construction / rénovation

Paths:

- `diagnostic..annee_installation`
- `diagnostic..annee_construction`
- `diagnostic..annee_renovation`

Contraintes :

- Valeur supérieure ou égale à `diagnostic.batiment.annee_construction`.
- Valeur inférieure ou égale à `diagnostic.annee_etablissement`.

### RC-003 : Cohérence des années d'isolation

Paths : `diagnostic..isolation.annee_installation`

Contrainte : Valeur supérieure ou égale à `annee_construction` et `annee_renovation` du parent.

### RC-004 : Cohérence des références internes

Paths :

- `$.diagnostic..local_non_chauffe_id`
- `$.diagnostic..mur_id`
- `$.diagnostic..plancher_id`
- `$.diagnostic..paroi_id`
- `$.diagnostic..ouverture_id`
- `$.diagnostic..baie_id`
- `$.diagnostic..generateur_id`
- `$.diagnostic..generateur_mixte_id`
- `$.diagnostic..emetteurs`

Contrainte : La valeur référence un identifiant existant.
