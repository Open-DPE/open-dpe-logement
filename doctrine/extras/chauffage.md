# Calcul des consommations de chauffage

---

Dans ce qui suit :

- Une **installation** correspond à une surface chauffée par un ou plusieurs **systèmes**.
- Un **système** correspond à un générateur de chauffage associé à N émetteurs.
- Un **système de chauffage central** comporte un générateur central, individuel ou collectif, et une distribution par fluide chauffant : air ou eau.
- Un **système de chauffage divisé** est un système pour lequel la génération et l’émission sont confondues. C’est le cas des convecteurs électriques, planchers chauffants électriques...

---

Les consommations de chauffage sont la somme des consommations des systèmes de chauffage :

$$Cch = \sum_{i,k} Cch_{i,k}$$
$$Cch_{i,k} = \sum_{i,k} Bch \cdot (1 - Fch_i) \cdot Rdim_i \cdot Rdim_{i,k} \cdot INT_{i,k} \cdot Ich_{i,k}$$

Avec :

- $Bch$ : Besoins de chauffage exprimés en kWh (voir 9.1.1)
- $Cch_{i,k}$ : Consommations de chauffage du système $k$ associé à l'installation $i$
- $Fch_i$ : Facteur de couverture solaire de l'installation $i$
- $Rdim_{i,k}$ : Ratio de dimensionnement du système $k$ associé à l'installation $i$
- $INT_{i,k}$ : Facteur d'intermittence du système $k$ associé à l'installation $i$
- $Ich_{i,k}$ : Inverse du rendement du système $k$ associé à l'installation $i$

## Systèmes avec plusieurs émissions différentes

Ce cas correspond aux systèmes de chauffage central avec plusieurs émetteurs de types différents.

Les consommations associées à ces systèmes sont :

$$Cch_{i,k} = \sum_e Bch \cdot (1 - Fch_i) \cdot Rdim_i \cdot Rdim_{i,k} \cdot INT_{i,k,e} \cdot Ich_{i,k,e} \cdot \frac{1}{N}$$

Avec :

- $N$ : Nombre d'émetteurs associés au système
- $INT_{i,k,e}$ : Facteur d'intermittence du système $k$ associé à l'installation $i$ pour l'émetteur $e$
- $Ich_{i,k,e}$ : Inverse du rendement du système $k$ associé à l'installation $i$ pour l'émetteur $e$

$$Ich_{i,k,e} = \frac{1}{Rg_{i,k} \cdot Rd_{i,k,e} \cdot Re_{i,k,e} \cdot Rr_{i,k,e}}$$

Avec :

- $Rg_{i,k}$ : Rendement de génération du système $k$ associé à l'installation $i$
- $Rd_{i,k,e}$ : Rendement de distribution du système $k$ associé à l'installation $i$ pour l'émetteur $e$
- $Re_{i,k,e}$ : Rendement d'émission du système $k$ associé à l'installation $i$ pour l'émetteur $e$
- $Rr_{i,k,e}$ : Rendement de régulation du système $k$ associé à l'installation $i$ pour l'émetteur $e$

Les rendements de distribution, d'émission et de régulation de chaque système peuvent être obtenus en faisant la moyenne des rendements des émetteurs associés.

## Générateur bi-énergie

