# Catalogue des données calculées

## `diagnostic` — Consommation globale

| Champ  |            Description            |  Unité  |
| :----: | :-------------------------------: | :-----: |
| `cep`  |  Consommation d'énergie primaire  |   kWh   |
| `eges` | Emissions de gaz à effet de serre | kgCO2eq |

## `batiment`

|         Champ         |      Description       | Unité |
| :-------------------: | :--------------------: | :---: |
| `ratio_proratisation` | Ratio de proratisation |   —   |

## `climat`

|       Champ       |              Description              | Unité |
| :---------------: | :-----------------------------------: | :---: |
| `zone_climatique` |      Zone climatique du bâtiment      |   —   |
|      `tbase`      |    Température extérieure de base     |  °C   |
| `sollicitations`  | Sollicitations climatiques mensuelles |   —   |
|       `nj`        |       Nombre de jours par mois        |   —   |

## `eclairage`

|  Champ  |         Description         | Unité  |
| :-----: | :-------------------------: | :----: |
| `cecl`  |  Consommation d'éclairage   | kWh/an |
| `nhecl` | Nombre d'heures d'éclairage |  h/an  |

## `enveloppe`

|           Champ           |                         Description                          |   Unité   |
| :-----------------------: | :----------------------------------------------------------: | :-------: |
|           `gv`            |            Déperditions thermiques de l'enveloppe            |    W/K    |
|          `ubat`           |         Coefficient de transmission thermique moyen          | W/(K·m²)  |
|           `dp`            |            Déperditions thermiques par les parois            |    W/K    |
|           `dr`            |       Déperditions thermiques par renouvellement d'air       |    W/K    |
|         `inertie`         |                    Inertie de l'enveloppe                    |     —     |
|          `hperm`          | Déperditions thermiques par renouvellement d'air due au vent |    W/K    |
|          `qvinf`          |                Débit d'air par infiltrations                 |   m³/h    |
|           `n50`           |               Renouvellement d'air sous 50 Pa                |    h⁻¹    |
|          `q4pa`           |              Perméabilité de la zone sous 4 Pa               |   m³/h    |
|         `q4paenv`         |                 Perméabilité de l'enveloppe                  |   m³/h    |
|        `q4paconv`         |                 Perméabilité conventionnelle                 | m³/(h·m²) |
| `isolation_murs_plafonds` |             Isolation majoritaire murs/plafonds              |   bool    |
|     `presence_joints`     |        Présence majoritaire de joints aux ouvertures         |   bool    |
|    `parois_anciennes`     |           Présence majoritaire de parois anciennes           |   bool    |
|           `sse`           |            Surface sud équivalente de l'enveloppe            |    m²     |

## `enveloppe:baie`

|      Champ      |                         Description                          |  Unité   |
| :-------------: | :----------------------------------------------------------: | :------: |
|      `aiu`      |     Surface de la baie donnant sur un local non chauffé      |    m²    |
| `isolation_aiu` | État d'isolation de la baie donnant sur un local non chauffé |    —     |
|     `sdep`      |                  Surface déperditive du mur                  |    m²    |
|       `b`       | Coefficient de réduction des déperditions thermiques du mur  |    —     |
|      `ug`       |       Coefficient de transmission thermique du vitrage       | W/(m²·K) |
|      `uw`       |    Coefficient de transmission thermique de la menuiserie    | W/(m²·K) |
|      `uw`       |    Coefficient de transmission thermique de la menuiserie    | W/(m²·K) |
|       `u`       |       Coefficient de transmission thermique de la baie       | W/(m²·K) |
|      `dp`       |              Déperditions thermiques de la baie              |   W/K    |
|      `sse`      |              Surface sud équivalente de la baie              | m²/mois  |

## `enveloppe:mur`

|      Champ      |                         Description                         |  Unité   |
| :-------------: | :---------------------------------------------------------: | :------: |
|      `aiu`      |       Surface du mur donnant sur un local non chauffé       |    m²    |
| `isolation_aiu` |  État d'isolation du mur donnant sur un local non chauffé   |    —     |
|     `sdep`      |                 Surface déperditive du mur                  |    m²    |
|       `b`       | Coefficient de réduction des déperditions thermiques du mur |    —     |
|       `u`       |        Coefficient de transmission thermique du mur         | W/(m²·K) |
|      `u0`       |   Coefficient de transmission thermique du mur non isolé    | W/(m²·K) |
|      `dp`       |               Déperditions thermiques du mur                |   W/K    |

