import { describe, expect, it } from 'vitest'
import { isBatiment, type Maison, type Immeuble } from '../../src/batiment/batiment.js'
import { type Appartement } from '../../src/batiment/appartement.js'
import { UUID, UUID2, ADRESSE, p } from '../helpers.js'

const APPT: Appartement = {
  id: UUID2,
  description: 'T2 étage',
  surface_habitable: p(50),
  hauteur_sous_plafond: p(2.5),
  position: 'etage_intermediaire',
  typologie: 'T2',
}

describe('isBatiment — guard', () => {
  it('accepte une Maison valide', () => {
    const maison: Maison = {
      type: 'maison',
      annee_construction: 1990,
      annee_renovation: null,
      altitude: 100,
      logements: 1,
      surface_habitable: p(80),
      hauteur_sous_plafond: p(2.5),
      materiaux_anciens: false,
      rnb_id: null,
      adresse: ADRESSE,
      appartements_visites: [],
      logement: null,
    }
    expect(isBatiment(maison)).toBe(true)
  })

  it('accepte un Immeuble valide', () => {
    const immeuble: Immeuble = {
      type: 'immeuble',
      annee_construction: 1970,
      annee_renovation: 2010,
      altitude: 50,
      logements: p(10),
      surface_habitable: p(800),
      hauteur_sous_plafond: p(2.7),
      materiaux_anciens: false,
      rnb_id: null,
      adresse: ADRESSE,
      appartements_visites: [APPT],
      logement: null,
    }
    expect(isBatiment(immeuble)).toBe(true)
  })
})