Pour les générateurs pouvant fonctionner avec deux énergies différentes (selon le choix de l'occupant), chaque énergie couvre forfaitairement 50 % de la consommation :

$$Cch1_{i,k} = 0.5 \cdot Cch_{i,k} \qquad Cch2_{i,k} = 0.5 \cdot Cch_{i,k}$$

## Facteur de couverture solaire

Le facteur de couverture solaire est déterminé pour chaque installation de chauffage.

En immeuble collectif :

$$Fch = 0$$

En maison individuelle et en présence d'une installation de chauffage avec production solaire thermique :

| Zone climatique | $Fch$ |
| :-------------: | :---: |
|       H1a       | 0.25  |
|       H1b       | 0.22  |
|       H1c       | 0.28  |
|       H2a       | 0.34  |
|       H2b       | 0.33  |
|       H2c       | 0.38  |
|       H2d       | 0.39  |
|       H3        | 0.52  |

$Fch$ peut être saisi directement s'il est connu et justifié.

## Coefficient d'intermittence

Le facteur d'intermittences $INT$ est déterminé pour chaque générateur associé à chaque installation de chauffage.

$$INT = \frac{I0}{1 + 0.1 \cdot (G - 1)} \qquad G = \frac{GV}{Hsp \cdot Sh}$$

Avec :

- $I0$ : Coefficient d'intermittence
- $GV$ : Déperditions thermiques de l'enveloppe en W/K
- $Hsp$ : Hauteur sous plafond moyenne en m
- $Sh$ : Surface habitable en m²

### Coefficient d'intermittence $I0$

Le coefficient d'intermittence $I0$ est déterminé pour chaque générateur associé à chaque installation depuis la table de valeurs `chauffage.i0` en fonction :

- du type de bâtiment ;
- du type de chauffage (central ou divisé) ;
- du type d'émission (radiateur, plancher chauffant, plafond chauffant, air soufflé) ;
- de l'inertie de l'enveloppe ;
- du type d'installation (collective ou individuelle) ;
- de la présence d'un comptage individuel dans le cas des installations collectives ;
- de la présence d'une régulation pièce par pièce ;
- du type de programmation central.

#### Cas des convecteurs bi-jonction

> La base et l'appoint sont assurés par un même convecteur disposant d'un circuit collectif alimentant la base et un circuit individuel pour l'appoint.

Le coefficient d'intermittence $I0$ est ainsi déterminé :

$$I0 = 0.60 \qquad * I0_{coll} + 0.40 \qquad * I0_{ind}$$

Avec :

- $I0_{coll}$ : Coefficient d'intermittence du circuit collectif (installation collective)
- $I0_{ind}$ : Coefficient d'intermittence du circuit individuel (installation individuelle)

## Configuration des installations de chauffage

Le ratio de dimensionnement $Rdim$ détermine la contribution de chaque installation et de chaque générateur associé à la couverture des besoins de chauffage.

$$Rdim_i = \frac{Sh_i}{Sh}$$

Avec :

- $Rdim_i$ : Ratio de dimensionnement de l'installation $i$
- $Sh_i$ : Surface habitable chauffée par l'installation $i$ en m²
- $Sh$ : Surface habitable totale en m²

### Installation de chauffage central

Une installation de chauffage central est composée d'au moins un système de chauffage central. Un système de chauffage central comporte un générateur central (individuel ou collectif) et une distribution par fluide chauffant (eau ou air).

|            Générateur            | Type de chauffage |
| :------------------------------: | :---------------: |
|            Chaudière             |      Central      |
|     Pompe à chaleur air/eau      |      Central      |
|     Pompe à chaleur eau/eau      |      Central      |
| Pompe à chaleur eau glycolée/eau |      Central      |
|   Pompe à chaleur géothermique   |      Central      |
|         Poêle bouilleur          |      Central      |
|        Réseau de chaleur         |      Central      |
|      Générateur d'air chaud      | Central ou divisé |
|     Pompe à chaleur air/air      | Central ou divisé |

Au sein d'une installation de chauffage central, chaque système est classé selon son rôle : **base**, **relève** ou **appoint**. Le ratio de dimensionnement $Rdim_k$ traduit la part du besoin de chauffage assurée par chaque rôle.

#### Systèmes en base

Sont considérés en base tous les systèmes de chauffage central qui ne sont pas classés en relève. La base couvre la part du besoin de chauffage non assurée par la relève ni par l'appoint :

$$Rdim_{base,i} = 1 - Rdim_{relève,i} - Rdim_{appoint,i}$$

En présence de plusieurs systèmes en base, la contribution de chaque système est pondérée au prorata des puissances nominales :

$$Rdim_{base,k} = Rdim_{base,i} \cdot \frac{Pn_{base,k}}{\sum_k Pn_{base,k}}$$

Si les puissances nominales ne sont pas connues, la contribution est répartie équitablement :

$$Rdim_{base,k} = \frac{Rdim_{base,i}}{N_{base,i}}$$

Avec $N_{base}$ le nombre de systèmes en base.

#### Systèmes en relève

Sont considérés en relève :

- Les **PAC ou chaudières en relève d'une chaudière bois** (chaudière bois en base) ;
- Les **chaudières en relève de PAC** (PAC en base).

Toutes les autres configurations de systèmes de chauffage central sont considérés en base.

La contribution forfaitaire de la relève aux besoins de chauffage dépend du type de relève, et est calculée sur la part du besoin non couverte par l'appoint :

|               Système en relève               |                     Contribution                      |
| :-------------------------------------------: | :---------------------------------------------------: |
| PAC ou chaudières en relève de chaudière bois | $Rdim_{relève,i} = 0.25 \cdot (1 - Rdim_{appoint,i})$ |
|          Chaudières en relève de PAC          | $Rdim_{relève,i} = 0.20 \cdot (1 - Rdim_{appoint,i})$ |

En l'absence de relève :

$$Rdim_{relève,i} = 0$$

En présence de plusieurs systèmes en relève, la contribution de chaque système est pondérée au prorata des puissances nominales :

$$Rdim_{relève,k} = Rdim_{relève,i} \cdot \frac{Pn_{relève,k}}{\sum_k Pn_{relève,k}}$$

Si les puissances nominales ne sont pas connues, la contribution est répartie équitablement :

$$Rdim_{relève,k} = \frac{Rdim_{relève,i}}{N_{relève,i}}$$

Avec $N_{relève,i}$ le nombre de systèmes en relève.

#### Systèmes d'appoint

Tous les systèmes de chauffage **divisé** associés à une installation de chauffage central sont considérés en appoint. Ils couvrent forfaitairement **25 %** du besoin de l'installation.

En l'absence d'appoint :

$$Rdim_{appoint,i} = 0$$

En présence d'un ou plusieurs systèmes d'appoint :

$$Rdim_{appoint,i} = 0.25$$

En présence de plusieurs systèmes d'appoint, la contribution de chaque système est pondérée au prorata des puissances nominales :

$$Rdim_{appoint,k} = Rdim_{appoint,i} \cdot \frac{Pn_{appoint,k}}{\sum_k Pn_{appoint,k}}$$

Si les puissances nominales ne sont pas connues, la contribution est répartie équitablement :

$$Rdim_{appoint,k} = \frac{Rdim_{appoint,i}}{N_{appoint,i}}$$

Avec $N_{appoint,i}$ le nombre de systèmes d'appoint.

### Installation de chauffage divisé

Une installation de chauffage divisé est composée uniquement de systèmes de chauffage divisé. Un système de chauffage divisé est un système pour lequel la génération et l'émission sont confondues : convecteurs électriques, planchers chauffants électriques, poêles, inserts, etc...

|             Générateur              | Type de chauffage |
| :---------------------------------: | :---------------: |
|       Générateur d'air chaud        | Central ou divisé |
|       Pompe à chaleur air/air       | Central ou divisé |
|       Convecteur bi-jonction        |      Divisé       |
|        Convecteur électrique        |      Divisé       |
|    Panneau rayonnant électrique     |      Divisé       |
|    Plafond rayonnant électrique     |      Divisé       |
|    Plancher rayonnant électrique    |      Divisé       |
|        Radiateur électrique         |      Divisé       |
| Radiateur électrique à accumulation |      Divisé       |
|             Cuisinière              |      Divisé       |
|             Foyer fermé             |      Divisé       |
|               Insert                |      Divisé       |
|                Poêle                |      Divisé       |
|            Radiateur gaz            |      Divisé       |

Le ratio de dimensionnement est calculé au prorata des puissances nominales :

$$Rdim_k = \frac{Pn_k}{\sum_k Pn_k}$$

Si les puissances nominales ne sont pas connues :

$$Rdim_k = \frac{1}{N_i}$$

Avec $N_i$ le nombre de générateurs de l'installation.

### Installation de chauffage avec système(s) collectif(s) + appoint(s) individuel(s)

Cette configuration correspond à un bâtiment collectif disposant d'une chaufferie collective complétée par des systèmes de chauffage individuels par logement.

Le besoin de chauffage est partagé entre générateurs collectifs et individuels selon le ratio thermique DHT/DH14 :

$$Bch_{coll} = Bch \cdot (1 - \frac{DHT}{DH14}) \qquad Bch_{ind} = Bch - Bch_{coll}$$

Les systèmes collectifs et individuels couplés ou divisés constituent deux configurations de chauffage relevant des paragraphes précédents.

### Installation principale avec chauffage électrique dans la salle de bains

On considère deux installations distinctes :

- Une installation de chauffage principale, traitée selon les sections précédentes ;
- Une installation de chauffage dédiée à la salle de bains.

## Puissances de chauffage

La puissance de chauffage conventionnelle $Pch$ est calculée sur la base du coefficient de déperdition thermique GV de l'immeuble, conformément au §13.2.2.4.

### Puissance de chauffage par installation

$$Pch_i = Pch \cdot Rdim_i$$

### Puissance de chauffage des générateurs

En l'absence d'information sur la puissance nominale des générateurs :

$$Pch_g = \sum_k Pch_k$$

Avec $Pch_k$ la puissance conventionnelle de chauffage du générateur associé à chaque installation.

En présence d'une configuration de chauffage avec système(s) collectif(s) + appoint(s) individuel(s), la somme des puissances des générateurs individuels associés est considérée couvrir 50% des besoins :

$$Pch_k = Pch \cdot 0.5 \cdot \frac{1}{N}$$

Dans tous les autres cas, la puissance de chauffage est répartie équitablement entre tous les générateurs associés :

$$Pch_k = Pch \cdot \frac{1}{N}$$
