import { describe, expect, it } from 'vitest'
import { isPlancherBas, type PlancherBas } from '../../src/enveloppe/plancher-bas.js'
import { UUID, p, ISOLATION_SANS } from '../helpers.js'

describe('isPlancherBas — guard', () => {
  it('accepte un plancher bas extérieur sans isolation connue', () => {
    const plancherBas: PlancherBas = {
      id: UUID,
      description: 'Plancher bas sur vide sanitaire',
      type: null,
      inertie: null,
      annee_construction: null,
      annee_renovation: null,
      u0: null,
      u: null,
      position: {
        surface: p(80),
        mitoyennete: 'exterieur',
        local_non_chauffe_id: null,
        surface_ue: null,
        perimetre_ue: null,
      },
      isolation: ISOLATION_SANS,
    }
    expect(isPlancherBas(plancherBas)).toBe(true)
  })

  it('accepte un plancher bas sur terre-plein', () => {
    const plancherBas: PlancherBas = {
      id: UUID,
      description: 'Plancher bas sur terre-plein',
      type: 'dalle_beton',
      inertie: 'lourde',
      annee_construction: 1990,
      annee_renovation: null,
      u0: p(2.5),
      u: p(0.5),
      position: {
        surface: p(80),
        mitoyennete: 'terre_plein',
        local_non_chauffe_id: null,
        surface_ue: 80,
        perimetre_ue: 36,
      },
      isolation: ISOLATION_SANS,
    }
    expect(isPlancherBas(plancherBas)).toBe(true)
  })
})