## `enveloppe:plancher-haut`

|      Champ      |                              Description                              |  Unité   |
| :-------------: | :-------------------------------------------------------------------: | :------: |
|      `aiu`      |       Surface du plancher haut donnant sur un local non chauffé       |    m²    |
| `isolation_aiu` |  État d'isolation du plancher haut donnant sur un local non chauffé   |    —     |
|     `sdep`      |                 Surface déperditive du plancher haut                  |    m²    |
|       `b`       | Coefficient de réduction des déperditions thermiques du plancher haut |    —     |
|       `u`       |        Coefficient de transmission thermique du plancher haut         | W/(m²·K) |
|      `u0`       |   Coefficient de transmission thermique du plancher haut non isolé    | W/(m²·K) |
|      `dp`       |               Déperditions thermiques du plancher haut                |   W/K    |

## `enveloppe:plancher-bas`

|      Champ      |                             Description                              |  Unité   |
| :-------------: | :------------------------------------------------------------------: | :------: |
|      `aiu`      |       Surface du plancher bas donnant sur un local non chauffé       |    m²    |
| `isolation_aiu` |  État d'isolation du plancher bas donnant sur un local non chauffé   |    —     |
|     `sdep`      |                 Surface déperditive du plancher bas                  |    m²    |
|       `b`       | Coefficient de réduction des déperditions thermiques du plancher bas |    —     |
|       `u`       |        Coefficient de transmission thermique du plancher bas         | W/(m²·K) |
|      `u0`       |   Coefficient de transmission thermique du plancher bas non isolé    | W/(m²·K) |
|      `dp`       |               Déperditions thermiques du plancher bas                |   W/K    |

## `enveloppe:pont-thermique`

| Champ |          Description           |  Unité  |
| :---: | :----------------------------: | :-----: |
| `pt`  | Déperditions du pont thermique |   W/K   |
| `kpt` |    Valeur du pont thermique    | W/(m·K) |

## `enveloppe:porte`

|      Champ      |                           Description                            |  Unité   |
| :-------------: | :--------------------------------------------------------------: | :------: |
|      `aiu`      |       Surface de la porte donnant sur un local non chauffé       |    m²    |
| `isolation_aiu` |  État d'isolation de la porte donnant sur un local non chauffé   |    —     |
|     `sdep`      |                 Surface déperditive de la porte                  |    m²    |
|       `b`       | Coefficient de réduction des déperditions thermiques de la porte |    —     |
|       `u`       |        Coefficient de transmission thermique de la porte         | W/(m²·K) |
|      `dp`       |               Déperditions thermiques de la porte                |   W/K    |

## `enveloppe:local-non-chauffe`

|      Champ      |                              Description                              |  Unité   |
| :-------------: | :-------------------------------------------------------------------: | :------: |
|       `b`       | Coefficient de réduction des déperditions de l'espace tampon solarisé |    —     |
|      `aue`      |        Surface des parois entre l'espace tampon et l'extérieur        |    m²    |
|      `aiu`      |     Surface des parois entre la zone chauffée et l'espace tampon      |    m²    |
|     `uvue`      |      Coefficient de transmission moyen des parois espace tampon       | W/(m²·K) |
| `isolation_aue` |                  Isolation des parois côté extérieur                  |   bool   |
| `isolation_aiu` |                  Isolation des parois côté intérieur                  |   bool   |
|      `sse`      |          Surface sud équivalente de l'espace tampon solarisé          | m²/mois  |
|       `t`       |        Coefficient de transparence de l'espace tampon solarisé        |    —     |

## `enveloppe:local-non-chauffe:baie`

| Champ |                              Description                               | Unité |
| :---: | :--------------------------------------------------------------------: | :---: |
| `aue` |    Surface de la paroi du local non chauffé donnant sur l'extérieur    |  m²   |
| `aiu` | Surface de la paroi du local non chauffé donnant sur un espace chauffé |  m²   |
| `sst` |                   Surface sud équivalente de la baie                   |  m²   |
|  `t`  |                 Coefficient de transparence de la baie                 |   —   |

