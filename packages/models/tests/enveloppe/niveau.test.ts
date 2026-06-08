import { describe, expect, it } from 'vitest'
import { isNiveau, type Niveau } from '../../src/enveloppe/niveau.js'
import { UUID } from '../helpers.js'

describe('isNiveau — guard', () => {
  it('accepte un niveau valide sans inertie', () => {
    const niveau: Niveau = {
      id: UUID,
      description: 'RDC',
      surface: 80,
      inertie_paroi_verticale: null,
      inertie_plancher_bas: null,
      inertie_plancher_haut: null,
    }
    expect(isNiveau(niveau)).toBe(true)
  })

  it('accepte un niveau valide avec inertie', () => {
    const niveau: Niveau = {
      id: UUID,
      description: 'Étage',
      surface: 80,
      inertie_paroi_verticale: 'lourde',
      inertie_plancher_bas: 'legere',
      inertie_plancher_haut: 'lourde',
    }
    expect(isNiveau(niveau)).toBe(true)
  })
})
