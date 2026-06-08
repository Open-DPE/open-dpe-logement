import { describe, expect, it } from 'vitest'
import { isAppartement, type Appartement } from '../../src/batiment/appartement.js'
import { UUID, p } from '../helpers.js'

describe('isAppartement — guard', () => {
  it('accepte un appartement valide', () => {
    const appartement: Appartement = {
      id: UUID,
      description: 'Appartement T2 au 3e étage',
      surface_habitable: p(50),
      hauteur_sous_plafond: p(2.5),
      position: 'etage_intermediaire',
      typologie: 'T2',
    }
    expect(isAppartement(appartement)).toBe(true)
  })
})
