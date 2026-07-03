# Règles de cohérence

|                Path                 | Conditions |                                              Règles                                              |
| :---------------------------------: | :--------: | :----------------------------------------------------------------------------------------------: |
|            `$..adresse`             |     -      |            `code_postal` et `code_insee` vérifiés depuis la Base d'Adresse Nationale             |
|       `$..annee_installation`       |     -      |            `annee_installation` supérieur ou égal à `$..batiment.annee_construction`             |
|        `$..annee_renovation`        |     -      |             `annee_renovation` supérieur ou égal à `$..batiment.annee_construction`              |
|  `$.enveloppe..annee_construction`  |     -      |            `annee_construction` supérieur ou égal à `$..batiment.annee_construction`             |
|         `$.enveloppe..mur`          |     -      | `isolation.annee_installation` supérieur ou égal à `annee_construction` et à `annee_renovation`  |
|     `$.enveloppe..plancher_bas`     |     -      | `isolation.annee_installation` supérieur ou égal à `annee_construction` et à `annee_renovation`  |
|    `$.enveloppe..plancher_haut`     |     -      | `isolation.annee_installation` supérieur ou égal à `annee_construction` et à  `annee_renovation` |
| `$.enveloppe..local_non_chauffe_id` |     -      |             `local_non_chauffe_id` existe dans `$.enveloppe.locaux_non_chauffes..id`             |
|        `$.enveloppe..mur_id`        |     -      |                           `mur_id` existe dans `$.enveloppe.murs..id`                            |
|     `$.enveloppe..plancher_id`      |     -      |        `plancher_id` existe dans `$.enveloppe["planchers_bas", "planchers_hauts"][*]..id`        |
|       `$.enveloppe..paroi_id`       |     -      |     `paroi_id` existe dans `$.enveloppe["murs", "planchers_bas", "planchers_hauts"][*]..id`      |
|       `$.enveloppe..baie_id`        |     -      |                          `baie_id` existe dans `$.enveloppe.baies..id`                           |
|     `$.chauffage..emetteur_id`      |     -      |                      `emetteur_id` existe dans `$.chauffage.emetteurs..id`                       |
|    `$.chauffage..generateur_id`     |     -      |                    `generateur_id` existe dans `$.chauffage.generateurs..id`                     |
| `$.chauffage..generateur_mixte_id`  |     -      |                    `generateur_mixte_id` existe dans `$.ecs.generateurs..id`                     |
|   `$.chauffage..installation_id`    |     -      |                  `installation_id` existe dans `$.chauffage.installations..id`                   |
|          `$.systeme..type`          |     -      |        `type` est `divise` si `generateur_id` référence un générateur de chauffage divisé        |
|          `$.systeme..type`          |     -      |       `type` est `central` si `generateur_id` référence un générateur de chauffage central       |
|       `$.ecs..generateur_id`        |     -      |                       `generateur_id` existe dans `$.ecs.generateurs..id`                        |
|    `$.ecs..generateur_mixte_id`     |     -      |                 `generateur_mixte_id` existe dans `$.chauffage.generateurs..id`                  |
|      `$.ecs..installation_id`       |     -      |                     `installation_id` existe dans `$.ecs.installations..id`                      |
| `$.refroidissement..generateur_id`  |     -      |                 `generateur_id` existe dans `$.refroidissement.generateurs..id`                  |
