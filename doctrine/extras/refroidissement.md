# Calcul des consommations de refroidissement

## Prise en compte de plusieurs systèmes de refroidissement différents

La contribution de chaque générateur aux consommations de refroidissement est ainsi déterminée :

$$Cfr_{i,g} = 0.9 \cdot \frac{Bfr}{EER} \cdot Rdim_{i,g}$$

$$Rdim_{i,g} = Rdim_i \cdot \frac{1}{N_i}$$

$$Rdim_i = \frac{sh_i}{sh}$$

Avec :

- $Rdim_i$ : Ratio de dimensionnement de l'installation $i$
- $Rdim_{i,g}$ : Ratio de dimensionnement du générateur $g$ associé à l'installation $i$
- $N_i$ : Nombre de générateurs associés à l'installation $i$
