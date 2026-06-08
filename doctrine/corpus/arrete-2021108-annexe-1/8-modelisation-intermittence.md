## 8 Modélisation de l'intermittence

---

**Données d'entrée :**

Type de bâtiment

Type de chauffage (divisé, central)

Type de régulation (par pièce ou non)

Équipement d'intermittence (absent, central sans minimum de température, …)

Type d'émetteur (air soufflé, convecteurs, …)

Présence d'un comptage

Hauteur moyenne sous plafond

---

Le facteur d'intermittence traduit les baisses temporaires de température, réalisées pour différentes raisons, absence, ralenti de nuit et éventuellement de façon inégale dans les pièces.

Il est égal au rapport entre les besoins réels, compte tenu d'un comportement moyen des occupants, et les besoins théoriques. Le facteur d'intermittence est donné par la formule :

$$INT = \frac{I_0}{1 + 0{,}1 * (G - 1)}$$

Avec :

$$G = \frac{GV}{Hsp * Sh}$$

- $GV$ : déperditions annuelles de l'enveloppe (W/K) (déterminé en partie 3)
- $Sh$ : surface habitable (m²)
- $Hsp$ : hauteur moyenne sous plafond (m)

**Valeurs de $I_0$ — Maisons individuelles (chauffage individuel)**

|                                                         |                        | Inertie légère ou moyenne |                      |                      |                        |                                    | Inertie lourde ou très lourde |                      |                      |                        |                                    |
| :------------------------------------------------------ | :--------------------- | :-----------------------: | :------------------: | :------------------: | :--------------------: | :--------------------------------: | :---------------------------: | :------------------: | :------------------: | :--------------------: | :--------------------------------: |
|                                                         |                        |          Absent           | Central sans min. T° | Central avec min. T° | Par pièce avec min. T° | Par pièce avec min. T° + détection |            Absent             | Central sans min. T° | Central avec min. T° | Par pièce avec min. T° | Par pièce avec min. T° + détection |
| **Chauffage divisé** — avec régulation pièce par pièce  | Air soufflé            |           0,84            |         0,83         |         0,81         |          0,77          |                0,75                |             0,86              |         0,85         |         0,83         |          0,80          |                0,78                |
|                                                         | Radiateur / Convecteur |           0,84            |         0,83         |         0,81         |          0,77          |                0,75                |             0,86              |         0,85         |         0,83         |          0,80          |                0,78                |
|                                                         | Plafond chauffant      |           0,84            |         0,83         |         0,81         |          0,77          |                0,75                |             0,86              |         0,85         |         0,83         |          0,80          |                0,78                |
|                                                         | Plancher chauffant     |           0,90            |         0,89         |         0,88         |          0,86          |                 —                  |             0,92              |         0,91         |         0,90         |          0,88          |                 —                  |
| **Chauffage central** — avec régulation pièce par pièce | Air soufflé            |           0,86            |         0,85         |         0,83         |          0,79          |                0,77                |             0,88              |         0,87         |         0,85         |          0,82          |                0,80                |
|                                                         | Radiateur              |           0,88            |         0,87         |         0,85         |          0,82          |                0,80                |             0,90              |         0,89         |         0,87         |          0,85          |                0,82                |
|                                                         | Plafond chauffant      |           0,88            |         0,87         |         0,85         |          0,82          |                0,80                |             0,90              |         0,89         |         0,87         |          0,85          |                0,82                |
|                                                         | Plancher chauffant     |           0,90            |         0,89         |         0,88         |          0,86          |                 —                  |             0,92              |         0,91         |         0,90         |          0,88          |                 —                  |
| **Chauffage central** — sans régulation pièce par pièce | Air soufflé            |           0,90            |         0,89         |         0,87         |           —            |                                    |             0,91              |         0,91         |         0,89         |           —            |                                    |
|                                                         | Radiateur              |           0,91            |         0,90         |         0,88         |           —            |                                    |             0,93              |         0,92         |         0,90         |           —            |                                    |
|                                                         | Plafond chauffant      |           0,91            |         0,90         |         0,88         |           —            |                                    |             0,93              |         0,92         |         0,90         |           —            |                                    |
|                                                         | Plancher chauffant     |           0,92            |         0,91         |         0,90         |           —            |                                    |             0,94              |         0,93         |         0,92         |           —            |                                    |

Une maison individuelle branchée sur un réseau collectif de fourniture d'énergie pour le chauffage sera traitée comme une maison individuelle avec un chauffage individuel central.

**Valeurs de $I_0$ — Immeubles collectifs avec chauffage individuel**