## `enveloppe:local-non-chauffe:paroi`

| Champ |                              Description                               | Unité |
| :---: | :--------------------------------------------------------------------: | :---: |
| `aue` |    Surface de la paroi du local non chauffé donnant sur l'extérieur    |  m²   |
| `aiu` | Surface de la paroi du local non chauffé donnant sur un espace chauffé |  m²   |

## `enveloppe:niveau`

|   Champ   |       Description        | Unité |
| :-------: | :----------------------: | :---: |
| `inertie` | État d'inertie du niveau |   —   |

## `chauffage`

|     Champ      |                  Description                   |  Unité   |
| :------------: | :--------------------------------------------: | :------: |
|     `cch`      |           Consommations de chauffage           |  kWh/an  |
|   `cch_elec`   |      Consommation électrique de chauffage      |  kWh/an  |
|     `caux`     |   Consommations des auxiliaires de chauffage   |  kWh/an  |
|   `caux_gen`   |  Consommations des auxiliaires de génération   |  kWh/an  |
|  `caux_dist`   | Consommations des auxiliaires de distribution  |  kWh/an  |
|     `bch`      |              Besoins de chauffage              | kWh/mois |
|    `bch_hp`    |         Besoins hors pertes récupérées         | kWh/mois |
|      `bv`      |         Besoins mensuels de chauffage          | kWh/mois |
|     `pch`      |             Puissance de chauffage             |    kW    |
|      `f`       | Fraction apports gratuits couvrant les besoins |    —     |
|      `as`      |                Apports solaires                | Wh/mois  |
|      `ai`      |                Apports internes                | Wh/mois  |
|   `qgw_rec`    |        Pertes de stockage récupérables         | Wh/mois  |
|   `qdw_rec`    |      Pertes de distribution récupérables       | Wh/mois  |
| `qgen_ecs_rec` |       Pertes de génération récupérables        | Wh/mois  |
| `effet_joule`  |     Chauffage majoritaire par effet joule      |   bool   |

## `chauffage:generateur`

|    Champ     |                   Description                    |  Unité  |
| :----------: | :----------------------------------------------: | :-----: |
|    `caux`    | Consommations auxiliaire de génération chauffage | kWh/an  |
|    `rdim`    |      Ratio de dimensionnement du générateur      |    —    |
|    `kpcs`    |          Facteur de conversion PCI/PCS           |    —    |
|     `pn`     |        Puissance nominale conventionnelle        |   kW    |
|    `pdim`    |           Puissance de dimensionnement           |   kW    |
|    `pch`     |       Puissance de chauffage du générateur       |   kW    |
|    `paux`    |        Puissance auxiliaire de génération        |   kW    |
|   `rpint`    |  Rendement à charge intermédiaire du générateur  |    —    |
|    `rpn`     |     Rendement à pleine charge du générateur      |    —    |
|    `qp0`     |          Pertes à l'arrêt du générateur          |   kW    |
| `pveilleuse` |     Puissance de la veilleuse du générateur      |    W    |
|    `qpx`     |        Pertes à charge partielle (`QPx`)         |    —    |
|    `scop`    |                 SCOP saisonnier                  |    —    |
|  `tfonc30`   |  Température de fonctionnement à 30% de charge   |   °C    |
|  `tfonc100`  |  Température de fonctionnement à 100% de charge  |   °C    |
|  `qgen_rec`  |        Pertes de génération récupérables         | Wh/mois |
|    `qgen`    |               Pertes de génération               |  Wh/an  |

## `chauffage:systeme`

|    Champ    |                  Description                  |  Unité   |
| :---------: | :-------------------------------------------: | :------: |
|    `cch`    |     Consommations du système de chauffage     |  kWh/an  |
| `caux_dist` |         Consommations du circulateur          |  kWh/an  |
|    `bch`    |        Besoins de chauffage proratisés        | kWh/mois |
|    `dht`    |      Degrés-heures température de départ      |    —     |
|    `ich`    |          Coefficient d'intermittence          |    —     |
|    `int`    | Coefficient d'intermittence de l'installation |    —     |
|   `rdim`    |      Ratio de dimensionnement du système      |    —     |
|   `role`    |     Rôle du système (base/relève/appoint)     |    —     |
|    `pch`    |       Puissance de chauffage du système       |    kW    |
| `pch_coll`  |        Puissance collective du système        |    kW    |
|  `pcircem`  |           Puissance du circulateur            |    W     |

