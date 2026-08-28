# Fixtures DPE

XML réels téléchargés depuis `https://observatoire-dpe-audit.ademe.fr/afficher-dpe/{numero_dpe}`, sélectionnés depuis l'open data ADEME (`dpe03existant`).

## Convention

Pool plat : tous les fichiers `<numero_dpe>.xml` sont au même niveau, sans sous-dossier par version XSD.

- `manifest.json` : index **généré automatiquement**, ne pas éditer à la main. Pour chaque fichier : `numero_dpe`, `version_dpe`, `file`.
- La version XSD de chaque fichier est déterminée en lisant son contenu (`<enum_version_id>`), jamais depuis son emplacement sur disque — la donnée est auto-suffisante, le manifeste n'est qu'un index dérivé.

## Régénérer le manifeste

Après tout ajout ou suppression de fichier XML dans ce dossier :

```sh
npm run generate-manifest --workspace=@open-dpe-logement/ademe-fixtures
```

(ou directement `node scripts/generate-manifest.mjs` depuis `packages/ademe-fixtures`)

## Ajouter une fixture

Déposer le fichier `<numero_dpe>.xml` directement dans ce dossier, puis régénérer le manifeste.