|                                                         |                        | Absent | Central sans min. T° | Central avec min. T° | Par pièce avec min. T° | Par pièce avec min. T° + détection |
| :------------------------------------------------------ | :--------------------- | :----: | :------------------: | :------------------: | :--------------------: | :--------------------------------: |
| **Chauffage divisé** — avec régulation pièce par pièce  | Air soufflé            |  0,90  |         0,89         |         0,88         |          0,86          |                0,83                |
|                                                         | Radiateur / Convecteur |  0,90  |         0,89         |         0,88         |          0,86          |                0,83                |
|                                                         | Plafond chauffant      |  0,90  |         0,89         |         0,88         |          0,86          |                0,83                |
|                                                         | Plancher chauffant     |  0,95  |         0,94         |         0,93         |          0,91          |                 —                  |
| **Chauffage central** — avec régulation pièce par pièce | Air soufflé            |  0,91  |         0,90         |         0,89         |          0,87          |                0,84                |
|                                                         | Radiateur              |  0,93  |         0,92         |         0,91         |          0,89          |                0,86                |
|                                                         | Plafond chauffant      |  0,93  |         0,92         |         0,91         |          0,89          |                0,86                |
|                                                         | Plancher chauffant     |  0,95  |         0,94         |         0,93         |          0,91          |                 —                  |
| **Chauffage central** — sans régulation pièce par pièce | Air soufflé            |  0,95  |         0,94         |         0,93         |           —            |                                    |
|                                                         | Radiateur              |  0,96  |         0,95         |         0,94         |           —            |                                    |
|                                                         | Plafond chauffant      |  0,96  |         0,95         |         0,94         |           —            |                                    |
|                                                         | Plancher chauffant     |  0,97  |         0,96         |         0,95         |           —            |                                    |

**Valeurs de $I_0$ — Immeubles collectifs avec chauffage collectif**

|                                                         |                    | Absence de comptage individuel |                   |                               | Présence d'un comptage individuel |                   |                               |
| :------------------------------------------------------ | :----------------- | :----------------------------: | :---------------: | :---------------------------: | :-------------------------------: | :---------------: | :---------------------------: |
|                                                         |                    |             Absent             | Central collectif | Central collectif + détection |              Absent               | Central collectif | Central collectif + détection |
| **Chauffage central** — avec régulation pièce par pièce | Air soufflé        |              1,01              |       0,99        |             0,96              |               0,93                |       0,91        |             0,88              |
|                                                         | Radiateur          |              1,03              |       1,01        |             0,98              |               0,95                |       0,93        |             0,90              |
|                                                         | Plafond chauffant  |              1,03              |       1,01        |             0,98              |               0,95                |       0,93        |             0,90              |
|                                                         | Plancher chauffant |              1,05              |       1,03        |               —               |               0,97                |       0,95        |               —               |
| **Chauffage central** — sans régulation pièce par pièce | Air soufflé        |              1,03              |       1,01        |                               |               0,95                |       0,93        |                               |
|                                                         | Radiateur          |              1,05              |       1,03        |                               |               0,97                |       0,95        |                               |
|                                                         | Plafond chauffant  |              1,05              |       1,03        |                               |               0,97                |       0,95        |                               |
|                                                         | Plancher chauffant |              1,07              |       1,05        |                               |               0,99                |       0,97        |                               |

En immeuble collectif, le chauffage mixte, c'est-à-dire dont une partie est facturée collectivement et une autre individuellement, est traité au niveau de l'intermittence comme un système collectif avec comptage individuel.

Seule l'intermittence de l'appoint est prise en compte sur les installations base + appoint. Une régulation zonale peut être considérée comme une régulation pièce par pièce.

L'équipement d'intermittence peut être :

- En chauffage individuel :
  - **Absent** : pas d'équipement permettant de programmer des réduits de température.
  - **Central sans minimum de température** : équipements permettant une programmation seulement de la fonction marche/arrêt et ne garantissant pas un minimum de température.
  - **Central avec un minimum de température** : équipement pouvant assurer :
    - centralement un ralenti ou un abaissement de température fixe, non modifiable par l'occupant, ainsi que la fonction hors gel ;
    - centralement un ralenti ou un abaissement de température au choix de l'occupant.
  - **Pièce par pièce avec minimum de température** : équipement permettant d'obtenir par pièce un ralenti ou un abaissement de température fixe, non modifiable par l'occupant.

- En chauffage collectif :
  - **Absent** : pas de réduit de nuit.
  - **Central collectif** : possibilité de ralenti de nuit.

Un plancher chauffant avec une régulation zone jour/zone nuit peut être associé à une régulation pièce par pièce.

Un poêle sera modélisé comme un radiateur/convecteur pour la détermination de l'intermittence.

Un système de chauffage divisé est un système pour lequel la génération et l'émission sont confondues. C'est le cas des convecteurs électriques, planchers chauffants électriques, …

Un système de chauffage central comporte un générateur central, individuel ou collectif, et une distribution par fluide chauffant : air ou eau.
