# Schémas de données publiques

Standard de données publiques DPE Logement.

## Organisation

```text
schemas/
├── batiment/
├── chauffage/
├── ecs/
├── enveloppe/
├── production/
├── refroidissement/
├── ventilation/
├── manifest.schema.yaml        # Schéma des manifestes de versions
├── schemas.yaml                # Point d'entrée
└── CHANGELOG.md
```

## Versionnage

Les schémas publics sont **contractuels et stables**.

## Spécifications

- JSON Schéma 2020-12
- Schémas sources en YAML
- Compilation en YAML et JSON
- UTF-8

## Schémas publics et privés

- `_*.yaml` -> schémas privés
- `*.yaml` -> schémas publics

## Keywords

Mots-clés JSON Schema personnalisés.

### `x-enum`

**Type :** `string`
**Format :** `^([a-z-]+:)*([a-z-]+)$`
**Exemple :** `x-enum: batiment:type`

Identifie une valeur énumérable dans le [dictionnaire](../doctrine/dict/enums.csv).

La valeur énumérable DOIT exister dans le dictionnaire.

Les énumérations DOIVENT exister dans le dictionnaires, sans exception ni ajout.

### `readOnly`

[Open API Spec](https://spec.openapis.org/oas/v3.2.0.html#validating-readonly-and-writeonly)

Une propriété `readOnly` ne DEVRAIT pas être renseignée par le client et sera ignorée.

Une propriété `readOnly` est toujours déterminée par le serveur (données calculées par ex.).

Une propriété `readOnly` ne DOIT PAS être présent dans le bloc `required`.

## Design

### Convention de nommage des URI

- kebab-case

### Convention de nommage des propriétés

- snake_case

### Polymorphisme

Par convention, tous les champs d'un schéma doivent être renseignées.

Une valeur non applicable dans un sous schéma doit être `null`.

Exemple :

```yaml
type: object
properties:
  foo:
    type: string
    enum: [A, B]
  bar:
    type: [number, "null"]
required:
  - foo
  - bar

oneOf:
  - properties:
      foo: { const: A }
      bar: { type: "null", const: null, default: null }
    required: [foo, bar]
  - properties:
      foo: { const: B }
    required: [foo]

```

### Valeurs inconnues

```yaml
# "null" signifie ici inconnue
type: [number, "null"]
```