## `chauffage:installation`

| Champ  |                  Description                  |  Unité   |
| :----: | :-------------------------------------------: | :------: |
| `bch`  | Besoins chauffage proratisés à l'installation | kWh/mois |
| `rdim` |  Ratio de dimensionnement de l'installation   |    —     |
| `pch`  |   Puissance de chauffage de l'installation    |    kW    |
| `fch`  |         Facteur de couverture solaire         |    —     |

## `chauffage:emetteur`

|    Champ     |                   Description                    | Unité |
| :----------: | :----------------------------------------------: | :---: |
| `delta_pem`  |          Perte de charge de l'émetteur           |  kPa  |
|    `fcot`    |     Coefficient de pondération de l'émetteur     |   —   |
| `dtheta_dim` | Chute nominale de température de dimensionnement |  °C   |

## `ecs`

|    Champ    |                Description                |  Unité   |
| :---------: | :---------------------------------------: | :------: |
|   `cecs`    |   Consommations d'eau chaude sanitaire    |  kWh/an  |
| `cecs_elec` |         Consommations électriques         |  kWh/an  |
| `caux_gen`  |  Consommations auxiliaires de génération  |  kWh/an  |
| `caux_dist` | Consommations auxiliaires de distribution |  kWh/an  |
|   `becs`    |                  Besoins                  | kWh/mois |
|   `nadeq`   |        Nombre d'adultes équivalent        |    —     |
|   `nmax`    |     Coefficient d'occupation maximal      |    —     |

## `ecs:systeme`

|    Champ    |                       Description                        |  Unité   |
| :---------: | :------------------------------------------------------: | :------: |
|   `cecs`    |      Consommation d'eau chaude sanitaire du système      |  kWh/an  |
| `caux_dist` | Consommations des auxiliaires de distribution du système |  kWh/an  |
|   `becs`    |   Besoins d'eau chaude sanitaire proratisés du système   | kWh/mois |
|   `rdim`    |           Ratio de dimensionnement du système            |    —     |
|   `iecs`    |          Coefficient d'intermittence du système          |    —     |

## `ecs:generateur`

|    Champ     |                     Description                      | Unité  |
| :----------: | :--------------------------------------------------: | :----: |
|    `cecs`    |  Consommations d'eau chaude sanitaire du générateur  | kWh/an |
|    `caux`    |     Consommations de l'auxiliaire de génération      | kWh/an |
|    `rdim`    |        Ratio de dimensionnement du générateur        |   —    |
|    `pecs`    |       Puissance conventionnelle du générateur        |   kW   |
|    `pdim`    |      Puissance de dimensionnement du générateur      |   kW   |
|     `pn`     |           Puissance nominale du générateur           |   kW   |
|    `paux`    |       Puissance de l'auxiliaire de génération        |   kW   |
|    `cop`     | Coefficient de performance énergétique du générateur |   —    |
|    `rpn`     |       Rendement à pleine charge du générateur        |   —    |
|    `qp0`     |            Pertes à l'arrêt du générateur            |   kW   |
| `pveilleuse` |       Puissance de la veilleuse du générateur        |   W    |
|    `qgw`     |           Pertes de stockage du générateur           | Wh/an  |
|    `qgen`    |          Pertes de génération du générateur          | Wh/an  |

## `ecs:installation`

|     Champ     |                        Description                         |  Unité   |
| :-----------: | :--------------------------------------------------------: | :------: |
|    `becs`     | Besoins d'eau chaude sanitaire proratisés à l'installation | kWh/mois |
|    `rdim`     |         Ratio de dimensionnement de l'installation         |    —     |
|    `fecs`     |               Facteur de couverture solaire                |    —     |
|     `qdw`     |                   Pertes de distribution                   |  Wh/an   |
| `qdw_ind_vc`  |     Pertes distribution individuelle en volume chauffé     |  Wh/an   |
| `qdw_col_vc`  |      Pertes distribution collective en volume chauffé      |  Wh/an   |
| `qdw_col_hvc` |     Pertes distribution collective hors volume chauffé     |  Wh/an   |

