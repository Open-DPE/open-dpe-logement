# Fixtures DPE

XML réels téléchargés depuis `https://observatoire-dpe-audit.ademe.fr/afficher-dpe/{numero_dpe}`, sélectionnés depuis l'open data ADEME (`dpe03existant`).

## Convention

Un dossier par version XSD (`v2`, `v2.2`, `v2.3`, `v2.4`, `v2.5`, `v2.6`), chacun contenant :

- `manifest.json` : liste des fixtures attendues (`numero_dpe`, `version_dpe`, `critere`)
- `<numero_dpe>.xml` : fichier téléchargé correspondant, à ajouter manuellement

Le `numero_dpe` de chaque fichier attendu par version est listé dans `manifest.json`. Les tests (`../../dpe/*.test.ts`) ignorent (`skip`) les fixtures manquantes plutôt que d'échouer, pour permettre un ajout progressif.
