## 12 Rendements des installations

Les rendements des installations sont calculés annuellement.

### 12.1 Rendement d'émission

| Type d'émetteurs                                             | $Re$  |
| :----------------------------------------------------------- | :---: |
| Convecteur électrique NFC, NF** et NF***                     | 0,95  |
| Panneau rayonnant ou radiateur électrique NFC, NF** et NF*** | 0,97  |
| Autres émetteurs à effet joule                               | 0,95  |
| Soufflage d'air chaud                                        | 0,95  |
| Plancher chauffant                                           |   1   |
| Plafond chauffant                                            | 0,98  |
| Autres équipements                                           | 0,95  |

### 12.2 Rendement de distribution

| Type de distribution                                               | $Rd$ non isolé | $Rd$ isolé |
| :----------------------------------------------------------------- | :------------: | :--------: |
| Pas de réseau de distribution                                      |       1        |     1      |
| Réseau aéraulique                                                  |      0,80      |    0,85    |
| Réseau collectif eau chaude haute température (≥ 65°C)             |      0,85      |    0,87    |
| Réseau collectif eau chaude moyenne ou basse température (< 65°C)  |      0,87      |    0,90    |
| Réseau individuel eau chaude moyenne ou basse température (< 65°C) |      0,91      |    0,95    |
| Réseau individuel eau chaude haute température (≥ 65°C)            |      0,88      |    0,92    |

Les réseaux de distribution par fluide frigorigène sont considérés sans pertes ($Rd = 1$).

### 12.3 Rendement de régulation

| Type d'équipements                                                 | $Rr$  |
| :----------------------------------------------------------------- | :---: |
| Convecteur électrique NFC, NF** et NF***                           | 0,99  |
| Panneau rayonnant ou radiateur électrique NFC, NF** et NF***       | 0,99  |
| Autres émetteurs à effet joule                                     | 0,96  |
| Plancher ou plafond rayonnant électrique avec régulation terminale | 0,98  |
| Plancher ou plafond rayonnant électrique sans régulation           | 0,96  |
| Radiateur électrique à accumulation                                | 0,95  |
| Plancher ou plafond chauffant à eau en individuel                  | 0,95  |
| Plancher ou plafond chauffant à eau en collectif                   | 0,90  |
| Radiateur gaz à ventouse ou sur conduit de fumée                   | 0,96  |
| Poêle charbon / bois / fioul / GPL ou insert                       | 0,80  |
| Radiateur eau chaude sans robinet thermostatique                   | 0,90  |
| Radiateur eau chaude avec robinet thermostatique                   | 0,95  |
| Convecteur bi-jonction                                             | 0,90  |
| Air soufflé                                                        | 0,96  |
| Pour tous les cas non listés                                       | 0,90  |

### 12.4 Rendement de génération des générateurs autres qu'à combustion

#### 12.4.1 Générateurs à effet joule et réseaux de chaleur

| Type de générateur              | $Rg$  |
| :------------------------------ | :---: |
| Générateur à effet joule direct |   1   |
| Chaudières électriques          | 0,97  |
| Réseau de chaleur               | 0,97  |

Un chauffe-eau électrique instantané est assimilé à un ballon électrique au niveau du modèle mais sans les pertes de stockage.

La modélisation pour les chaudières électriques mixtes (chauffage et ECS) est identique à celle d'une chaudière électrique et d'un ballon électrique selon qu'il y ait stockage ou pas.

#### 12.4.2 Pompe à Chaleur

Les performances des PAC sont définies par leur SCOP qui dépend de leur type et de la zone climatique.

Le SCOP réel de la PAC peut être saisi directement quand il est connu et justifié. À défaut de disposer des performances réelles des PAC, les valeurs par défaut tabulées ci-dessous sont utilisables.

| Type de PAC — Zone H1 et H2 | Type d'émetteur      | Avant 2008* | 2008–2014 | 2015–2016 | À partir de 2017 |
| :-------------------------- | :------------------- | :---------: | :-------: | :-------: | :--------------: |
| PAC Air/Eau                 | Autres               |     2,2     |    2,4    |    2,6    |       2,8        |
|                             | Planchers / Plafonds |     2,4     |    2,6    |    2,9    |       3,2        |
| PAC Eau/Eau                 | Autres               |     2,2     |    2,4    |    2,7    |       3,0        |
|                             | Planchers / Plafonds |     2,4     |    2,6    |    3,0    |       3,3        |
| PAC Eau glycolée/Eau        | Autres               |     2,2     |    2,4    |    2,7    |       3,0        |
|                             | Planchers / Plafonds |     2,4     |    2,6    |    3,0    |       3,3        |
| PAC Géothermie              | Autres               |     2,2     |    2,4    |    2,7    |       3,0        |
|                             | Planchers / Plafonds |     2,4     |    2,6    |    3,0    |       3,3        |

| Type de PAC — Zone H3 | Type d'émetteur      | Avant 2008* | 2008–2014 | 2015–2016 | À partir de 2017 |
| :-------------------- | :------------------- | :---------: | :-------: | :-------: | :--------------: |
| PAC Air/Eau           | Autres               |     2,5     |    2,8    |    3,0    |       3,2        |
|                       | Planchers / Plafonds |     2,9     |    3,1    |    3,5    |       3,8        |
| PAC Eau/Eau           | Autres               |     2,5     |    2,8    |    3,1    |       3,5        |
|                       | Planchers / Plafonds |     2,9     |    3,1    |    3,6    |       4,0        |
| PAC Eau glycolée/Eau  | Autres               |     2,5     |    2,8    |    3,1    |       3,5        |
|                       | Planchers / Plafonds |     2,9     |    3,1    |    3,6    |       4,0        |
| PAC Géothermie        | Autres               |     2,5     |    2,8    |    3,1    |       3,5        |
|                       | Planchers / Plafonds |     2,9     |    3,1    |    3,6    |       4,0        |

|   PAC Air/Air    | Zone H1 et H2 | Zone H3 |       |
| :--------------: | :-----------: | :-----: | :---: |
|   Avant 2008*    |      2,2      |   2,4   |       |
|    2008–2014     |      2,3      |   2,6   |       |
| À partir de 2015 |      3,0      |   3,3   |       |

*COP

L'inverse du rendement de l'installation s'exprimera alors comme :

$$Ich = \frac{1}{SCOP * Re * Rd * Rr}$$

Dans le cas où plusieurs émetteurs sont reliés à la PAC, le COP le plus défavorable sera pris pour le calcul d'$Ich$.