## `production`

|   Champ    |                    Description                     | Unité  |
| :--------: | :------------------------------------------------: | :----: |
|   `ppv`    |             Production photovoltaïque              | kWh/an |
| `celec_ac` | Électricité photovoltaïque autoconsommée par usage | kWh/an |

## `production:panneau-photovoltaique`

| Champ |                    Description                     |  Unité   |
| :---: | :------------------------------------------------: | :------: |
| `ppv` |        Production du panneau photovoltaïque        | kWh/mois |
| `kpv` | Coefficient de pondération orientation/inclinaison |    —     |

## `refroidissement`

|   Champ    |                      Description                      |  Unité   |
| :--------: | :---------------------------------------------------: | :------: |
|   `cfr`    |           Consommations de refroidissement            |  kWh/an  |
| `cfr_elec` |      Consommation électrique de refroidissement       |  kWh/an  |
|   `caux`   |   Consommations des auxiliaires de refroidissement    |  kWh/an  |
|   `bfr`    |              Besoins de refroidissement               | kWh/mois |
|   `fut`    |      Facteur d'utilisation des apports par mois       |    —     |
|   `rbth`   |           Ratio de bilan thermique par mois           |    —     |
|    `as`    |          Apports solaires de refroidissement          | Wh/mois  |
|    `ai`    |          Apports internes de refroidissement          | Wh/mois  |
|   `tint`   |           Température de consigne en froid            |    °C    |
|    `t`     | Constante de temps de la zone pour le refroidissement |    h     |
|   `cin`    |        Capacité thermique intérieure efficace         |   J/K    |

## `refroidissement:generateur`

| Champ  |                        Description                        | Unité  |
| :----: | :-------------------------------------------------------: | :----: |
| `cfr`  |      Consommations du générateur de refroidissement       | kWh/an |
| `caux` |        Consommation auxiliaire de refroidissement         | kWh/an |
| `rdim` | Ratio de dimensionnement du générateur de refroidissement |   —    |
| `eer`  |           Coefficient d'efficience énergétique            |   —    |

## `refroidissement:installation`

| Champ  |                          Description                          | Unité |
| :----: | :-----------------------------------------------------------: | :---: |
| `rdim` | Ratio de dimensionnement de l'installation de refroidissement |   —   |

## `ventilation`

|     Champ      |                   Description                    |   Unité   |
| :------------: | :----------------------------------------------: | :-------: |
|     `caux`     |   Consommations des auxiliaires de ventilation   |  kWh/an   |
|    `hvent`     | Déperditions thermiques par renouvellement d'air |    W/K    |
| `qvarep_conv`  |        Débit volumique moyen à reprendre         | m³/(h·m²) |
| `qvasouf_conv` |         Débit volumique moyen à souffler         | m³/(h·m²) |
|  `smea_conv`   | Somme moyenne modules d'entrée d'air sous 20 Pa  | m³/(h·m²) |

## `ventilation:installation`

|     Champ     |                        Description                        |   Unité   |
| :-----------: | :-------------------------------------------------------: | :-------: |
|    `caux`     |        Consommation de l'auxiliaire de ventilation        |  kWh/an   |
|  `pvent_moy`  |     Puissance moyenne de l'auxiliaire de ventilation      |     W     |
|     `rut`     |      Ratio du temps d'utilisation du mode mécanique       |     —     |
|    `rdim`     | Ratio de dimensionnement de l'installation de ventilation |     —     |
| `qvarep_conv` |         Débit volumique conventionnel à reprendre         | m³/(h·m²) |
| `qvarep_conv` |         Débit volumique conventionnel à souffler          | m³/(h·m²) |
| `qvarep_conv` |        Somme des modules d'entrée d'air sous 20 Pa        | m³/(h·m²) |
|    `hvent`    |     Déperditions thermiques par renouvellement d'air      |    W/K    |
